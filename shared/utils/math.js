/**
 * Math utility for generating questions and answers
 */

/**
 * Generate a random integer between min and max (inclusive)
 * @param {number} min - Minimum value
 * @param {number} max - Maximum value
 * @returns {number} Random integer
 */
function randomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

/**
 * Shuffle an array using Fisher-Yates algorithm
 * @param {Array} array - Array to shuffle
 * @returns {Array} New shuffled array
 */
function shuffle(array) {
  const result = [...array];
  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [result[i], result[j]] = [result[j], result[i]];
  }
  return result;
}

/**
 * Difficulty configuration for multiplication tables
 * Balanced so that easy questions don't appear on hard, and vice versa
 */
const MULTIPLICATION_CONFIG = {
  easy: {
    tables: [2, 3, 4, 5, 10],  // Simplest tables (2x, 10x, and easy single digits)
    range: [2, 10]  // Multiplied by 2-10
  },
  normal: {
    tables: [3, 4, 5, 6, 7, 8, 9],  // Mid-range tables (no super easy 2x/10x, no hardest 11x/12x)
    range: [2, 12]  // Multiplied by 2-12
  },
  hard: {
    tables: [6, 7, 8, 9, 11, 12],  // Hardest tables (no 2x or 10x)
    range: [2, 12],
    emphasize: [7, 9, 11, 12]  // More questions from the most challenging tables
  }
};

/**
 * Generate a multiplication question
 * @param {string} difficulty - Difficulty level (easy, normal, hard)
 * @returns {Object} Question object with text, answer, and type
 */
function generateMultiplication(difficulty = 'normal') {
  const config = MULTIPLICATION_CONFIG[difficulty] || MULTIPLICATION_CONFIG.normal;
  let tables = [...config.tables];

  // For hard mode, add emphasized tables multiple times
  if (difficulty === 'hard' && config.emphasize) {
    config.emphasize.forEach(num => {
      tables.push(num, num); // Add twice for emphasis
    });
  }

  const num1 = tables[randomInt(0, tables.length - 1)];
  const num2 = randomInt(config.range[0], config.range[1]);

  const answer = num1 * num2;

  return {
    type: 'multiplication',
    text: `${num1} × ${num2}`,
    num1,
    num2,
    operation: '×',
    answer
  };
}

/**
 * Difficulty configuration for addition/subtraction
 */
const ADD_SUB_CONFIG = {
  easy: {
    min: 10,
    max: 99  // 2-digit numbers
  },
  normal: {
    min: 10,
    max: 999  // 2-3 digit numbers
  },
  hard: {
    min: 100,
    max: 999  // 3-digit numbers
  }
};

/**
 * Generate an addition question
 * @param {string} difficulty - Difficulty level
 * @returns {Object} Question object
 */
function generateAddition(difficulty = 'normal') {
  const config = ADD_SUB_CONFIG[difficulty] || ADD_SUB_CONFIG.normal;

  const num1 = randomInt(config.min, config.max);
  const num2 = randomInt(config.min, config.max);
  const answer = num1 + num2;

  return {
    type: 'addition',
    text: `${num1} + ${num2}`,
    num1,
    num2,
    operation: '+',
    answer
  };
}

/**
 * Generate a subtraction question (ensures positive results)
 * @param {string} difficulty - Difficulty level
 * @returns {Object} Question object
 */
function generateSubtraction(difficulty = 'normal') {
  const config = ADD_SUB_CONFIG[difficulty] || ADD_SUB_CONFIG.normal;

  const num1 = randomInt(config.min, config.max);
  const num2 = randomInt(config.min, num1); // Ensure num2 <= num1 for positive result
  const answer = num1 - num2;

  return {
    type: 'subtraction',
    text: `${num1} − ${num2}`,
    num1,
    num2,
    operation: '−',
    answer
  };
}

/**
 * Generate plausible wrong answers for multiple choice
 * @param {number} correctAnswer - The correct answer
 * @param {number} count - Number of wrong answers to generate (default 5 for 6 total choices)
 * @param {Object} question - The question object for context
 * @returns {Array} Array of wrong answers (unique, not including correct)
 */
function generateWrongAnswers(correctAnswer, count = 5, question = null) {
  const wrongAnswers = new Set();

  // Strategy for multiplication: 3 off-by-one factor errors + 2 random numbers
  if (question && question.type === 'multiplication') {
    // Generate all 4 possible off-by-one factor errors
    const offByOneErrors = [
      (question.num1 - 1) * question.num2,  // First factor - 1
      (question.num1 + 1) * question.num2,  // First factor + 1
      question.num1 * (question.num2 - 1),  // Second factor - 1
      question.num1 * (question.num2 + 1)   // Second factor + 1
    ].filter(val => val > 0 && val !== correctAnswer);

    // Remove duplicates (e.g., 12×12 has duplicates)
    const uniqueErrors = [...new Set(offByOneErrors)];

    // Separate errors into those below and above correct answer
    const errorsBelow = uniqueErrors.filter(e => e < correctAnswer);
    const errorsAbove = uniqueErrors.filter(e => e > correctAnswer);

    // Choose strategy for positioning (determines which errors to select)
    // 10% each: extreme low, extreme high, or 80% balanced
    const strategy = Math.random();
    let selectedErrors = [];
    let numRandoms = 2;  // Default: 2 random numbers

    if (strategy < 0.1 && errorsAbove.length >= 1) {
      // EXTREME: Favor positions 0-1 (correct answer is smallest or second smallest)
      // Use only 1-2 errors ABOVE, fill rest with randoms above
      selectedErrors = errorsAbove.slice(0, Math.min(2, errorsAbove.length));
      numRandoms = 5 - selectedErrors.length;  // Fill remaining slots with randoms
    } else if (strategy < 0.2 && errorsBelow.length >= 1) {
      // EXTREME: Favor positions 4-5 (correct answer is largest or second largest)
      // Use only 1-2 errors BELOW, fill rest with randoms below
      selectedErrors = errorsBelow.slice(0, Math.min(2, errorsBelow.length));
      numRandoms = 5 - selectedErrors.length;  // Fill remaining slots with randoms
    } else {
      // Balanced selection for middle positions (80% of the time)
      // Use 3 off-by-one errors (mix from both sides) + 2 randoms
      const shuffled = shuffle(uniqueErrors);
      selectedErrors = shuffled.slice(0, Math.min(3, shuffled.length));
      numRandoms = 5 - selectedErrors.length;
    }

    // Add selected errors to wrong answers
    selectedErrors.forEach(err => wrongAnswers.add(err));

    // Determine range for random numbers
    const allValues = [...selectedErrors, correctAnswer];
    const min = Math.min(...allValues);
    const max = Math.max(...allValues);
    const spread = Math.max(10, Math.floor((max - min) * 0.5));

    // Strategic placement of random numbers based on strategy
    let extendedMin, extendedMax;

    if (strategy < 0.1) {
      // Extreme low position: ALL randoms ABOVE max
      extendedMin = Math.max(correctAnswer + 1, max + 1);
      extendedMax = Math.max(extendedMin + 5, max + spread);
    } else if (strategy < 0.2) {
      // Extreme high position: ALL randoms BELOW min
      extendedMin = Math.max(1, min - spread);
      extendedMax = Math.min(correctAnswer - 1, min - 1);
      if (extendedMax < extendedMin) extendedMax = extendedMin; // Safety check
    } else {
      // Balanced strategy: randoms in extended range (both above and below)
      extendedMin = Math.max(1, min - spread);
      extendedMax = max + spread;
    }

    // Generate required number of random numbers in the chosen range
    let attempts = 0;
    while (wrongAnswers.size < count && attempts < 100) {
      const random = randomInt(extendedMin, extendedMax);
      if (random !== correctAnswer && random > 0 && !wrongAnswers.has(random)) {
        wrongAnswers.add(random);
      }
      attempts++;
    }
  }

  // Fallback strategy for non-multiplication or if we need more wrong answers
  while (wrongAnswers.size < count) {
    const spread = Math.max(10, Math.floor(correctAnswer * 0.3));
    const offset = randomInt(-spread, spread);
    const candidate = correctAnswer + offset;

    if (candidate > 0 && candidate !== correctAnswer) {
      wrongAnswers.add(candidate);
    }
  }

  // Convert to array and return exactly count wrong answers
  return Array.from(wrongAnswers).slice(0, count);
}

/**
 * Generate a complete question with multiple choice answers
 * @param {string} difficulty - Difficulty level
 * @param {boolean} forceMultiplication - Force a multiplication question
 * @returns {Object} Complete question with shuffled answers
 */
function generateQuestion(difficulty = 'normal', forceMultiplication = false) {
  let question;

  // 80% multiplication, 20% addition/subtraction (unless forced)
  if (forceMultiplication || Math.random() < 0.8) {
    question = generateMultiplication(difficulty);
  } else {
    // 50/50 between addition and subtraction
    question = Math.random() < 0.5
      ? generateAddition(difficulty)
      : generateSubtraction(difficulty);
  }

  // Generate wrong answers (5 wrong + 1 correct = 6 total choices)
  const wrongAnswers = generateWrongAnswers(question.answer, 5, question);

  // Create answer choices
  const choices = shuffle([question.answer, ...wrongAnswers]);

  return {
    ...question,
    choices,
    correctChoice: choices.indexOf(question.answer)
  };
}

/**
 * Generate a set of questions for a round
 * @param {number} count - Number of questions (default 12)
 * @param {string} difficulty - Difficulty level
 * @returns {Array} Array of question objects
 */
function generateQuestionSet(count = 12, difficulty = 'normal') {
  const questions = [];

  // Calculate how many should be addition/subtraction (20% = 2-3 out of 12)
  const addSubCount = Math.floor(count * 0.2);
  const multiplicationCount = count - addSubCount;

  // Generate multiplication questions
  for (let i = 0; i < multiplicationCount; i++) {
    questions.push(generateQuestion(difficulty, true));
  }

  // Generate addition/subtraction questions
  for (let i = 0; i < addSubCount; i++) {
    questions.push(generateQuestion(difficulty, false));
  }

  // Shuffle and ensure we return exactly count questions
  return shuffle(questions).slice(0, count).map((q, index) => ({
    ...q,
    id: index + 1
  }));
}

/**
 * Format time in seconds to MM:SS format
 * @param {number} seconds - Time in seconds
 * @returns {string} Formatted time
 */
function formatTime(seconds) {
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins}:${secs.toString().padStart(2, '0')}`;
}

/**
 * Calculate percentage
 * @param {number} correct - Number correct
 * @param {number} total - Total number
 * @returns {number} Percentage (0-100)
 */
function calculatePercentage(correct, total) {
  if (total === 0) return 0;
  return Math.round((correct / total) * 100);
}

/**
 * Make math utilities available globally
 */
window.MathUtils = {
  randomInt,
  shuffle,
  generateMultiplication,
  generateAddition,
  generateSubtraction,
  generateWrongAnswers,
  generateQuestion,
  generateQuestionSet,
  formatTime,
  calculatePercentage
};

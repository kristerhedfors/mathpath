class MemoryMatch {
  constructor(difficulty) {
    this.difficulty = difficulty;
    this.questions = [];
    this.answers = [];
    this.flippedCards = new Set();
    this.matchedPairs = new Set();
    this.selectedProblem = null;
    this.selectedAnswer = null;
    this.attempts = 0;
    this.correctMatches = 0;
    this.startTime = null;
    this.endTime = null;
    this.timerInterval = null;
    this.timeLimit = 180; // 3 minutes
    this.timeRemaining = this.timeLimit;
    this.gameEnded = false;
    this.showingError = false;
    this.errorCardId = null;
  }

  async initialize() {
    // Generate questions until we have 9 with unique answers
    let uniqueQuestions = [];
    const seenAnswers = new Set();

    while (uniqueQuestions.length < 9) {
      const questionSet = MathUtils.generateQuestionSet(15, this.difficulty);

      for (const q of questionSet) {
        if (!seenAnswers.has(q.answer) && uniqueQuestions.length < 9) {
          seenAnswers.add(q.answer);
          uniqueQuestions.push(q);
        }
      }
    }

    this.questions = uniqueQuestions.map((q, index) => ({
      id: `q-${index}`,
      problem: q.text,
      answer: q.answer,
      choices: q.choices
    }));

    // Create shuffled answers array for right grid
    // Each answer corresponds to exactly one question
    this.answers = [...this.questions]
      .sort(() => Math.random() - 0.5)
      .map((q, index) => ({
        id: `a-${index}`,
        questionId: q.id,
        answer: q.answer
      }));

    this.renderWelcome();
  }

  renderWelcome() {
    const player = PlayerStorage.getCurrentPlayer();
    const difficultyText = this.difficulty === 'easy' ? 'Easy' :
                          this.difficulty === 'medium' ? 'Medium' : 'Hard';

    document.getElementById('game-container').innerHTML = `
      <div class="welcome-screen">
        <div class="welcome-content">
          <div class="game-header">
            <h1 class="game-title">🧠 Memory Match</h1>
            <div class="header-controls">
              <div id="game-switcher-container"></div>
              <div id="player-switcher-container"></div>
            </div>
          </div>

          <div class="welcome-card">
            <h2>Welcome, ${player}!</h2>
            <p class="difficulty-badge">Difficulty: ${difficultyText}</p>

            <div class="instructions">
              <h3>How to Play:</h3>
              <ul>
                <li><strong>Flip any card:</strong> Click any card from either grid to start</li>
                <li><strong>Find the match:</strong> Click the matching card from the other grid</li>
                <li><strong>Match:</strong> Correct matches stay revealed and highlighted</li>
                <li><strong>Goal:</strong> Match all 9 pairs in the fewest attempts possible</li>
                <li><strong>Time Limit:</strong> 3 minutes to complete the challenge</li>
              </ul>
            </div>

            <button class="btn btn-primary btn-lg" id="start-btn">
              Start Game 🧠
            </button>
          </div>
        </div>
      </div>
    `;

    createGameSwitcher('#game-switcher-container', 'memory-match');
    createPlayerSwitcher('#player-switcher-container', () => {
      window.location.reload();
    });

    document.getElementById('start-btn').addEventListener('click', () => {
      this.start();
    });
  }

  start() {
    this.startTime = Date.now();
    this.startTimer();
    this.render();
  }

  startTimer() {
    this.timerInterval = setInterval(() => {
      this.timeRemaining--;

      const timerElement = document.getElementById('timer');
      if (timerElement) {
        timerElement.textContent = MathUtils.formatTime(this.timeRemaining);

        if (this.timeRemaining <= 10) {
          timerElement.classList.add('warning');
        }
      }

      if (this.timeRemaining <= 0) {
        this.endGame('timeout');
      }
    }, 1000);
  }

  render() {
    document.getElementById('game-container').innerHTML = `
      <div class="game-screen">
        <div class="game-header">
          <div class="header-left">
            <h1 class="game-title">🧠 Memory Match</h1>
            <div class="header-controls">
              <div id="game-switcher-container"></div>
              <div id="player-switcher-container"></div>
            </div>
          </div>
          <div class="header-right">
            <div class="stat-item">
              <span class="stat-label">Time</span>
              <span class="stat-value" id="timer">${MathUtils.formatTime(this.timeRemaining)}</span>
            </div>
            <div class="stat-item">
              <span class="stat-label">Attempts</span>
              <span class="stat-value" id="attempts">${this.attempts}</span>
            </div>
            <div class="stat-item">
              <span class="stat-label">Matched</span>
              <span class="stat-value" id="matched">${this.correctMatches}/9</span>
            </div>
          </div>
        </div>

        <div class="memory-container">
          <div class="grid-section">
            <h3 class="grid-title">Problems</h3>
            <div class="card-grid" id="problems-grid">
              ${this.renderProblemsGrid()}
            </div>
          </div>

          <div class="grid-section">
            <h3 class="grid-title">Answers</h3>
            <div class="card-grid" id="answers-grid">
              ${this.renderAnswersGrid()}
            </div>
          </div>
        </div>

        ${this.showingError ? `
          <div class="error-overlay" id="error-overlay">
            <div class="error-message">
              <div class="error-icon">✗</div>
              <div class="error-text">Try Again</div>
              <div class="error-hint">Click anywhere to continue</div>
            </div>
          </div>
        ` : ''}
      </div>
    `;

    createGameSwitcher('#game-switcher-container', 'memory-match');
    createPlayerSwitcher('#player-switcher-container', () => {
      window.location.reload();
    });

    this.attachEventListeners();
  }

  renderProblemsGrid() {
    return this.questions.map(q => {
      const isFlipped = this.flippedCards.has(q.id);
      const isMatched = this.matchedPairs.has(q.id);
      const isSelected = this.selectedProblem?.id === q.id;

      const classes = [
        'card',
        'problem-card',
        isFlipped || isMatched ? 'flipped' : '',
        isMatched ? 'matched' : '',
        isSelected ? 'selected' : ''
      ].filter(Boolean).join(' ');

      return `
        <div class="${classes}" data-id="${q.id}" data-type="problem">
          <div class="card-inner">
            <div class="card-back">?</div>
            <div class="card-front">${q.problem}</div>
          </div>
        </div>
      `;
    }).join('');
  }

  renderAnswersGrid() {
    return this.answers.map(a => {
      const isFlipped = this.flippedCards.has(a.id);
      const isMatched = this.matchedPairs.has(a.questionId);
      const isSelected = this.selectedAnswer?.id === a.id;

      const classes = [
        'card',
        'answer-card',
        isFlipped || isMatched ? 'flipped' : '',
        isMatched ? 'matched' : '',
        isSelected ? 'selected' : ''
      ].filter(Boolean).join(' ');

      // Get the question text if matched
      const question = this.questions.find(q => q.id === a.questionId);
      const questionText = question ? question.problem : '';

      // Show both question and answer if matched, otherwise just answer
      const cardContent = isMatched
        ? `<div class="card-question">${questionText}</div><div class="card-answer">${a.answer}</div>`
        : a.answer;

      return `
        <div class="${classes}" data-id="${a.id}" data-question-id="${a.questionId}" data-type="answer">
          <div class="card-inner">
            <div class="card-back">?</div>
            <div class="card-front">${cardContent}</div>
          </div>
        </div>
      `;
    }).join('');
  }

  attachEventListeners() {
    // Handle error overlay dismissal
    const errorOverlay = document.getElementById('error-overlay');
    if (errorOverlay) {
      errorOverlay.addEventListener('click', () => {
        this.dismissError();
      });
      return; // Don't attach other listeners while showing error
    }

    document.querySelectorAll('.problem-card').forEach(card => {
      card.addEventListener('click', () => {
        const questionId = card.dataset.id;
        this.handleProblemClick(questionId);
      });
    });

    document.querySelectorAll('.answer-card').forEach(card => {
      card.addEventListener('click', () => {
        const answerId = card.dataset.id;
        const questionId = card.dataset.questionId;
        this.handleAnswerClick(questionId, answerId);
      });
    });
  }

  updateCardsDisplay() {
    // Update problem cards
    document.querySelectorAll('.problem-card').forEach(card => {
      const questionId = card.dataset.id;
      const isFlipped = this.flippedCards.has(questionId);
      const isMatched = this.matchedPairs.has(questionId);
      const isSelected = this.selectedProblem?.id === questionId;

      // Update classes
      card.classList.toggle('flipped', isFlipped || isMatched);
      card.classList.toggle('matched', isMatched);
      card.classList.toggle('selected', isSelected);
    });

    // Update answer cards
    document.querySelectorAll('.answer-card').forEach(card => {
      const answerId = card.dataset.id;
      const questionId = card.dataset.questionId;
      const isFlipped = this.flippedCards.has(answerId);
      const isMatched = this.matchedPairs.has(questionId);
      const isSelected = this.selectedAnswer?.id === answerId;

      // Update classes
      card.classList.toggle('flipped', isFlipped || isMatched);
      card.classList.toggle('matched', isMatched);
      card.classList.toggle('selected', isSelected);
    });
  }

  handleProblemClick(questionId) {
    if (this.gameEnded) return;
    if (this.showingError) return;
    if (this.matchedPairs.has(questionId)) return;

    // If clicking the same problem card, deselect it
    if (this.selectedProblem?.id === questionId) {
      this.selectedProblem = null;
      this.flippedCards.delete(questionId);
      this.updateCardsDisplay();
      return;
    }

    // If an answer card is already selected, check for match
    if (this.selectedAnswer) {
      this.attempts++;
      const attemptsElement = document.getElementById('attempts');
      if (attemptsElement) {
        attemptsElement.textContent = this.attempts;
      }

      // Flip the problem card
      this.flippedCards.add(questionId);
      this.updateCardsDisplay();

      // Check if match (answer's questionId should match clicked problem's questionId)
      if (this.selectedAnswer.questionId === questionId) {
        // Correct match!
        this.handleCorrectMatch(questionId);
      } else {
        // Incorrect match
        this.handleIncorrectMatch(questionId, this.selectedAnswer.id);
      }
      return;
    }

    // No selection yet, select this problem card
    if (this.selectedProblem) {
      this.flippedCards.delete(this.selectedProblem.id);
    }

    this.selectedProblem = this.questions.find(q => q.id === questionId);
    this.flippedCards.add(questionId);
    this.updateCardsDisplay();
  }

  handleAnswerClick(questionId, answerId) {
    if (this.gameEnded) return;
    if (this.showingError) return;
    if (this.matchedPairs.has(questionId)) return;

    // If clicking the same answer card, deselect it
    if (this.selectedAnswer?.id === answerId) {
      this.selectedAnswer = null;
      this.flippedCards.delete(answerId);
      this.updateCardsDisplay();
      return;
    }

    // If a problem card is already selected, check for match
    if (this.selectedProblem) {
      this.attempts++;
      const attemptsElement = document.getElementById('attempts');
      if (attemptsElement) {
        attemptsElement.textContent = this.attempts;
      }

      // Flip the answer card
      this.flippedCards.add(answerId);
      this.updateCardsDisplay();

      // Check if match
      if (this.selectedProblem.id === questionId) {
        // Correct match!
        this.handleCorrectMatch(questionId);
      } else {
        // Incorrect match
        this.handleIncorrectMatch(this.selectedProblem.id, answerId);
      }
      return;
    }

    // No selection yet, select this answer card
    if (this.selectedAnswer) {
      this.flippedCards.delete(this.selectedAnswer.id);
    }

    this.selectedAnswer = this.answers.find(a => a.id === answerId);
    this.flippedCards.add(answerId);
    this.updateCardsDisplay();
  }

  handleCorrectMatch(questionId) {
    this.matchedPairs.add(questionId);
    this.correctMatches++;
    this.selectedProblem = null;
    this.selectedAnswer = null;

    // Update stats display
    const matchedElement = document.getElementById('matched');
    if (matchedElement) {
      matchedElement.textContent = `${this.correctMatches}/9`;
    }

    // Check if won
    if (this.correctMatches === 9) {
      setTimeout(() => {
        this.endGame('complete');
      }, 1200);
    } else {
      this.updateCardsDisplay();
    }
  }

  handleIncorrectMatch(problemId, answerId) {
    // Store the error state - keep cards flipped and show overlay
    this.showingError = true;
    this.errorCardId = { problemId, answerId };

    // Update cards display to show both flipped
    this.updateCardsDisplay();

    // Show error overlay
    this.showErrorOverlay();
  }

  showErrorOverlay() {
    // Create and show error overlay without full re-render
    const existingOverlay = document.getElementById('error-overlay');
    if (existingOverlay) return;

    const overlay = document.createElement('div');
    overlay.id = 'error-overlay';
    overlay.className = 'error-overlay';
    overlay.innerHTML = `
      <div class="error-message">
        <div class="error-icon">✗</div>
        <div class="error-text">Try Again</div>
        <div class="error-hint">Click anywhere to continue</div>
      </div>
    `;
    overlay.addEventListener('click', () => {
      this.dismissError();
    });
    document.body.appendChild(overlay);
  }

  dismissError() {
    if (!this.showingError) return;

    // Remove error overlay
    const overlay = document.getElementById('error-overlay');
    if (overlay) {
      overlay.remove();
    }

    // Clear error state
    const { problemId, answerId } = this.errorCardId || {};

    this.showingError = false;
    this.errorCardId = null;
    this.selectedProblem = null;
    this.selectedAnswer = null;

    // Flip cards back
    if (problemId) {
      this.flippedCards.delete(problemId);
    }
    if (answerId) {
      this.flippedCards.delete(answerId);
    }

    // Update cards display
    this.updateCardsDisplay();
  }

  endGame(reason) {
    if (this.gameEnded) return;

    this.gameEnded = true;
    this.endTime = Date.now();

    if (this.timerInterval) {
      clearInterval(this.timerInterval);
    }

    const timeUsed = Math.floor((this.endTime - this.startTime) / 1000);
    const isPerfect = reason === 'complete' && this.attempts === 9;

    // Save score if completed
    if (reason === 'complete') {
      const accuracy = Math.round((9 / this.attempts) * 100);
      const score = {
        playerName: PlayerStorage.getCurrentPlayer(),
        game: 'memory-match',
        difficulty: this.difficulty,
        time: timeUsed,
        accuracy: accuracy,
        correctAnswers: 9, // All pairs matched
        totalQuestions: 9  // 9 pairs total
      };

      ScoreStorage.saveScore(score);
    }

    this.renderResults(reason, timeUsed, isPerfect);
  }

  renderResults(reason, timeUsed, isPerfect) {
    const player = PlayerStorage.getCurrentPlayer();
    const isTimeout = reason === 'timeout';
    const isComplete = reason === 'complete';

    let resultHTML = '';

    if (isComplete) {
      const efficiency = ((9 / this.attempts) * 100).toFixed(1);

      resultHTML = `
        <div class="results-card success">
          <div class="result-icon">🎉</div>
          <h2>Congratulations!</h2>
          <p class="result-message">All pairs matched!</p>

          <div class="stats-grid">
            <div class="stat-card">
              <div class="stat-value">${this.attempts}</div>
              <div class="stat-label">Total Attempts</div>
            </div>
            <div class="stat-card">
              <div class="stat-value">${MathUtils.formatTime(timeUsed)}</div>
              <div class="stat-label">Time Used</div>
            </div>
            <div class="stat-card">
              <div class="stat-value">${efficiency}%</div>
              <div class="stat-label">Efficiency</div>
            </div>
          </div>

          ${isPerfect ? `
            <div class="perfect-score-banner">
              <span class="banner-icon">✨</span>
              <span class="banner-text">PERFECT SCORE!</span>
              <span class="banner-icon">✨</span>
            </div>
          ` : ''}
        </div>
      `;
    } else {
      resultHTML = `
        <div class="results-card timeout">
          <div class="result-icon">⏱️</div>
          <h2>Time's Up!</h2>
          <p class="result-message">You matched ${this.correctMatches} out of 9 pairs.</p>

          <div class="stats-grid">
            <div class="stat-card">
              <div class="stat-value">${this.correctMatches}/9</div>
              <div class="stat-label">Pairs Matched</div>
            </div>
            <div class="stat-card">
              <div class="stat-value">${this.attempts}</div>
              <div class="stat-label">Attempts Made</div>
            </div>
          </div>
        </div>
      `;
    }

    document.getElementById('game-container').innerHTML = `
      <div class="results-screen">
        <div class="results-content">
          <div class="game-header">
            <h1 class="game-title">🧠 Memory Match</h1>
            <div class="header-controls">
              <div id="game-switcher-container"></div>
              <div id="player-switcher-container"></div>
            </div>
          </div>

          ${resultHTML}

          <div class="scoreboard-container">
            <h3>Leaderboard</h3>
            <div id="scoreboard"></div>
          </div>

          <div class="actions">
            <button class="btn btn-primary" id="play-again-btn">
              Play Again
            </button>
            <button class="btn btn-secondary" id="change-difficulty-btn">
              Change Difficulty
            </button>
            <a href="../../index.html" class="btn btn-secondary">
              Back to Menu
            </a>
          </div>
        </div>
      </div>
    `;

    createGameSwitcher('#game-switcher-container', 'memory-match');
    createPlayerSwitcher('#player-switcher-container', () => {
      window.location.reload();
    });

    // Render scoreboard
    const scoreboard = new Scoreboard(document.getElementById('scoreboard'), {
      game: 'memory-match',
      difficulty: this.difficulty
    });
    scoreboard.render();

    document.getElementById('play-again-btn').addEventListener('click', () => {
      window.location.reload();
    });

    document.getElementById('change-difficulty-btn').addEventListener('click', () => {
      window.location.href = 'index.html';
    });
  }
}

window.MemoryMatch = MemoryMatch;

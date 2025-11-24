/**
 * Multiplication Sprint - Grid Quiz Format
 * All 20 questions visible, click to answer
 */

class MultiplicationSprint {
  constructor(difficulty) {
    this.difficulty = difficulty;
    this.questions = [];
    this.answers = new Map(); // questionId -> selectedChoice
    this.startTime = null;
    this.endTime = null;
    this.timerInterval = null;
    this.timeLimit = 120; // 2 minutes in seconds
    this.timeRemaining = this.timeLimit;
    this.gameEnded = false;
  }

  /**
   * Initialize the game
   */
  async initialize() {
    // Generate 12 questions
    this.questions = MathUtils.generateQuestionSet(12, this.difficulty);
    this.renderWelcome();
  }

  /**
   * Render welcome/instructions screen
   */
  renderWelcome() {
    const container = document.getElementById('game-container');
    container.innerHTML = `
      <div class="container container-md animate-slideUp">
        <div class="card text-center">
          <h1 class="game-title">🏃 Multiplication Sprint</h1>
          <p style="font-size: var(--font-size-lg); margin-bottom: var(--space-6); color: var(--color-text-secondary);">
            Answer all 12 questions as fast as you can!
          </p>

          <div style="background: var(--color-bg-alt); padding: var(--space-6); border-radius: var(--radius-lg); margin-bottom: var(--space-6);">
            <h3 style="color: var(--color-primary); margin-bottom: var(--space-4);">How to Play</h3>
            <ul style="text-align: left; max-width: 400px; margin: 0 auto; list-style: none; padding: 0;">
              <li style="margin-bottom: var(--space-3); padding-left: var(--space-6); position: relative;">
                <span style="position: absolute; left: 0; color: var(--color-primary);">1️⃣</span>
                All 12 questions appear in a grid
              </li>
              <li style="margin-bottom: var(--space-3); padding-left: var(--space-6); position: relative;">
                <span style="position: absolute; left: 0; color: var(--color-primary);">2️⃣</span>
                Click an answer button to select it
              </li>
              <li style="margin-bottom: var(--space-3); padding-left: var(--space-6); position: relative;">
                <span style="position: absolute; left: 0; color: var(--color-primary);">3️⃣</span>
                You have <strong>2 minutes</strong> to complete
              </li>
              <li style="padding-left: var(--space-6); position: relative;">
                <span style="position: absolute; left: 0; color: var(--color-primary);">4️⃣</span>
                Get 100% correct to reach the leaderboard!
              </li>
            </ul>
          </div>

          <div style="display: flex; gap: var(--space-4); justify-content: center; margin-top: var(--space-8);">
            <button class="btn-primary btn-lg" onclick="game.start()">
              Start Game 🚀
            </button>
            <button class="btn-outline" onclick="window.location.reload()">
              Change Difficulty
            </button>
          </div>
        </div>
      </div>
    `;
  }

  /**
   * Start the game
   */
  start() {
    this.startTime = Date.now();
    this.gameEnded = false;
    this.timeRemaining = this.timeLimit;
    this.startTimer();
    this.render();
  }

  /**
   * Start countdown timer
   */
  startTimer() {
    this.timerInterval = setInterval(() => {
      this.timeRemaining--;
      this.updateTimer();

      if (this.timeRemaining <= 0) {
        this.endGame(true); // Pass true to indicate timeout
      }
    }, 1000);
  }

  /**
   * Update timer display
   */
  updateTimer() {
    const timerEl = document.getElementById('timer');
    if (!timerEl) return;

    timerEl.textContent = MathUtils.formatTime(this.timeRemaining);

    // Add warning/danger classes
    timerEl.classList.remove('timer-warning', 'timer-danger');
    if (this.timeRemaining <= 10) {
      timerEl.classList.add('timer-danger');
    } else if (this.timeRemaining <= 30) {
      timerEl.classList.add('timer-warning');
    }
  }

  /**
   * Render the game grid
   */
  render() {
    const container = document.getElementById('game-container');
    const answeredCount = this.answers.size;
    const progress = (answeredCount / this.questions.length) * 100;

    container.innerHTML = `
      <div class="game-container">
        <div class="game-header">
          <h1 class="game-title">🏃 Sprint</h1>
          <div style="display: flex; align-items: center; gap: var(--space-3);">
            <div class="timer" id="timer">${MathUtils.formatTime(this.timeRemaining)}</div>
            <button
              class="btn-outline btn-sm"
              onclick="game.restart()"
              style="white-space: nowrap;"
              aria-label="Restart game"
            >
              🔄 Restart
            </button>
          </div>
        </div>

        <div style="margin-bottom: var(--space-6);">
          <div style="display: flex; justify-content: space-between; margin-bottom: var(--space-2);">
            <span style="font-weight: var(--font-weight-semibold);">Progress</span>
            <span style="font-weight: var(--font-weight-semibold); color: var(--color-primary);">
              ${answeredCount} / ${this.questions.length}
            </span>
          </div>
          <div class="progress-bar">
            <div class="progress-fill" style="width: ${progress}%"></div>
          </div>
        </div>

        <div class="questions-grid">
          ${this.questions.map(q => this.renderQuestion(q)).join('')}
        </div>

        <div style="text-align: center; margin-top: var(--space-8);">
          <button
            class="btn-primary btn-lg"
            onclick="game.submit()"
            ${answeredCount < this.questions.length ? 'disabled' : ''}
          >
            Submit Answers 🎯
          </button>
        </div>
      </div>
    `;
  }

  /**
   * Render a single question card
   */
  renderQuestion(question) {
    const selectedChoice = this.answers.get(question.id);
    const isAnswered = selectedChoice !== undefined;

    return `
      <div class="question-card ${isAnswered ? 'answered' : ''}" data-question-id="${question.id}">
        <div class="question-number">#${question.id}</div>
        <div class="question-text">${question.text} = ?</div>
        <div class="choices">
          ${question.choices.map((choice, index) => `
            <button
              class="choice-btn ${selectedChoice === index ? 'selected' : ''}"
              onclick="game.selectAnswer(${question.id}, ${index})"
              aria-label="Answer option ${choice}"
            >
              ${choice}
            </button>
          `).join('')}
        </div>
      </div>
    `;
  }

  /**
   * Handle answer selection
   */
  selectAnswer(questionId, choiceIndex) {
    if (this.gameEnded) return;

    this.answers.set(questionId, choiceIndex);
    this.render();
  }

  /**
   * Submit answers and end game
   */
  submit() {
    if (this.answers.size < this.questions.length) {
      return;
    }

    this.endGame();
  }

  /**
   * End the game and show results
   */
  endGame(isTimeout = false) {
    if (this.gameEnded) return;

    this.gameEnded = true;
    this.endTime = Date.now();
    clearInterval(this.timerInterval);

    // If timeout, show timeout banner instead of results
    if (isTimeout) {
      this.renderTimeoutBanner();
      return;
    }

    // Calculate results
    const totalTime = Math.floor((this.endTime - this.startTime) / 1000);
    let correctCount = 0;

    this.questions.forEach(q => {
      const selectedChoice = this.answers.get(q.id);
      if (selectedChoice === q.correctChoice) {
        correctCount++;
      }
    });

    const accuracy = MathUtils.calculatePercentage(correctCount, this.questions.length);

    // Save score if perfect
    const playerName = PlayerStorage.getCurrentPlayer();
    let scoreSaved = false;

    if (accuracy === 100) {
      scoreSaved = ScoreStorage.saveScore({
        playerName,
        game: 'multiplication-sprint',
        difficulty: this.difficulty,
        time: totalTime,
        accuracy,
        correctAnswers: correctCount,
        totalQuestions: this.questions.length
      });
    }

    this.renderResults(correctCount, totalTime, accuracy, scoreSaved);
  }

  /**
   * Render timeout banner with choices
   */
  renderTimeoutBanner() {
    const container = document.getElementById('game-container');
    const answeredCount = this.answers.size;

    // Create overlay
    const overlay = document.createElement('div');
    overlay.className = 'timeout-overlay';
    overlay.innerHTML = `
      <div class="timeout-banner animate-slideUp">
        <div style="font-size: var(--font-size-4xl); margin-bottom: var(--space-4);">⏰</div>
        <h2 style="font-size: var(--font-size-3xl); margin-bottom: var(--space-3); color: var(--color-primary);">
          Time's Up!
        </h2>
        <p style="font-size: var(--font-size-lg); color: var(--color-text-secondary); margin-bottom: var(--space-6);">
          You answered <strong>${answeredCount} of ${this.questions.length}</strong> questions
        </p>

        <div style="display: flex; flex-direction: column; gap: var(--space-3); width: 100%;">
          <button class="btn-primary btn-lg btn-full" onclick="game.viewTimeoutResults()">
            View Results 📊
          </button>
          <button class="btn-secondary btn-lg btn-full" onclick="game.playAgain()">
            Try Again 🔄
          </button>
          <button class="btn-outline btn-full" onclick="window.location.reload()">
            Change Difficulty
          </button>
        </div>
      </div>
    `;

    container.appendChild(overlay);
  }

  /**
   * View results after timeout
   */
  viewTimeoutResults() {
    // Remove the timeout banner
    const overlay = document.querySelector('.timeout-overlay');
    if (overlay) {
      overlay.remove();
    }

    // Calculate and show results
    const totalTime = this.timeLimit; // Used full time
    let correctCount = 0;

    this.questions.forEach(q => {
      const selectedChoice = this.answers.get(q.id);
      if (selectedChoice === q.correctChoice) {
        correctCount++;
      }
    });

    const accuracy = MathUtils.calculatePercentage(correctCount, this.questions.length);

    // Don't save score on timeout
    this.renderResults(correctCount, totalTime, accuracy, false);
  }

  /**
   * Render results screen
   */
  renderResults(correctCount, totalTime, accuracy, scoreSaved) {
    const container = document.getElementById('game-container');

    container.innerHTML = `
      <div class="container container-md animate-slideUp">
        <div class="card text-center">
          <div style="display: flex; justify-content: flex-end; margin-bottom: var(--space-4);">
            <div id="player-switcher-container"></div>
          </div>

          <h1 style="font-size: var(--font-size-4xl); margin-bottom: var(--space-6);">
            ${accuracy === 100 ? '🎉 Perfect Score!' : '📊 Results'}
          </h1>

          <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(150px, 1fr)); gap: var(--space-4); margin-bottom: var(--space-8);">
            <div style="background: var(--color-bg-alt); padding: var(--space-6); border-radius: var(--radius-lg);">
              <div style="font-size: var(--font-size-3xl); font-weight: var(--font-weight-bold); color: var(--color-primary);">
                ${correctCount}/${this.questions.length}
              </div>
              <div style="color: var(--color-text-secondary); margin-top: var(--space-2);">Correct</div>
            </div>

            <div style="background: var(--color-bg-alt); padding: var(--space-6); border-radius: var(--radius-lg);">
              <div style="font-size: var(--font-size-3xl); font-weight: var(--font-weight-bold); color: var(--color-secondary);">
                ${accuracy}%
              </div>
              <div style="color: var(--color-text-secondary); margin-top: var(--space-2);">Accuracy</div>
            </div>

            <div style="background: var(--color-bg-alt); padding: var(--space-6); border-radius: var(--radius-lg);">
              <div style="font-size: var(--font-size-3xl); font-weight: var(--font-weight-bold); color: var(--color-info);">
                ${MathUtils.formatTime(totalTime)}
              </div>
              <div style="color: var(--color-text-secondary); margin-top: var(--space-2);">Time</div>
            </div>
          </div>

          ${scoreSaved ? `
            <div style="background: var(--color-success-light); background: linear-gradient(135deg, var(--color-success-light) 0%, var(--color-success) 100%); color: white; padding: var(--space-6); border-radius: var(--radius-lg); margin-bottom: var(--space-6);">
              <div style="font-size: var(--font-size-2xl); font-weight: var(--font-weight-bold); margin-bottom: var(--space-2);">
                🏆 Score Saved!
              </div>
              <div>Your perfect score has been added to the leaderboard!</div>
            </div>
          ` : accuracy < 100 ? `
            <div style="background: var(--color-warning-light); padding: var(--space-4); border-radius: var(--radius-lg); margin-bottom: var(--space-6); color: var(--color-text);">
              <strong>Almost there!</strong> Get 100% accuracy to reach the leaderboard.
            </div>
          ` : ''}

          <div style="display: flex; gap: var(--space-4); justify-content: center; flex-wrap: wrap; margin-bottom: var(--space-8);">
            <button class="btn-primary btn-lg" onclick="game.playAgain()">
              Play Again 🔄
            </button>
            <button class="btn-secondary btn-lg" onclick="game.viewAnswers()">
              View Answers 📝
            </button>
            <button class="btn-outline" onclick="window.location.reload()">
              Change Difficulty
            </button>
          </div>

          <div id="scoreboard-container"></div>
        </div>
      </div>
    `;

    // Render scoreboard
    const scoreboardContainer = document.getElementById('scoreboard-container');
    const scoreboard = new Scoreboard(scoreboardContainer, {
      game: 'multiplication-sprint',
      difficulty: this.difficulty
    });
    scoreboard.render();

    // Add player switcher
    createPlayerSwitcher('#player-switcher-container', (newPlayerName) => {
      // Reload the page to show difficulty selection for new player
      window.location.reload();
    });
  }

  /**
   * Show detailed answers
   */
  viewAnswers() {
    const container = document.getElementById('game-container');

    const answersHTML = this.questions.map(q => {
      const selectedChoice = this.answers.get(q.id);
      const isCorrect = selectedChoice === q.correctChoice;

      return `
        <div class="answer-review-card ${isCorrect ? 'correct' : 'incorrect'}">
          <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: var(--space-3);">
            <div class="answer-number">#${q.id}</div>
            <div class="answer-status">
              ${isCorrect
                ? '<span style="color: var(--color-success); font-weight: bold;">✓ Correct</span>'
                : '<span style="color: var(--color-error); font-weight: bold;">✗ Wrong</span>'
              }
            </div>
          </div>
          <div class="answer-question" style="margin-bottom: var(--space-4);">${q.text} = ?</div>
          <div class="review-choices">
            ${q.choices.map((choice, index) => {
              const isSelected = selectedChoice === index;
              const isCorrectChoice = index === q.correctChoice;
              let className = 'review-choice-btn';

              if (isCorrectChoice) {
                className += ' review-correct';
              } else if (isSelected && !isCorrect) {
                className += ' review-wrong';
              }

              return `
                <div class="${className}">
                  ${choice}
                  ${isCorrectChoice ? '<span class="choice-indicator">✓ Correct</span>' : ''}
                  ${isSelected && !isCorrect ? '<span class="choice-indicator">✗ Your answer</span>' : ''}
                </div>
              `;
            }).join('')}
          </div>
        </div>
      `;
    }).join('');

    container.innerHTML = `
      <div class="container container-md">
        <div class="card">
          <h2 style="margin-bottom: var(--space-6); text-align: center;">📝 Answer Review</h2>
          <div class="answers-grid">
            ${answersHTML}
          </div>
          <div style="text-align: center; margin-top: var(--space-8);">
            <button class="btn-primary" onclick="game.initialize()">
              Back to Results
            </button>
          </div>
        </div>
      </div>
    `;
  }

  /**
   * Play again with same difficulty
   */
  playAgain() {
    this.questions = [];
    this.answers = new Map();
    this.startTime = null;
    this.endTime = null;
    this.timeRemaining = this.timeLimit;
    this.gameEnded = false;

    if (this.timerInterval) {
      clearInterval(this.timerInterval);
    }

    this.initialize();
  }

  /**
   * Restart current game
   */
  restart() {
    // Clear the timer
    if (this.timerInterval) {
      clearInterval(this.timerInterval);
    }

    // Reset state
    this.answers = new Map();
    this.startTime = null;
    this.endTime = null;
    this.timeRemaining = this.timeLimit;
    this.gameEnded = false;

    // Show welcome screen again
    this.renderWelcome();
  }
}

/**
 * Make MultiplicationSprint available globally
 */
window.MultiplicationSprint = MultiplicationSprint;

/**
 * Math Blitz - One Question at a Time with Streaks
 * Full-screen focus, animated transitions, streak counter
 */

class MathBlitz {
  constructor(difficulty) {
    this.difficulty = difficulty;
    this.questions = [];
    this.currentQuestionIndex = 0;
    this.answers = []; // Array of {questionId, selectedChoice, correct, timeSpent}
    this.startTime = null;
    this.questionStartTime = null;
    this.endTime = null;
    this.timerInterval = null;
    this.timeLimit = 120; // 2 minutes in seconds
    this.timeRemaining = this.timeLimit;
    this.streak = 0;
    this.maxStreak = 0;
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
          <h1 class="game-title">⚡ Math Blitz</h1>
          <p style="font-size: var(--font-size-lg); margin-bottom: var(--space-6); color: var(--color-text-secondary);">
            Lightning-fast one-question-at-a-time challenge!
          </p>

          <div style="background: var(--color-bg-alt); padding: var(--space-6); border-radius: var(--radius-lg); margin-bottom: var(--space-6);">
            <h3 style="color: var(--color-primary); margin-bottom: var(--space-4);">How to Play</h3>
            <ul style="text-align: left; max-width: 400px; margin: 0 auto; list-style: none; padding: 0;">
              <li style="margin-bottom: var(--space-3); padding-left: var(--space-6); position: relative;">
                <span style="position: absolute; left: 0; color: var(--color-primary);">⚡</span>
                One question appears at a time
              </li>
              <li style="margin-bottom: var(--space-3); padding-left: var(--space-6); position: relative;">
                <span style="position: absolute; left: 0; color: var(--color-primary);">🎯</span>
                Click the correct answer to continue
              </li>
              <li style="margin-bottom: var(--space-3); padding-left: var(--space-6); position: relative;">
                <span style="position: absolute; left: 0; color: var(--color-primary);">🔥</span>
                Build streaks by answering consecutively
              </li>
              <li style="margin-bottom: var(--space-3); padding-left: var(--space-6); position: relative;">
                <span style="position: absolute; left: 0; color: var(--color-primary);">⏱️</span>
                Answer in <strong>&lt;3 seconds</strong> for "FAST!" bonus
              </li>
              <li style="padding-left: var(--space-6); position: relative;">
                <span style="position: absolute; left: 0; color: var(--color-primary);">🏆</span>
                100% accuracy to reach the leaderboard!
              </li>
            </ul>
          </div>

          <div style="display: flex; gap: var(--space-4); justify-content: center; margin-top: var(--space-8);">
            <button class="btn-primary btn-lg" onclick="game.start()">
              Start Blitz ⚡
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
    this.questionStartTime = Date.now();
    this.gameEnded = false;
    this.timeRemaining = this.timeLimit;
    this.currentQuestionIndex = 0;
    this.streak = 0;
    this.maxStreak = 0;
    this.answers = [];
    this.startTimer();
    this.renderQuestion();
  }

  /**
   * Start countdown timer
   */
  startTimer() {
    this.timerInterval = setInterval(() => {
      this.timeRemaining--;
      this.updateTimer();

      if (this.timeRemaining <= 0) {
        this.endGame();
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
   * Render current question
   */
  renderQuestion() {
    if (this.currentQuestionIndex >= this.questions.length) {
      this.endGame();
      return;
    }

    const question = this.questions[this.currentQuestionIndex];
    const progress = ((this.currentQuestionIndex + 1) / this.questions.length) * 100;
    const container = document.getElementById('game-container');

    container.innerHTML = `
      <div class="blitz-container animate-fadeIn">
        <div class="blitz-header">
          <div class="blitz-stats">
            <div class="stat-item">
              <div class="stat-label">Question</div>
              <div class="stat-value">${this.currentQuestionIndex + 1}/${this.questions.length}</div>
            </div>
            <div class="stat-item">
              <div class="stat-label">Streak</div>
              <div class="stat-value streak-value">${this.streak} 🔥</div>
            </div>
            <div class="stat-item">
              <div class="timer" id="timer">${MathUtils.formatTime(this.timeRemaining)}</div>
            </div>
          </div>
          <div class="progress-bar">
            <div class="progress-fill" style="width: ${progress}%"></div>
          </div>
        </div>

        <div class="blitz-question-container">
          <div class="blitz-question-card">
            <div class="question-type-badge">${this.getQuestionTypeBadge(question.type)}</div>
            <div class="blitz-question-text">${question.text} = ?</div>
            <div class="blitz-choices">
              ${question.choices.map((choice, index) => `
                <button
                  class="blitz-choice-btn"
                  onclick="game.selectAnswer(${index})"
                  aria-label="Answer option ${choice}"
                >
                  ${choice}
                </button>
              `).join('')}
            </div>
          </div>
        </div>
      </div>
    `;
  }

  /**
   * Get question type badge
   */
  getQuestionTypeBadge(type) {
    const badges = {
      multiplication: '✖️ Multiply',
      addition: '➕ Add',
      subtraction: '➖ Subtract'
    };
    return badges[type] || type;
  }

  /**
   * Handle answer selection
   */
  selectAnswer(choiceIndex) {
    if (this.gameEnded) return;

    const question = this.questions[this.currentQuestionIndex];
    const isCorrect = choiceIndex === question.correctChoice;
    const timeSpent = (Date.now() - this.questionStartTime) / 1000;
    const isFast = timeSpent < 3;

    // Record answer
    this.answers.push({
      questionId: question.id,
      selectedChoice: choiceIndex,
      correct: isCorrect,
      timeSpent
    });

    // Update streak
    if (isCorrect) {
      this.streak++;
      if (this.streak > this.maxStreak) {
        this.maxStreak = this.streak;
      }
    } else {
      this.streak = 0;
    }

    // Show feedback
    this.showFeedback(isCorrect, isFast);
  }

  /**
   * Show feedback animation
   */
  showFeedback(isCorrect, isFast) {
    const container = document.getElementById('game-container');

    // Create feedback overlay
    const feedback = document.createElement('div');
    feedback.className = 'feedback-overlay';
    feedback.innerHTML = `
      <div class="feedback-content ${isCorrect ? 'correct' : 'incorrect'}">
        <div class="feedback-icon">
          ${isCorrect ? '✓' : '✗'}
        </div>
        <div class="feedback-text">
          ${isCorrect ? (isFast ? 'FAST! ⚡' : 'Correct!') : 'Oops!'}
        </div>
        ${isCorrect && isFast ? '<div class="feedback-bonus">+Speed Bonus</div>' : ''}
      </div>
    `;

    container.appendChild(feedback);

    // Animate feedback
    setTimeout(() => {
      feedback.classList.add('show');
    }, 10);

    // Move to next question
    setTimeout(() => {
      feedback.classList.remove('show');
      setTimeout(() => {
        feedback.remove();
        this.nextQuestion();
      }, 300);
    }, 1000);
  }

  /**
   * Move to next question
   */
  nextQuestion() {
    this.currentQuestionIndex++;
    this.questionStartTime = Date.now();
    this.renderQuestion();
  }

  /**
   * End the game and show results
   */
  endGame() {
    if (this.gameEnded) return;

    this.gameEnded = true;
    this.endTime = Date.now();
    clearInterval(this.timerInterval);

    // Calculate results
    const totalTime = Math.floor((this.endTime - this.startTime) / 1000);
    const correctCount = this.answers.filter(a => a.correct).length;
    const answeredCount = this.answers.length;
    const accuracy = MathUtils.calculatePercentage(correctCount, this.questions.length);

    // Count fast answers
    const fastAnswers = this.answers.filter(a => a.correct && a.timeSpent < 3).length;

    // Save score
    const playerName = PlayerStorage.getCurrentPlayer();
    const scoreSaved = ScoreStorage.saveScore({
      playerName,
      game: 'math-blitz',
      difficulty: this.difficulty,
      time: totalTime,
      accuracy,
      correctAnswers: correctCount,
      totalQuestions: this.questions.length
    });

    this.renderResults(correctCount, answeredCount, totalTime, accuracy, fastAnswers, scoreSaved);
  }

  /**
   * Render results screen
   */
  renderResults(correctCount, answeredCount, totalTime, accuracy, fastAnswers, scoreSaved) {
    const container = document.getElementById('game-container');

    container.innerHTML = `
      <div class="container container-md animate-slideUp">
        <div class="card text-center">
          <div style="display: flex; justify-content: flex-end; margin-bottom: var(--space-4);">
            <div id="player-switcher-container"></div>
          </div>

          <h1 style="font-size: var(--font-size-4xl); margin-bottom: var(--space-6);">
            ${accuracy === 100 ? '⚡ Lightning Fast!' : '📊 Results'}
          </h1>

          <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(140px, 1fr)); gap: var(--space-4); margin-bottom: var(--space-8);">
            <div style="background: var(--color-bg-alt); padding: var(--space-6); border-radius: var(--radius-lg);">
              <div style="font-size: var(--font-size-3xl); font-weight: var(--font-weight-bold); color: var(--color-primary);">
                ${correctCount}/${answeredCount}
              </div>
              <div style="color: var(--color-text-secondary); margin-top: var(--space-2); font-size: var(--font-size-sm);">Correct</div>
            </div>

            <div style="background: var(--color-bg-alt); padding: var(--space-6); border-radius: var(--radius-lg);">
              <div style="font-size: var(--font-size-3xl); font-weight: var(--font-weight-bold); color: var(--color-secondary);">
                ${accuracy}%
              </div>
              <div style="color: var(--color-text-secondary); margin-top: var(--space-2); font-size: var(--font-size-sm);">Accuracy</div>
            </div>

            <div style="background: var(--color-bg-alt); padding: var(--space-6); border-radius: var(--radius-lg);">
              <div style="font-size: var(--font-size-3xl); font-weight: var(--font-weight-bold); color: var(--color-warning);">
                ${this.maxStreak}
              </div>
              <div style="color: var(--color-text-secondary); margin-top: var(--space-2); font-size: var(--font-size-sm);">Max Streak 🔥</div>
            </div>

            <div style="background: var(--color-bg-alt); padding: var(--space-6); border-radius: var(--radius-lg);">
              <div style="font-size: var(--font-size-3xl); font-weight: var(--font-weight-bold); color: var(--color-info);">
                ${fastAnswers}
              </div>
              <div style="color: var(--color-text-secondary); margin-top: var(--space-2); font-size: var(--font-size-sm);">Fast Answers ⚡</div>
            </div>
          </div>

          ${scoreSaved ? `
            <div style="background: linear-gradient(135deg, var(--color-success-light) 0%, var(--color-success) 100%); color: white; padding: var(--space-6); border-radius: var(--radius-lg); margin-bottom: var(--space-6);">
              <div style="font-size: var(--font-size-2xl); font-weight: var(--font-weight-bold); margin-bottom: var(--space-2);">
                🏆 Perfect Score!
              </div>
              <div>Time: ${MathUtils.formatTime(totalTime)} • Added to leaderboard!</div>
            </div>
          ` : accuracy < 100 ? `
            <div style="background: var(--color-warning-light); padding: var(--space-4); border-radius: var(--radius-lg); margin-bottom: var(--space-6); color: var(--color-text);">
              <strong>Nice try!</strong> Get 100% accuracy to reach the leaderboard.
            </div>
          ` : answeredCount < this.questions.length ? `
            <div style="background: var(--color-warning-light); padding: var(--space-4); border-radius: var(--radius-lg); margin-bottom: var(--space-6); color: var(--color-text);">
              <strong>Time's up!</strong> Complete all questions for leaderboard eligibility.
            </div>
          ` : ''}

          <div style="display: flex; gap: var(--space-4); justify-content: center; flex-wrap: wrap; margin-bottom: var(--space-8);">
            <button class="btn-primary btn-lg" onclick="game.playAgain()">
              Play Again ⚡
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
      game: 'math-blitz',
      difficulty: this.difficulty
    });
    scoreboard.render();

    // Add player switcher
    createPlayerSwitcher('#player-switcher-container', () => {
      window.location.reload();
    });
  }

  /**
   * Play again with same difficulty
   */
  playAgain() {
    this.questions = [];
    this.answers = [];
    this.currentQuestionIndex = 0;
    this.startTime = null;
    this.questionStartTime = null;
    this.endTime = null;
    this.timeRemaining = this.timeLimit;
    this.streak = 0;
    this.maxStreak = 0;
    this.gameEnded = false;

    if (this.timerInterval) {
      clearInterval(this.timerInterval);
    }

    this.initialize();
  }
}

/**
 * Make MathBlitz available globally
 */
window.MathBlitz = MathBlitz;

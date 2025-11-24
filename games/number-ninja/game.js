/**
 * Number Ninja - Gamified with Combos and Achievements
 * Features combo multipliers, particle effects, and badges
 */

class NumberNinja {
  constructor(difficulty) {
    this.difficulty = difficulty;
    this.questions = [];
    this.currentQuestionIndex = 0;
    this.answers = [];
    this.startTime = null;
    this.questionStartTime = null;
    this.endTime = null;
    this.timerInterval = null;
    this.timeLimit = 120;
    this.timeRemaining = this.timeLimit;
    this.combo = 0;
    this.maxCombo = 0;
    this.totalScore = 0;
    this.achievements = [];
    this.gameEnded = false;
  }

  /**
   * Initialize the game
   */
  async initialize() {
    this.questions = MathUtils.generateQuestionSet(12, this.difficulty);
    this.renderWelcome();
  }

  /**
   * Render welcome screen
   */
  renderWelcome() {
    const container = document.getElementById('game-container');
    container.innerHTML = `
      <div class="container container-md animate-slideUp">
        <div class="card text-center">
          <h1 class="game-title">🥷 Number Ninja</h1>
          <p style="font-size: var(--font-size-lg); margin-bottom: var(--space-6); color: var(--color-text-secondary);">
            Master math with ninja precision and combo power!
          </p>

          <div style="background: var(--color-bg-alt); padding: var(--space-6); border-radius: var(--radius-lg); margin-bottom: var(--space-6);">
            <h3 style="color: var(--color-primary); margin-bottom: var(--space-4);">Ninja Training</h3>
            <ul style="text-align: left; max-width: 420px; margin: 0 auto; list-style: none; padding: 0;">
              <li style="margin-bottom: var(--space-3); padding-left: var(--space-6); position: relative;">
                <span style="position: absolute; left: 0; color: var(--color-primary);">🥷</span>
                Answer questions with ninja star buttons
              </li>
              <li style="margin-bottom: var(--space-3); padding-left: var(--space-6); position: relative;">
                <span style="position: absolute; left: 0; color: var(--color-primary);">⚡</span>
                Build combos for score multipliers
              </li>
              <li style="margin-bottom: var(--space-3); padding-left: var(--space-6); position: relative;">
                <span style="position: absolute; left: 0; color: var(--color-primary);">💥</span>
                Wrong answers reset your combo
              </li>
              <li style="margin-bottom: var(--space-3); padding-left: var(--space-6); position: relative;">
                <span style="position: absolute; left: 0; color: var(--color-primary);">🏆</span>
                Earn achievements for special feats
              </li>
              <li style="padding-left: var(--space-6); position: relative;">
                <span style="position: absolute; left: 0; color: var(--color-primary);">📊</span>
                100% accuracy to reach the leaderboard!
              </li>
            </ul>
          </div>

          <div style="display: flex; gap: var(--space-4); justify-content: center; margin-top: var(--space-8);">
            <button class="btn-primary btn-lg" onclick="game.start()">
              Begin Training 🥷
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
    this.combo = 0;
    this.maxCombo = 0;
    this.totalScore = 0;
    this.answers = [];
    this.achievements = [];
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

    timerEl.classList.remove('timer-warning', 'timer-danger');
    if (this.timeRemaining <= 10) {
      timerEl.classList.add('timer-danger');
    } else if (this.timeRemaining <= 30) {
      timerEl.classList.add('timer-warning');
    }
  }

  /**
   * Calculate combo multiplier
   */
  getComboMultiplier() {
    if (this.combo < 3) return 1;
    if (this.combo < 5) return 1.5;
    if (this.combo < 10) return 2;
    return 3;
  }

  /**
   * Get combo level text
   */
  getComboLevel() {
    if (this.combo < 3) return '';
    if (this.combo < 5) return 'Good';
    if (this.combo < 10) return 'Great';
    return 'UNSTOPPABLE';
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
    const multiplier = this.getComboMultiplier();
    const comboLevel = this.getComboLevel();
    const container = document.getElementById('game-container');

    container.innerHTML = `
      <div class="ninja-container">
        <div class="ninja-header">
          <div class="ninja-stats-bar">
            <div class="ninja-stat">
              <span class="stat-label">Score</span>
              <span class="stat-value">${this.totalScore}</span>
            </div>
            <div class="ninja-stat combo-stat">
              <span class="stat-label">Combo</span>
              <span class="stat-value combo-display">
                ${this.combo}x
                ${comboLevel ? `<span class="combo-level">${comboLevel}!</span>` : ''}
              </span>
            </div>
            <div class="ninja-stat">
              <span class="timer" id="timer">${MathUtils.formatTime(this.timeRemaining)}</span>
            </div>
          </div>

          <div class="progress-bar">
            <div class="progress-fill" style="width: ${progress}%"></div>
          </div>

          ${multiplier > 1 ? `
            <div class="multiplier-badge">
              ${multiplier}x Multiplier Active! 🔥
            </div>
          ` : ''}
        </div>

        <div class="ninja-question-area">
          <div class="ninja-card">
            <div class="question-badge">${question.type === 'multiplication' ? '✖️' : question.type === 'addition' ? '➕' : '➖'}</div>
            <div class="ninja-question-text">${question.text} = ?</div>
            <div class="ninja-question-number">Question ${this.currentQuestionIndex + 1}/${this.questions.length}</div>
          </div>

          <div class="ninja-stars">
            ${question.choices.map((choice, index) => `
              <button
                class="ninja-star"
                onclick="game.selectAnswer(${index})"
                aria-label="Answer ${choice}"
              >
                <span class="star-icon">⭐</span>
                <span class="star-value">${choice}</span>
              </button>
            `).join('')}
          </div>
        </div>

        <div id="particles-container"></div>
      </div>
    `;
  }

  /**
   * Handle answer selection
   */
  selectAnswer(choiceIndex) {
    if (this.gameEnded) return;

    // Disable all buttons immediately and remove focus to prevent visual state persistence
    const allButtons = document.querySelectorAll('.ninja-star');
    allButtons.forEach(btn => {
      btn.disabled = true;
      btn.blur(); // Remove focus to clear :active and :focus states
      btn.style.pointerEvents = 'none'; // Prevent any further interaction
    });

    const question = this.questions[this.currentQuestionIndex];
    const isCorrect = choiceIndex === question.correctChoice;
    const timeSpent = (Date.now() - this.questionStartTime) / 1000;
    const multiplier = this.getComboMultiplier();

    // Record answer
    this.answers.push({
      questionId: question.id,
      selectedChoice: choiceIndex,
      correct: isCorrect,
      timeSpent,
      combo: this.combo
    });

    if (isCorrect) {
      // Increase combo
      this.combo++;
      if (this.combo > this.maxCombo) {
        this.maxCombo = this.combo;
      }

      // Calculate score with multiplier
      const baseScore = 100;
      const earnedScore = Math.floor(baseScore * multiplier);
      this.totalScore += earnedScore;

      // Check for achievements
      this.checkAchievements();

      // Show success feedback
      this.showFeedback(true, earnedScore, multiplier);
    } else {
      // Reset combo
      this.combo = 0;

      // Show failure feedback
      this.showFeedback(false);
    }
  }

  /**
   * Check for achievements
   */
  checkAchievements() {
    const newAchievements = [];

    // First Blood
    if (this.currentQuestionIndex === 0 && this.combo === 1 && !this.achievements.includes('first_blood')) {
      newAchievements.push({ id: 'first_blood', name: 'First Blood', icon: '🎯' });
      this.achievements.push('first_blood');
    }

    // Triple Threat
    if (this.combo === 3 && !this.achievements.includes('triple')) {
      newAchievements.push({ id: 'triple', name: 'Triple Threat', icon: '🔥' });
      this.achievements.push('triple');
    }

    // Unstoppable
    if (this.combo === 10 && !this.achievements.includes('unstoppable')) {
      newAchievements.push({ id: 'unstoppable', name: 'Unstoppable', icon: '⚡' });
      this.achievements.push('unstoppable');
    }

    // Flawless (10 in a row at start)
    if (this.combo === 10 && this.currentQuestionIndex === 9 && !this.achievements.includes('flawless')) {
      newAchievements.push({ id: 'flawless', name: 'Flawless Start', icon: '💎' });
      this.achievements.push('flawless');
    }

    return newAchievements;
  }

  /**
   * Show feedback with particles
   */
  showFeedback(isCorrect, earnedScore = 0, multiplier = 1) {
    const container = document.getElementById('particles-container');

    if (isCorrect) {
      // Show score popup
      const scorePopup = document.createElement('div');
      scorePopup.className = 'score-popup';
      scorePopup.innerHTML = `
        +${earnedScore}
        ${multiplier > 1 ? `<span class="multiplier-text">(${multiplier}x)</span>` : ''}
      `;
      container.appendChild(scorePopup);

      // Create particles
      for (let i = 0; i < 10; i++) {
        setTimeout(() => {
          this.createParticle(container);
        }, i * 30);
      }

      // Clean up
      setTimeout(() => {
        scorePopup.remove();
      }, 1500);

      // Move to next question
      setTimeout(() => {
        this.nextQuestion();
      }, 800);
    } else {
      // Show error feedback
      const errorFeedback = document.createElement('div');
      errorFeedback.className = 'error-feedback';
      errorFeedback.innerHTML = `
        <div class="error-icon">💥</div>
        <div class="error-text">Combo Reset!</div>
      `;
      container.appendChild(errorFeedback);

      setTimeout(() => {
        errorFeedback.classList.add('show');
      }, 10);

      setTimeout(() => {
        errorFeedback.remove();
        this.nextQuestion();
      }, 1200);
    }
  }

  /**
   * Create particle effect
   */
  createParticle(container) {
    const particle = document.createElement('div');
    particle.className = 'particle';
    particle.textContent = ['⭐', '✨', '💫', '🌟'][Math.floor(Math.random() * 4)];

    const startX = window.innerWidth / 2;
    const startY = window.innerHeight / 2;
    const angle = Math.random() * Math.PI * 2;
    const distance = 50 + Math.random() * 100;
    const endX = startX + Math.cos(angle) * distance;
    const endY = startY + Math.sin(angle) * distance;

    particle.style.left = `${startX}px`;
    particle.style.top = `${startY}px`;

    container.appendChild(particle);

    // Animate
    setTimeout(() => {
      particle.style.left = `${endX}px`;
      particle.style.top = `${endY}px`;
      particle.style.opacity = '0';
    }, 10);

    setTimeout(() => {
      particle.remove();
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
   * End the game
   */
  endGame() {
    if (this.gameEnded) return;

    this.gameEnded = true;
    this.endTime = Date.now();
    clearInterval(this.timerInterval);

    const totalTime = Math.floor((this.endTime - this.startTime) / 1000);
    const correctCount = this.answers.filter(a => a.correct).length;
    const answeredCount = this.answers.length;
    const accuracy = MathUtils.calculatePercentage(correctCount, this.questions.length);

    // Save score if perfect
    const playerName = PlayerStorage.getCurrentPlayer();
    let scoreSaved = false;

    if (accuracy === 100 && answeredCount === this.questions.length) {
      scoreSaved = ScoreStorage.saveScore({
        playerName,
        game: 'number-ninja',
        difficulty: this.difficulty,
        time: totalTime,
        accuracy,
        correctAnswers: correctCount,
        totalQuestions: this.questions.length
      });
    }

    this.renderResults(correctCount, answeredCount, totalTime, accuracy, scoreSaved);
  }

  /**
   * Render results screen
   */
  renderResults(correctCount, answeredCount, totalTime, accuracy, scoreSaved) {
    const container = document.getElementById('game-container');

    const achievementsHTML = this.achievements.length > 0 ? `
      <div style="background: var(--color-primary); color: white; padding: var(--space-6); border-radius: var(--radius-lg); margin-bottom: var(--space-6);">
        <h3 style="margin-bottom: var(--space-4); color: white;">🏆 Achievements Earned</h3>
        <div style="display: flex; gap: var(--space-4); flex-wrap: wrap; justify-content: center;">
          ${this.achievements.map(id => {
            const badges = {
              first_blood: { icon: '🎯', name: 'First Blood' },
              triple: { icon: '🔥', name: 'Triple Threat' },
              unstoppable: { icon: '⚡', name: 'Unstoppable' },
              flawless: { icon: '💎', name: 'Flawless Start' }
            };
            const badge = badges[id];
            return `
              <div style="background: rgba(255,255,255,0.2); padding: var(--space-3) var(--space-4); border-radius: var(--radius-md);">
                <span style="font-size: var(--font-size-2xl);">${badge.icon}</span>
                <span style="font-size: var(--font-size-sm); margin-left: var(--space-2);">${badge.name}</span>
              </div>
            `;
          }).join('')}
        </div>
      </div>
    ` : '';

    container.innerHTML = `
      <div class="container container-md animate-slideUp">
        <div class="card text-center">
          <div style="display: flex; justify-content: flex-end; gap: var(--space-3); margin-bottom: var(--space-4);">
            <div id="game-switcher-container"></div>
            <div id="player-switcher-container"></div>
          </div>

          <h1 style="font-size: var(--font-size-4xl); margin-bottom: var(--space-6);">
            ${accuracy === 100 ? '🥷 Ninja Master!' : '📊 Training Complete'}
          </h1>

          <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(140px, 1fr)); gap: var(--space-4); margin-bottom: var(--space-8);">
            <div style="background: var(--color-bg-alt); padding: var(--space-6); border-radius: var(--radius-lg);">
              <div style="font-size: var(--font-size-3xl); font-weight: var(--font-weight-bold); color: var(--color-primary);">
                ${this.totalScore}
              </div>
              <div style="color: var(--color-text-secondary); margin-top: var(--space-2); font-size: var(--font-size-sm);">Total Score</div>
            </div>

            <div style="background: var(--color-bg-alt); padding: var(--space-6); border-radius: var(--radius-lg);">
              <div style="font-size: var(--font-size-3xl); font-weight: var(--font-weight-bold); color: var(--color-secondary);">
                ${accuracy}%
              </div>
              <div style="color: var(--color-text-secondary); margin-top: var(--space-2); font-size: var(--font-size-sm);">Accuracy</div>
            </div>

            <div style="background: var(--color-bg-alt); padding: var(--space-6); border-radius: var(--radius-lg);">
              <div style="font-size: var(--font-size-3xl); font-weight: var(--font-weight-bold); color: var(--color-warning);">
                ${this.maxCombo}x
              </div>
              <div style="color: var(--color-text-secondary); margin-top: var(--space-2); font-size: var(--font-size-sm);">Max Combo</div>
            </div>

            <div style="background: var(--color-bg-alt); padding: var(--space-6); border-radius: var(--radius-lg);">
              <div style="font-size: var(--font-size-3xl); font-weight: var(--font-weight-bold); color: var(--color-info);">
                ${MathUtils.formatTime(totalTime)}
              </div>
              <div style="color: var(--color-text-secondary); margin-top: var(--space-2); font-size: var(--font-size-sm);">Time</div>
            </div>
          </div>

          ${achievementsHTML}

          ${scoreSaved ? `
            <div style="background: linear-gradient(135deg, var(--color-success-light) 0%, var(--color-success) 100%); color: white; padding: var(--space-6); border-radius: var(--radius-lg); margin-bottom: var(--space-6);">
              <div style="font-size: var(--font-size-2xl); font-weight: var(--font-weight-bold); margin-bottom: var(--space-2);">
                🏆 Perfect Score!
              </div>
              <div>You've earned your place on the ninja leaderboard!</div>
            </div>
          ` : accuracy < 100 ? `
            <div style="background: var(--color-warning-light); padding: var(--space-4); border-radius: var(--radius-lg); margin-bottom: var(--space-6); color: var(--color-text);">
              <strong>Keep training!</strong> Achieve 100% accuracy to reach the leaderboard.
            </div>
          ` : ''}

          <div style="display: flex; gap: var(--space-4); justify-content: center; flex-wrap: wrap; margin-bottom: var(--space-8);">
            <button class="btn-primary btn-lg" onclick="game.playAgain()">
              Train Again 🥷
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
      game: 'number-ninja',
      difficulty: this.difficulty
    });
    scoreboard.render();

    // Add game switcher
    createGameSwitcher('#game-switcher-container', 'Number Ninja');

    // Add player switcher
    createPlayerSwitcher('#player-switcher-container', () => {
      window.location.reload();
    });
  }

  /**
   * Play again
   */
  playAgain() {
    this.questions = [];
    this.answers = [];
    this.currentQuestionIndex = 0;
    this.startTime = null;
    this.questionStartTime = null;
    this.endTime = null;
    this.timeRemaining = this.timeLimit;
    this.combo = 0;
    this.maxCombo = 0;
    this.totalScore = 0;
    this.achievements = [];
    this.gameEnded = false;

    if (this.timerInterval) {
      clearInterval(this.timerInterval);
    }

    this.initialize();
  }
}

/**
 * Make NumberNinja available globally
 */
window.NumberNinja = NumberNinja;

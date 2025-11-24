/**
 * Reusable Scoreboard Component
 * Displays scores with tabs for "My Scores" and "All Players"
 */

class Scoreboard {
  /**
   * Create a scoreboard instance
   * @param {HTMLElement} container - Container element to render scoreboard
   * @param {Object} options - Configuration options
   * @param {string} options.game - Game name
   * @param {string} options.difficulty - Difficulty level
   */
  constructor(container, options = {}) {
    this.container = container;
    this.game = options.game;
    this.difficulty = options.difficulty;
    this.currentTab = 'my-scores'; // 'my-scores' or 'all-players'
    this.currentPlayer = PlayerStorage.getCurrentPlayer();
  }

  /**
   * Render the scoreboard
   */
  render() {
    this.container.innerHTML = '';

    // Create main structure
    const scoreboardEl = document.createElement('div');
    scoreboardEl.className = 'scoreboard';
    scoreboardEl.setAttribute('role', 'region');
    scoreboardEl.setAttribute('aria-label', 'Scoreboard');

    // Create tabs
    const tabs = this.createTabs();
    scoreboardEl.appendChild(tabs);

    // Create content area
    const content = document.createElement('div');
    content.className = 'scoreboard-content';
    content.setAttribute('role', 'tabpanel');

    // Render current tab content
    this.renderTabContent(content);

    scoreboardEl.appendChild(content);

    // Add privacy note at bottom
    const privacyNote = document.createElement('div');
    privacyNote.className = 'scoreboard-privacy-note';
    privacyNote.style.cssText = 'text-align: center; margin-top: var(--space-4); padding-top: var(--space-4); border-top: 1px solid var(--color-border); font-size: var(--font-size-sm); color: var(--color-text-muted);';
    privacyNote.innerHTML = 'Scores stored in your browser only';
    scoreboardEl.appendChild(privacyNote);

    this.container.appendChild(scoreboardEl);
  }

  /**
   * Create tab navigation
   * @returns {HTMLElement} Tabs element
   */
  createTabs() {
    const tabsContainer = document.createElement('div');
    tabsContainer.className = 'scoreboard-tabs';
    tabsContainer.setAttribute('role', 'tablist');

    const tabs = [
      { id: 'my-scores', label: 'My Scores', icon: '👤' },
      { id: 'all-players', label: 'All Players', icon: '🏆' }
    ];

    tabs.forEach(tab => {
      const button = document.createElement('button');
      button.className = 'tab-button';
      button.setAttribute('role', 'tab');
      button.setAttribute('aria-selected', this.currentTab === tab.id ? 'true' : 'false');
      button.setAttribute('aria-controls', `${tab.id}-panel`);
      button.id = `${tab.id}-tab`;

      if (this.currentTab === tab.id) {
        button.classList.add('active');
      }

      button.innerHTML = `<span class="tab-icon">${tab.icon}</span> ${tab.label}`;

      button.addEventListener('click', () => {
        this.switchTab(tab.id);
      });

      tabsContainer.appendChild(button);
    });

    return tabsContainer;
  }

  /**
   * Switch to a different tab
   * @param {string} tabId - Tab identifier
   */
  switchTab(tabId) {
    if (this.currentTab === tabId) return;

    this.currentTab = tabId;
    this.render(); // Re-render entire scoreboard
  }

  /**
   * Render content for current tab
   * @param {HTMLElement} container - Content container
   */
  renderTabContent(container) {
    if (this.currentTab === 'my-scores') {
      this.renderMyScores(container);
    } else {
      this.renderAllPlayers(container);
    }
  }

  /**
   * Render "My Scores" tab content
   * @param {HTMLElement} container - Content container
   */
  renderMyScores(container) {
    const playerName = this.currentPlayer;

    if (!playerName) {
      container.innerHTML = '<p class="empty-message">No player name set</p>';
      return;
    }

    const scores = ScoreStorage.getScores({
      playerName,
      game: this.game,
      difficulty: this.difficulty
    });

    if (scores.length === 0) {
      container.innerHTML = `
        <p class="empty-message">
          No scores yet for ${playerName}!<br>
          <span class="hint">Complete a round to appear on the leaderboard.</span>
        </p>
      `;
      return;
    }

    // Get player's ranking
    const ranking = ScoreStorage.getPlayerRanking(playerName, this.game, this.difficulty);

    // Create header with ranking
    const header = document.createElement('div');
    header.className = 'scoreboard-header';
    header.innerHTML = `
      <h3>${playerName}'s Scores</h3>
      ${ranking ? `<p class="player-rank">Best Rank: #${ranking.rank} 🎯</p>` : ''}
    `;
    container.appendChild(header);

    // Create table
    const table = this.createScoreTable(scores, playerName);
    container.appendChild(table);
  }

  /**
   * Render "All Players" tab content
   * @param {HTMLElement} container - Content container
   */
  renderAllPlayers(container) {
    const scores = ScoreStorage.getLeaderboard(this.game, this.difficulty, 50);

    if (scores.length === 0) {
      container.innerHTML = '<p class="empty-message">No scores yet. Be the first!</p>';
      return;
    }

    // Create header
    const header = document.createElement('div');
    header.className = 'scoreboard-header';
    header.innerHTML = `
      <h3>Top ${scores.length} Players</h3>
      <p class="scoreboard-subtitle">Difficulty: ${this.difficulty.toUpperCase()}</p>
    `;
    container.appendChild(header);

    // Create table
    const table = this.createScoreTable(scores, this.currentPlayer);
    container.appendChild(table);
  }

  /**
   * Create score table
   * @param {Array} scores - Array of score objects
   * @param {string} currentPlayer - Current player name (to highlight)
   * @returns {HTMLElement} Table element
   */
  createScoreTable(scores, currentPlayer) {
    const table = document.createElement('table');
    table.className = 'score-table';
    table.setAttribute('role', 'table');

    // Create header
    const thead = document.createElement('thead');
    thead.innerHTML = `
      <tr>
        <th scope="col">Rank</th>
        <th scope="col">Player</th>
        <th scope="col">Accuracy</th>
        <th scope="col">Time</th>
        <th scope="col">Date</th>
      </tr>
    `;
    table.appendChild(thead);

    // Create body
    const tbody = document.createElement('tbody');

    scores.forEach((score, index) => {
      const row = document.createElement('tr');
      const isCurrentPlayer = score.playerName === currentPlayer;

      if (isCurrentPlayer) {
        row.classList.add('current-player');
      }

      // Rank
      const rank = score.rank || (index + 1);
      const rankCell = document.createElement('td');
      rankCell.className = 'rank-cell';
      rankCell.textContent = this.getRankDisplay(rank);
      row.appendChild(rankCell);

      // Player name
      const nameCell = document.createElement('td');
      nameCell.className = 'name-cell';
      nameCell.textContent = score.playerName;
      if (isCurrentPlayer) {
        nameCell.innerHTML += ' <span class="you-badge">You</span>';
      }
      row.appendChild(nameCell);

      // Accuracy
      const accuracyCell = document.createElement('td');
      accuracyCell.className = 'accuracy-cell';
      accuracyCell.textContent = `${score.accuracy}%`;
      row.appendChild(accuracyCell);

      // Time
      const timeCell = document.createElement('td');
      timeCell.className = 'time-cell';
      timeCell.textContent = MathUtils.formatTime(score.time);
      row.appendChild(timeCell);

      // Date
      const dateCell = document.createElement('td');
      dateCell.className = 'date-cell';
      dateCell.textContent = this.formatDate(score.date);
      row.appendChild(dateCell);

      tbody.appendChild(row);
    });

    table.appendChild(tbody);
    return table;
  }

  /**
   * Get rank display with medals for top 3
   * @param {number} rank - Rank number
   * @returns {string} Formatted rank
   */
  getRankDisplay(rank) {
    if (rank === 1) return '🥇';
    if (rank === 2) return '🥈';
    if (rank === 3) return '🥉';
    return `#${rank}`;
  }

  /**
   * Format date to readable string
   * @param {string} isoDate - ISO date string
   * @returns {string} Formatted date
   */
  formatDate(isoDate) {
    const date = new Date(isoDate);
    const now = new Date();
    const diffMs = now - date;
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

    if (diffDays === 0) {
      return 'Today';
    } else if (diffDays === 1) {
      return 'Yesterday';
    } else if (diffDays < 7) {
      return `${diffDays} days ago`;
    } else {
      return date.toLocaleDateString();
    }
  }

  /**
   * Update scoreboard (re-render)
   */
  update() {
    this.currentPlayer = PlayerStorage.getCurrentPlayer();
    this.render();
  }
}

/**
 * Make Scoreboard available globally
 */
window.Scoreboard = Scoreboard;

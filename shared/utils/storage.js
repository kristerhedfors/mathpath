/**
 * Storage utility for managing player data and scores in localStorage
 * Namespace format: algebrain_dev_{playerName}_{game}_{difficulty}
 */

const STORAGE_PREFIX = 'algebrain_dev';
const CURRENT_PLAYER_KEY = `${STORAGE_PREFIX}_current_player`;
const ALL_SCORES_KEY = `${STORAGE_PREFIX}_all_scores`;

/**
 * Player Management
 */
const PlayerStorage = {
  /**
   * Set the current player name
   * @param {string} name - Player name
   */
  setCurrentPlayer(name) {
    if (!name || name.trim().length === 0) {
      throw new Error('Player name cannot be empty');
    }
    const sanitized = name.trim().substring(0, 20); // Limit to 20 chars
    localStorage.setItem(CURRENT_PLAYER_KEY, sanitized);
    return sanitized;
  },

  /**
   * Get the current player name
   * @returns {string|null} Current player name or null
   */
  getCurrentPlayer() {
    return localStorage.getItem(CURRENT_PLAYER_KEY);
  },

  /**
   * Check if a player is set
   * @returns {boolean}
   */
  hasCurrentPlayer() {
    return !!this.getCurrentPlayer();
  },

  /**
   * Clear current player
   */
  clearCurrentPlayer() {
    localStorage.removeItem(CURRENT_PLAYER_KEY);
  },

  /**
   * Get all unique player names from scores
   * @returns {Array<string>} Sorted array of unique player names
   */
  getAllPlayerNames() {
    const scores = ScoreStorage.getAllScores();
    const names = new Set();

    scores.forEach(score => {
      if (score.playerName) {
        names.add(score.playerName);
      }
    });

    return Array.from(names).sort((a, b) => a.localeCompare(b));
  }
};

/**
 * Score Management
 */
const ScoreStorage = {
  /**
   * Save a score (only if 100% accuracy)
   * @param {Object} scoreData
   * @param {string} scoreData.playerName - Player name
   * @param {string} scoreData.game - Game name (multiplication-sprint, math-blitz, number-ninja)
   * @param {string} scoreData.difficulty - Difficulty (easy, normal, hard)
   * @param {number} scoreData.time - Time in seconds
   * @param {number} scoreData.accuracy - Accuracy percentage (should be 100)
   * @param {number} scoreData.correctAnswers - Number of correct answers
   * @param {number} scoreData.totalQuestions - Total questions (should be 20)
   * @returns {boolean} True if saved, false if not (accuracy < 100)
   */
  saveScore(scoreData) {
    // Only save perfect scores
    if (scoreData.accuracy !== 100 || scoreData.correctAnswers !== scoreData.totalQuestions) {
      return false;
    }

    const score = {
      playerName: scoreData.playerName,
      game: scoreData.game,
      difficulty: scoreData.difficulty,
      time: scoreData.time,
      accuracy: 100,
      correctAnswers: scoreData.correctAnswers,
      totalQuestions: scoreData.totalQuestions,
      date: new Date().toISOString(),
      timestamp: Date.now()
    };

    // Get all scores
    const allScores = this.getAllScores();
    allScores.push(score);

    // Save back to localStorage
    try {
      localStorage.setItem(ALL_SCORES_KEY, JSON.stringify(allScores));
      return true;
    } catch (e) {
      console.error('Failed to save score:', e);
      return false;
    }
  },

  /**
   * Get all scores from localStorage
   * @returns {Array} Array of score objects
   */
  getAllScores() {
    try {
      const data = localStorage.getItem(ALL_SCORES_KEY);
      return data ? JSON.parse(data) : [];
    } catch (e) {
      console.error('Failed to load scores:', e);
      return [];
    }
  },

  /**
   * Get scores filtered by criteria
   * @param {Object} filters
   * @param {string} filters.playerName - Filter by player name
   * @param {string} filters.game - Filter by game
   * @param {string} filters.difficulty - Filter by difficulty
   * @returns {Array} Filtered and sorted scores (best times first)
   */
  getScores(filters = {}) {
    let scores = this.getAllScores();

    // Apply filters
    if (filters.playerName) {
      scores = scores.filter(s => s.playerName === filters.playerName);
    }
    if (filters.game) {
      scores = scores.filter(s => s.game === filters.game);
    }
    if (filters.difficulty) {
      scores = scores.filter(s => s.difficulty === filters.difficulty);
    }

    // Sort by time (fastest first)
    scores.sort((a, b) => a.time - b.time);

    return scores;
  },

  /**
   * Get top N scores for a specific game and difficulty
   * @param {string} game - Game name
   * @param {string} difficulty - Difficulty level
   * @param {number} limit - Number of scores to return (default 50)
   * @returns {Array} Top scores with rankings
   */
  getLeaderboard(game, difficulty, limit = 50) {
    const scores = this.getScores({ game, difficulty });

    // Add ranking
    return scores.slice(0, limit).map((score, index) => ({
      ...score,
      rank: index + 1
    }));
  },

  /**
   * Get player's ranking for a specific game and difficulty
   * @param {string} playerName - Player name
   * @param {string} game - Game name
   * @param {string} difficulty - Difficulty level
   * @returns {Object|null} Player's best score with ranking or null
   */
  getPlayerRanking(playerName, game, difficulty) {
    const allScores = this.getLeaderboard(game, difficulty, 1000);
    const playerScores = allScores.filter(s => s.playerName === playerName);

    if (playerScores.length === 0) {
      return null;
    }

    // Return best score (lowest time)
    return playerScores[0];
  },

  /**
   * Get player's score history
   * @param {string} playerName - Player name
   * @param {number} limit - Number of recent scores (default 20)
   * @returns {Array} Recent scores sorted by date (newest first)
   */
  getPlayerHistory(playerName, limit = 20) {
    const scores = this.getAllScores()
      .filter(s => s.playerName === playerName)
      .sort((a, b) => b.timestamp - a.timestamp);

    return scores.slice(0, limit);
  },

  /**
   * Clear all scores (use with caution)
   */
  clearAllScores() {
    localStorage.removeItem(ALL_SCORES_KEY);
  },

  /**
   * Get statistics for a player
   * @param {string} playerName - Player name
   * @returns {Object} Statistics object
   */
  getPlayerStats(playerName) {
    const scores = this.getAllScores().filter(s => s.playerName === playerName);

    if (scores.length === 0) {
      return {
        totalGames: 0,
        perfectScores: 0,
        averageTime: 0,
        bestTime: null,
        gamesPlayed: {}
      };
    }

    const gamesPlayed = {};
    let totalTime = 0;
    let bestTime = Infinity;

    scores.forEach(score => {
      const key = `${score.game}_${score.difficulty}`;
      gamesPlayed[key] = (gamesPlayed[key] || 0) + 1;
      totalTime += score.time;
      if (score.time < bestTime) {
        bestTime = score.time;
      }
    });

    return {
      totalGames: scores.length,
      perfectScores: scores.length, // All saved scores are perfect
      averageTime: totalTime / scores.length,
      bestTime,
      gamesPlayed
    };
  }
};

/**
 * Make storage available globally
 */
window.PlayerStorage = PlayerStorage;
window.ScoreStorage = ScoreStorage;

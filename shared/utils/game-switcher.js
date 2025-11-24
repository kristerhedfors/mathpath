/**
 * Game Switcher Component
 * Provides a dropdown to switch between games or return to the main menu
 */

class GameSwitcher {
  /**
   * List of all available games
   */
  static GAMES = [
    {
      name: 'Multiplication Sprint',
      path: '/games/multiplication-sprint/index.html',
      icon: '🏃'
    },
    {
      name: 'Math Blitz',
      path: '/games/math-blitz/index.html',
      icon: '⚡'
    },
    {
      name: 'Number Ninja',
      path: '/games/number-ninja/index.html',
      icon: '🥷'
    }
  ];

  /**
   * Create a game switcher component
   * @param {string} currentGame - Name of the current game (optional)
   */
  constructor(currentGame = null) {
    this.currentGame = currentGame;
    this.isOpen = false;
  }

  /**
   * Render the game switcher button and dropdown
   * @returns {string} HTML string for the component
   */
  render() {
    const gameId = `game-switcher-${Math.random().toString(36).substr(2, 9)}`;

    return `
      <div class="game-switcher" style="position: relative; display: inline-block;">
        <button
          id="${gameId}-btn"
          class="game-switcher-btn"
          onclick="window.gameSwitcherToggle('${gameId}')"
          style="
            background: var(--color-bg-alt);
            border: 1px solid var(--color-border);
            border-radius: var(--radius-md);
            padding: var(--space-2) var(--space-3);
            font-size: var(--font-size-sm);
            cursor: pointer;
            display: flex;
            align-items: center;
            gap: var(--space-2);
            transition: all 0.2s;
          "
          onmouseover="this.style.background='var(--color-bg)'; this.style.borderColor='var(--color-primary)'"
          onmouseout="this.style.background='var(--color-bg-alt)'; this.style.borderColor='var(--color-border)'"
        >
          <span style="font-weight: var(--font-weight-semibold);">🎮 Games</span>
          <span style="font-size: var(--font-size-xs); opacity: 0.7;">▼</span>
        </button>

        <div
          id="${gameId}-dropdown"
          class="game-switcher-dropdown"
          style="
            display: none;
            position: absolute;
            top: calc(100% + var(--space-2));
            right: 0;
            background: var(--color-bg);
            border: 1px solid var(--color-border);
            border-radius: var(--radius-md);
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
            min-width: 240px;
            max-width: 300px;
            z-index: 1000;
            overflow: hidden;
          "
        >
          <div style="padding: var(--space-3); border-bottom: 1px solid var(--color-border); background: var(--color-bg-alt);">
            <div style="font-weight: var(--font-weight-semibold); font-size: var(--font-size-sm); color: var(--color-text-secondary);">
              Choose a Game
            </div>
          </div>

          <div style="max-height: 300px; overflow-y: auto;">
            <a
              href="/index.html"
              style="
                width: 100%;
                text-align: left;
                padding: var(--space-3) var(--space-4);
                background: transparent;
                border: none;
                cursor: pointer;
                font-size: var(--font-size-sm);
                transition: background 0.2s;
                display: flex;
                align-items: center;
                gap: var(--space-3);
                color: var(--color-text);
                text-decoration: none;
                border-bottom: 1px solid var(--color-border);
              "
              onmouseover="this.style.background='var(--color-primary-light)'"
              onmouseout="this.style.background='transparent'"
            >
              <span style="font-size: var(--font-size-lg);">🏠</span>
              <span style="font-weight: var(--font-weight-semibold);">All Games</span>
            </a>

            ${GameSwitcher.GAMES.map(game => `
              <a
                href="${game.path}"
                style="
                  width: 100%;
                  text-align: left;
                  padding: var(--space-3) var(--space-4);
                  background: ${this.currentGame === game.name ? 'var(--color-primary-light)' : 'transparent'};
                  border: none;
                  cursor: pointer;
                  font-size: var(--font-size-sm);
                  transition: background 0.2s;
                  display: flex;
                  align-items: center;
                  gap: var(--space-3);
                  color: var(--color-text);
                  text-decoration: none;
                "
                onmouseover="if ('${game.name}' !== '${this.currentGame}') this.style.background='var(--color-bg-alt)'"
                onmouseout="if ('${game.name}' !== '${this.currentGame}') this.style.background='transparent'"
              >
                <span style="font-size: var(--font-size-lg);">${game.icon}</span>
                <div style="flex: 1;">
                  <div>${game.name}</div>
                  ${this.currentGame === game.name ? '<div style="font-size: var(--font-size-xs); color: var(--color-primary); margin-top: 2px;">Currently Playing</div>' : ''}
                </div>
                ${this.currentGame === game.name ? '<span style="color: var(--color-primary);">✓</span>' : ''}
              </a>
            `).join('')}
          </div>
        </div>
      </div>
    `;
  }

  /**
   * Initialize event handlers (call after rendering)
   * @param {string} gameId - The unique ID for this game switcher instance
   */
  initialize(gameId) {
    // Close dropdown when clicking outside
    document.addEventListener('click', (e) => {
      const dropdown = document.getElementById(`${gameId}-dropdown`);
      const btn = document.getElementById(`${gameId}-btn`);
      if (dropdown && btn && !dropdown.contains(e.target) && !btn.contains(e.target)) {
        this.close(gameId);
      }
    });
  }

  /**
   * Toggle dropdown visibility
   * @param {string} gameId - The unique ID for this game switcher instance
   */
  toggle(gameId) {
    const dropdown = document.getElementById(`${gameId}-dropdown`);
    if (dropdown) {
      if (dropdown.style.display === 'none') {
        dropdown.style.display = 'block';
        this.isOpen = true;
      } else {
        dropdown.style.display = 'none';
        this.isOpen = false;
      }
    }
  }

  /**
   * Close the dropdown
   * @param {string} gameId - The unique ID for this game switcher instance
   */
  close(gameId) {
    const dropdown = document.getElementById(`${gameId}-dropdown`);
    if (dropdown) {
      dropdown.style.display = 'none';
      this.isOpen = false;
    }
  }
}

/**
 * Global helper function for inline event handlers
 */
window.gameSwitcherToggle = function(gameId) {
  const instance = window[`gameSwitcherInstance_${gameId}`];
  if (instance) {
    instance.toggle(gameId);
  }
};

/**
 * Helper function to easily add a game switcher to any element
 * @param {string|HTMLElement} containerSelector - CSS selector or element to append to
 * @param {string} currentGame - Name of the current game (optional)
 * @returns {GameSwitcher} The game switcher instance
 */
function createGameSwitcher(containerSelector, currentGame = null) {
  const container = typeof containerSelector === 'string'
    ? document.querySelector(containerSelector)
    : containerSelector;

  if (!container) {
    console.error('Game switcher container not found');
    return null;
  }

  const switcher = new GameSwitcher(currentGame);
  const html = switcher.render();
  container.innerHTML = html;

  // Extract the gameId from the rendered HTML
  const btn = container.querySelector('[id$="-btn"]');
  if (btn) {
    const gameId = btn.id.replace('-btn', '');
    window[`gameSwitcherInstance_${gameId}`] = switcher;
    switcher.initialize(gameId);
  }

  return switcher;
}

/**
 * Make GameSwitcher available globally
 */
window.GameSwitcher = GameSwitcher;
window.createGameSwitcher = createGameSwitcher;

# Claude Code Configuration - algebrain.dev

## Project Overview
Standalone math learning web games for kids in school using pure client-side technologies (HTML, JS, CSS). No frameworks, no build tools, no backwards compatibility.

## Core Principles
- **Client-side only**: Everything runs in the browser
- **No backwards compatibility**: Always improve and simplify, never maintain old patterns
- **Professional code quality**: Clean architecture, proper patterns, maintainable code
- **Standalone games**: Each game is independent and can work offline
- **Mobile-first**: Games must work on tablets and phones
- **Accessible**: WCAG AA compliance minimum

## Project Structure
```
/
├── index.html           - Main game launcher/menu
├── privacy.html         - Privacy information page
├── README.md            - Project documentation
├── CLAUDE.md            - Development guidelines (this file)
├── CNAME                - Domain configuration
│
├── games/
│   ├── math-blitz/           - One-at-a-time with streak counter
│   ├── multiplication-sprint/ - Grid format, answer in any order
│   ├── number-ninja/         - Gamified with combos and achievements
│   └── memory-match/         - Memory game matching problems to answers
│       ├── index.html        - Complete standalone game
│       ├── game.js           - Game logic
│       ├── style.css         - Game-specific styles
│       └── README.md         - Game instructions and learning goals
│
└── shared/
    ├── styles/
    │   └── common.css        - Design system (CSS custom properties)
    └── utils/
        ├── storage.js        - PlayerStorage & ScoreStorage
        ├── math.js           - MathUtils (question generation)
        ├── scoreboard.js     - Scoreboard component class
        ├── game-switcher.js  - GameSwitcher component
        └── player-switcher.js - PlayerSwitcher component
```

### Current Games

**Math Blitz** - One question at a time with full-screen focus, streak counter, and speed bonuses for answers under 3 seconds.

**Multiplication Sprint** - Grid format showing all 20 questions simultaneously. Answer in any order with strategic planning.

**Number Ninja** - Highly gamified with RPG elements, combo system (1x → 1.5x → 2x → 3x multipliers), and achievement badges.

**Memory Match** - Dual-grid memory game matching hidden problem cards to visible answer cards. Combines working memory with math fact practice.

## Code Standards

### HTML
- Semantic HTML5 elements
- ARIA labels and roles for accessibility
- No inline styles or scripts
- Self-contained: all resources in game folder or /shared/

### CSS
- CSS custom properties for theming and consistency
- Mobile-first responsive design with logical breakpoints
- Modern CSS (Grid, Flexbox, Container Queries)
- No vendor prefixes - target evergreen browsers only
- BEM or utility-first naming conventions
- Animations via CSS transitions and @keyframes

### JavaScript
- Modern ES6+ features (async/await, template literals, destructuring, optional chaining, arrow functions)
- **Global namespace pattern**: Classes and utilities attached to `window` object
- **Regular script tags**: `<script src="..."></script>` (NOT `type="module"`)
- **Script loading order**: Load dependencies before dependent code (storage → math → scoreboard → player-switcher → game)
- Class-based architecture with constructor functions
- Direct DOM manipulation using template literals and `innerHTML`
- No external dependencies or frameworks
- Proper error handling and edge cases
- Performance-conscious (requestAnimationFrame for animations, debouncing user input)

### Browser Support
Target modern evergreen browsers:
- Chrome/Edge 120+
- Firefox 120+
- Safari 17+
- Mobile browsers (iOS Safari 17+, Chrome Android)

No polyfills, no legacy support.

## Architecture Patterns

### Game Class Pattern
All games follow this standard class-based structure:

```javascript
// game.js
class MathBlitz {
  constructor(difficulty) {
    this.difficulty = difficulty;
    this.questions = [];
    this.currentQuestionIndex = 0;
    this.score = 0;
    this.startTime = null;
    this.streak = 0;
    // ... game-specific state properties
  }

  async initialize() {
    // Generate questions using MathUtils
    this.questions = MathUtils.generateQuestionSet(20, this.difficulty);
    this.render();
  }

  start() {
    this.startTime = Date.now();
    this.renderQuestion();
  }

  checkAnswer(answer) {
    // Validate answer, update score, handle feedback
    if (answer === this.questions[this.currentQuestionIndex].answer) {
      this.score++;
      this.streak++;
    } else {
      this.streak = 0;
    }
    this.nextQuestion();
  }

  nextQuestion() { /* ... */ }
  showResults() { /* ... */ }
}
```

### Script Loading Pattern
Load shared utilities in dependency order in HTML:

```html
<!-- Shared styles -->
<link rel="stylesheet" href="../../shared/styles/common.css">
<link rel="stylesheet" href="style.css">

<!-- Shared utilities (in dependency order) -->
<script src="../../shared/utils/storage.js"></script>
<script src="../../shared/utils/math.js"></script>
<script src="../../shared/utils/scoreboard.js"></script>
<script src="../../shared/utils/player-switcher.js"></script>

<!-- Game logic -->
<script src="game.js"></script>
```

### Two-Phase Initialization Pattern
All games use a consistent initialization flow:

```javascript
// Global game variable
let game = null;

// Phase 1: Player name prompt
function init() {
  const container = document.getElementById('game-container');
  showPlayerNamePrompt(container);
}

// Phase 2: Difficulty selection
function showDifficultySelection(playerName, container) {
  container.innerHTML = `
    <div class="difficulty-selection">
      <button onclick="startGame('easy')">Easy</button>
      <button onclick="startGame('medium')">Medium</button>
      <button onclick="startGame('hard')">Hard</button>
    </div>
  `;
}

// Phase 3: Game start
async function startGame(difficulty) {
  game = new MathBlitz(difficulty);
  await game.initialize();
  game.start();
}
```

### State Management
- Direct property mutation on game instance
- State properties stored as class instance variables
- DOM updated via `innerHTML` with template literals
- Single game instance per session (stored in global `game` variable)

### Shared Utilities Access
Access shared utilities via global namespace:

```javascript
// Generate questions
const questions = MathUtils.generateQuestionSet(20, 'medium');

// Get current player
const playerName = PlayerStorage.getCurrentPlayer();

// Save score
ScoreStorage.saveScore(playerName, score, gameName, difficulty);

// Instantiate scoreboard
const scoreboard = new Scoreboard(container, {
  game: 'math-blitz',
  difficulty: 'medium'
});
```

## Shared Utilities API

### MathUtils (`/shared/utils/math.js`)
Question generation and math operations:

```javascript
// Generate a set of questions
MathUtils.generateQuestionSet(count, difficulty)
// Returns: Array of { question: "7 × 8", answer: 56, operation: 'multiplication' }

// Generate wrong answers for multiple choice
MathUtils.generateWrongAnswers(correctAnswer, count)
// Returns: Array of plausible wrong answers

// Difficulty configurations
MathUtils.difficulties = {
  easy: { min: 2, max: 5 },
  medium: { min: 2, max: 10 },
  hard: { min: 2, max: 12 }
};
```

### PlayerStorage (`/shared/utils/storage.js`)
Player management with localStorage:

```javascript
// Get current player name
PlayerStorage.getCurrentPlayer()
// Returns: string | null

// Set current player
PlayerStorage.setCurrentPlayer(name)

// Get all players
PlayerStorage.getAllPlayers()
// Returns: Array of player names

// Storage key: 'algebrain_dev_current_player'
```

### ScoreStorage (`/shared/utils/storage.js`)
Leaderboard and score tracking:

```javascript
// Save a score (must be 100% accuracy to save)
ScoreStorage.saveScore(playerName, score, game, difficulty, timeMs)

// Get scores filtered by game and difficulty
ScoreStorage.getScores({ game, difficulty })
// Returns: Array of { playerName, score, game, difficulty, timestamp, timeMs }

// Get a player's best score
ScoreStorage.getPlayerBestScore(playerName, game, difficulty)

// Storage key: 'algebrain_dev_all_scores'
```

### Scoreboard Component (`/shared/utils/scoreboard.js`)
Reusable scoreboard UI with two tabs:

```javascript
// Instantiate scoreboard
const scoreboard = new Scoreboard(containerElement, {
  game: 'math-blitz',        // Game identifier
  difficulty: 'medium'        // Difficulty level
});

// Scoreboard automatically:
// - Shows "My Scores" tab with current player's history
// - Shows "All Players" tab with global leaderboard
// - Sorts by score (desc), then time (asc)
// - Displays relative time (e.g., "2 minutes ago")
```

### PlayerSwitcher Component (`/shared/utils/player-switcher.js`)
Player profile switcher UI:

```javascript
const playerSwitcher = new PlayerSwitcher(containerElement, onPlayerChange);

// Callback receives new player name when switched
function onPlayerChange(newPlayerName) {
  // Reload game state, update UI, etc.
}

// Automatically shows:
// - Current player name
// - Dropdown to switch players
// - Option to create new player
```

### GameSwitcher Component (`/shared/utils/game-switcher.js`)
Navigation between games:

```javascript
const gameSwitcher = new GameSwitcher(containerElement);

// Automatically renders buttons for all games:
// - Math Blitz
// - Multiplication Sprint
// - Number Ninja
// - Memory Match

// Navigates to game's index.html when clicked
```

### Design System (`/shared/styles/common.css`)
CSS custom properties for consistency:

```css
/* Colors */
--color-primary: #3b82f6;
--color-success: #10b981;
--color-danger: #ef4444;
--color-warning: #f59e0b;

/* Spacing (4px base) */
--space-1: 4px;
--space-2: 8px;
--space-3: 12px;
--space-4: 16px;
--space-6: 24px;
--space-8: 32px;

/* Typography */
--font-size-sm: 14px;
--font-size-base: 16px;
--font-size-lg: 20px;
--font-size-xl: 24px;
--font-size-2xl: 32px;

/* Effects */
--shadow-sm: 0 1px 2px rgba(0, 0, 0, 0.05);
--shadow-md: 0 4px 6px rgba(0, 0, 0, 0.1);
--transition-fast: 150ms ease;
```

## Development Workflow

### Creating a New Game
1. Create new folder in `/games/new-game-name/`
2. Copy structure from an existing game (e.g., math-blitz) as starting point
3. Define learning objectives and mechanics in README.md
4. Update HTML to load shared utilities in correct order
5. Implement game class with standard lifecycle methods (constructor, initialize, start, checkAnswer, showResults)
6. Build UI using template literals and direct DOM manipulation
7. Add game-specific styles in style.css
8. Integrate PlayerStorage, ScoreStorage, and Scoreboard components
9. Test on desktop and mobile devices
10. Accessibility audit (keyboard navigation, screen reader, ARIA labels)

### Testing Checklist
- [ ] Works on mobile (portrait and landscape)
- [ ] Touch and pointer events handled correctly
- [ ] Keyboard navigation complete
- [ ] Screen reader accessible
- [ ] No console errors or warnings
- [ ] Performance: 60fps animations, < 100ms interactions
- [ ] Loads in < 1 second on 3G
- [ ] Works offline after first load
- [ ] Visual regression testing

### Educational Requirements
- Clear learning objective
- Progressive difficulty curve
- Immediate, constructive feedback
- Multiple solution strategies supported
- Progress tracking
- Mastery-based advancement
- Research-backed pedagogy

## Code Quality

### Performance Guidelines
- Debounce/throttle frequent events
- Use requestAnimationFrame for animations
- Lazy load non-critical assets
- Minimize reflows and repaints
- Profile with DevTools before optimizing
- Keep bundle size < 50KB per game (excluding shared assets)

### Accessibility Standards
- Keyboard navigation for all interactions
- Proper focus management
- ARIA live regions for dynamic content
- Color contrast ratio ≥ 4.5:1 (WCAG AA)
- Touch targets ≥ 44x44px
- Screen reader tested
- Reduced motion preferences respected

### Error Handling
- Graceful degradation
- User-friendly error messages
- Console logging for debugging
- No unhandled promise rejections
- Input validation and sanitization

## File Organization

### Shared Code Guidelines
Extract to shared modules when:
- Used in 3+ games
- Pure, well-tested functions
- Stable API unlikely to change
- Reduces complexity significantly

Keep game-specific:
- Unique game mechanics
- Custom visual treatments
- One-off algorithms

### Asset Optimization
- **Images**: SVG preferred, or optimized WebP with PNG fallback
- **Sounds**: MP3/AAC, < 50KB each, normalized levels
- **Fonts**: WOFF2 format, subset to required characters
- **Icons**: SVG sprite or data URIs

## Development Commands

```bash
# Local development server
python3 -m http.server 8000
# or
npx serve

# Optional tooling
npm run lint          # ESLint + Stylelint
npm run format        # Prettier
npm run validate      # HTML validation
npm run lighthouse    # Performance + accessibility audit
```

## Design System

### Visual Hierarchy
- Consistent spacing scale (4px base)
- Typography scale (14/16/20/24/32/48px)
- Color palette with semantic naming
- Elevation system for depth
- Motion design principles

### Interaction Design
- < 100ms response to user input
- Loading states for async operations
- Optimistic UI updates
- Clear affordances for interactive elements
- Undo/redo support where appropriate

### Responsive Design
- Mobile: 320px - 767px
- Tablet: 768px - 1023px
- Desktop: 1024px+
- Touch-first interaction model
- Orientation change handling

## Git Workflow

### Commit Convention
```
feat: add division fact fluency game
fix: correct touch input delay on iOS
perf: optimize animation frame rate
style: update color contrast ratios
refactor: extract common game state logic
docs: add learning objectives to README
```

### Branch Strategy
- `main`: Production-ready games
- Feature branches: short-lived, descriptive names
- No backwards compatibility - breaking changes are fine

### Pre-commit
- Lint passes
- No console.log statements
- Game loads without errors
- Mobile tested if layout/interaction changed

## Common Patterns

### Game Initialization Flow
```javascript
// Global game variable
let game = null;

// 1. Page load - show player prompt
function init() {
  const container = document.getElementById('game-container');
  const currentPlayer = PlayerStorage.getCurrentPlayer();

  if (currentPlayer) {
    showDifficultySelection(currentPlayer, container);
  } else {
    showPlayerNamePrompt(container);
  }
}

// 2. Show difficulty selection
function showDifficultySelection(playerName, container) {
  container.innerHTML = `
    <div class="welcome-screen">
      <h2>Welcome, ${playerName}!</h2>
      <p>Select difficulty:</p>
      <button onclick="startGame('easy')">Easy (2-5)</button>
      <button onclick="startGame('medium')">Medium (2-10)</button>
      <button onclick="startGame('hard')">Hard (2-12)</button>
    </div>
  `;
}

// 3. Start game
async function startGame(difficulty) {
  const container = document.getElementById('game-container');
  game = new MathBlitz(difficulty);
  await game.initialize();
  game.start();
}

// Initialize on page load
document.addEventListener('DOMContentLoaded', init);
```

### Answer Validation Pattern
```javascript
checkAnswer(userAnswer) {
  const correct = this.questions[this.currentQuestionIndex];

  if (parseInt(userAnswer) === correct.answer) {
    // Correct answer
    this.score++;
    this.streak++;
    this.showFeedback('correct', '✓ Correct!');

    // Speed bonus check
    const timeTaken = Date.now() - this.questionStartTime;
    if (timeTaken < 3000) {
      this.showSpeedBonus();
    }
  } else {
    // Wrong answer
    this.streak = 0;
    this.showFeedback('incorrect', `✗ Wrong! Answer is ${correct.answer}`);
  }

  // Move to next question after delay
  setTimeout(() => this.nextQuestion(), 1500);
}
```

### DOM Rendering Pattern
```javascript
renderQuestion() {
  const q = this.questions[this.currentQuestionIndex];
  const container = document.getElementById('game-container');

  container.innerHTML = `
    <div class="game-screen">
      <div class="game-header">
        <div class="progress">Question ${this.currentQuestionIndex + 1}/20</div>
        <div class="score">Score: ${this.score}</div>
        <div class="timer">${this.formatTime(this.timeRemaining)}</div>
      </div>

      <div class="question-display">
        <h1>${q.question} = ?</h1>
      </div>

      <div class="answer-input">
        <input type="number" id="answer-input" autofocus>
        <button onclick="game.submitAnswer()">Submit</button>
      </div>
    </div>
  `;

  // Add event listeners after rendering
  document.getElementById('answer-input').addEventListener('keypress', (e) => {
    if (e.key === 'Enter') this.submitAnswer();
  });

  this.questionStartTime = Date.now();
}
```

### Results Screen with Scoreboard
```javascript
showResults() {
  const container = document.getElementById('game-container');
  const timeTaken = Date.now() - this.startTime;
  const isPerfect = this.score === 20;

  // Save score if perfect
  if (isPerfect) {
    const playerName = PlayerStorage.getCurrentPlayer();
    ScoreStorage.saveScore(playerName, this.score, 'math-blitz', this.difficulty, timeTaken);
  }

  container.innerHTML = `
    <div class="results-screen">
      <h2>${isPerfect ? '🎉 Perfect Score!' : 'Game Complete'}</h2>
      <div class="final-score">
        <p>Score: ${this.score}/20</p>
        <p>Time: ${Math.floor(timeTaken / 1000)}s</p>
      </div>
      <div id="scoreboard-container"></div>
      <button onclick="location.reload()">Play Again</button>
    </div>
  `;

  // Render scoreboard
  const scoreboardContainer = document.getElementById('scoreboard-container');
  new Scoreboard(scoreboardContainer, {
    game: 'math-blitz',
    difficulty: this.difficulty
  });
}
```

### Timer Pattern
```javascript
startTimer() {
  this.startTime = Date.now();
  this.timerInterval = setInterval(() => {
    const elapsed = Date.now() - this.startTime;
    this.timeRemaining = Math.max(0, 120 - Math.floor(elapsed / 1000));

    this.updateTimerDisplay();

    if (this.timeRemaining === 0) {
      clearInterval(this.timerInterval);
      this.showResults();
    }
  }, 100);
}
```

## Best Practices

### Do
- Write self-documenting code with clear naming
- Extract magic numbers to named constants
- Use early returns to reduce nesting
- Handle edge cases explicitly
- Profile before optimizing
- Test on real mobile devices
- Consider cognitive load on young users

### Don't
- Use frameworks or libraries
- Support legacy browsers
- Maintain backwards compatibility
- Add unnecessary abstractions
- Optimize prematurely
- Inline critical CSS/JS (keep files separate)
- Add features not directly supporting learning objectives

## Quick Reference

### Complete Minimal Game Template

**index.html**
```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>New Math Game - algebrain.dev</title>
  <link rel="stylesheet" href="../../shared/styles/common.css">
  <link rel="stylesheet" href="style.css">
</head>
<body>
  <div id="game-container"></div>

  <!-- Load shared utilities in dependency order -->
  <script src="../../shared/utils/storage.js"></script>
  <script src="../../shared/utils/math.js"></script>
  <script src="../../shared/utils/scoreboard.js"></script>
  <script src="../../shared/utils/player-switcher.js"></script>

  <!-- Load game logic -->
  <script src="game.js"></script>
</body>
</html>
```

**game.js**
```javascript
class NewMathGame {
  constructor(difficulty) {
    this.difficulty = difficulty;
    this.questions = [];
    this.currentQuestionIndex = 0;
    this.score = 0;
    this.startTime = null;
  }

  async initialize() {
    // Generate questions using shared MathUtils
    this.questions = MathUtils.generateQuestionSet(20, this.difficulty);
    this.render();
  }

  start() {
    this.startTime = Date.now();
    this.renderQuestion();
  }

  renderQuestion() {
    const q = this.questions[this.currentQuestionIndex];
    const container = document.getElementById('game-container');
    container.innerHTML = `
      <div class="question">${q.question} = ?</div>
      <input type="number" id="answer" autofocus>
      <button onclick="game.checkAnswer()">Submit</button>
    `;
  }

  checkAnswer() {
    const userAnswer = parseInt(document.getElementById('answer').value);
    const correct = this.questions[this.currentQuestionIndex].answer;

    if (userAnswer === correct) {
      this.score++;
    }

    this.nextQuestion();
  }

  nextQuestion() {
    this.currentQuestionIndex++;
    if (this.currentQuestionIndex < this.questions.length) {
      this.renderQuestion();
    } else {
      this.showResults();
    }
  }

  showResults() {
    const container = document.getElementById('game-container');
    const timeTaken = Date.now() - this.startTime;

    // Save perfect scores
    if (this.score === 20) {
      const playerName = PlayerStorage.getCurrentPlayer();
      ScoreStorage.saveScore(playerName, this.score, 'new-game', this.difficulty, timeTaken);
    }

    container.innerHTML = `
      <h2>Final Score: ${this.score}/20</h2>
      <div id="scoreboard"></div>
    `;

    // Show scoreboard
    new Scoreboard(document.getElementById('scoreboard'), {
      game: 'new-game',
      difficulty: this.difficulty
    });
  }

  render() {
    // Initial render logic
  }
}

// Global game instance
let game = null;

// Initialization function
function init() {
  const container = document.getElementById('game-container');
  const currentPlayer = PlayerStorage.getCurrentPlayer();

  if (!currentPlayer) {
    showPlayerNamePrompt(container);
  } else {
    showDifficultySelection(currentPlayer, container);
  }
}

function showPlayerNamePrompt(container) {
  container.innerHTML = `
    <input type="text" id="player-name" placeholder="Enter your name">
    <button onclick="setPlayerName()">Start</button>
  `;
}

function setPlayerName() {
  const name = document.getElementById('player-name').value;
  if (name) {
    PlayerStorage.setCurrentPlayer(name);
    showDifficultySelection(name, document.getElementById('game-container'));
  }
}

function showDifficultySelection(playerName, container) {
  container.innerHTML = `
    <h2>Welcome, ${playerName}!</h2>
    <button onclick="startGame('easy')">Easy</button>
    <button onclick="startGame('medium')">Medium</button>
    <button onclick="startGame('hard')">Hard</button>
  `;
}

async function startGame(difficulty) {
  game = new NewMathGame(difficulty);
  await game.initialize();
  game.start();
}

// Start on page load
document.addEventListener('DOMContentLoaded', init);
```

### Storage Keys Reference
```javascript
// All localStorage keys use 'algebrain_dev_' prefix
'algebrain_dev_current_player'  // Current player name
'algebrain_dev_all_scores'      // Array of all scores
```

### Common Difficulty Configurations
```javascript
const difficulties = {
  easy: { min: 2, max: 5 },      // 2×3, 4×5, etc.
  medium: { min: 2, max: 10 },   // 2×7, 9×8, etc.
  hard: { min: 2, max: 12 }      // 7×11, 12×9, etc.
};
```

## Resources
- [MDN Web Docs](https://developer.mozilla.org/)
- [Can I Use](https://caniuse.com/)
- [Web Performance](https://web.dev/performance/)
- [WCAG Guidelines](https://www.w3.org/WAI/WCAG22/quickref/)
- [A11y Project](https://www.a11yproject.com/)

---

**Philosophy**: Write professional, maintainable code. Create engaging, educational experiences. Never compromise on quality or accessibility. Break things to make them better.

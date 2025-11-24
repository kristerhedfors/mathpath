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
/games/
  /addition-race/      - Each game in its own folder
    index.html         - Complete standalone game
    style.css          - Game-specific styles
    game.js            - Game logic
    README.md          - Game instructions and learning goals
  /multiplication-grid/
  /fraction-builder/
/shared/
  /utils/              - Reusable JavaScript modules
  /styles/             - Common CSS patterns
  /assets/             - Shared images, sounds, fonts
/docs/
  game-template.html   - Starting template for new games
  design-system.md     - Visual design guidelines
```

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
- Modern ES6+ (async/await, destructuring, optional chaining, nullish coalescing)
- ES Modules with `<script type="module">`
- Functional programming patterns where appropriate
- Immutable data patterns for state management
- No external dependencies or frameworks
- Proper error handling and edge cases
- Performance-conscious (requestAnimationFrame for animations)

### Browser Support
Target modern evergreen browsers:
- Chrome/Edge 120+
- Firefox 120+
- Safari 17+
- Mobile browsers (iOS Safari 17+, Chrome Android)

No polyfills, no legacy support.

## Architecture Patterns

### Game Module Pattern
```javascript
// game.js
export class MathGame {
  constructor(config) {
    this.state = this.initializeState(config);
    this.ui = new GameUI(this.container);
    this.setupEventListeners();
  }

  initializeState(config) {
    return {
      score: 0,
      level: config.startLevel || 1,
      questions: [],
      currentQuestion: null,
      config
    };
  }

  start() { /* ... */ }
  checkAnswer(answer) { /* ... */ }
  nextQuestion() { /* ... */ }
}
```

### State Management
- Immutable state updates
- Single source of truth per game
- State changes trigger UI updates
- No direct DOM manipulation from game logic

### UI Separation
- Game logic separate from UI rendering
- UI components accept state, emit events
- Declarative rendering patterns
- Minimal DOM queries (cache selectors)

## Development Workflow

### Creating a New Game
1. Copy game template to `/games/new-game-name/`
2. Define learning objectives and mechanics in README.md
3. Implement game logic with tests
4. Build UI layer
5. Add responsive styles
6. Optimize performance
7. Accessibility audit
8. Mobile device testing

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

### Game Initialization
```javascript
const config = {
  difficulty: 'easy',
  timeLimit: 60,
  questionsPerRound: 10,
  soundEnabled: true
};

const game = new MathGame(config);
await game.initialize();
game.start();
```

### State Updates
```javascript
updateState(changes) {
  this.state = {
    ...this.state,
    ...changes,
    updatedAt: Date.now()
  };
  this.render();
}
```

### Event Handling
```javascript
setupEventListeners() {
  this.ui.on('answer-submitted', (answer) => {
    this.checkAnswer(answer);
  });

  this.ui.on('restart', () => {
    this.reset();
  });
}
```

### Animation
```javascript
animate() {
  const animate = (timestamp) => {
    if (!this.state.animating) return;

    const progress = (timestamp - this.state.startTime) / this.state.duration;

    if (progress < 1) {
      this.updateAnimation(progress);
      requestAnimationFrame(animate);
    } else {
      this.completeAnimation();
    }
  };

  requestAnimationFrame(animate);
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

### Game Template Structure
```javascript
// game.js
import { randomInt, shuffle } from '/shared/utils/math.js';
import { GameUI } from '/shared/utils/ui.js';

export class NewGame {
  constructor(container, options = {}) {
    this.container = container;
    this.options = { ...defaultOptions, ...options };
    this.state = this.initializeState();
  }

  async initialize() {
    await this.loadAssets();
    this.setupUI();
    this.bindEvents();
  }

  start() { /* game loop */ }
}

// index.html entry point
import { NewGame } from './game.js';
const game = new NewGame(document.getElementById('game-container'));
await game.initialize();
```

### Performance Monitoring
```javascript
if (import.meta.env.DEV) {
  performance.mark('game-start');
  // ... game code
  performance.mark('game-ready');
  performance.measure('initialization', 'game-start', 'game-ready');
  console.log(performance.getEntriesByType('measure'));
}
```

## Resources
- [MDN Web Docs](https://developer.mozilla.org/)
- [Can I Use](https://caniuse.com/)
- [Web Performance](https://web.dev/performance/)
- [WCAG Guidelines](https://www.w3.org/WAI/WCAG22/quickref/)
- [A11y Project](https://www.a11yproject.com/)

---

**Philosophy**: Write professional, maintainable code. Create engaging, educational experiences. Never compromise on quality or accessibility. Break things to make them better.

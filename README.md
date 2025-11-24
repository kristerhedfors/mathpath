# 🎮 algebrain.dev

Three engaging multiplication games for kids aged 12-15, teaching multiplication (2×2 to 12×12), addition, and subtraction through different gameplay styles.

## 🎯 Games Overview

### 🏃 Multiplication Sprint
**Grid quiz format** - All 20 questions visible at once
- Answer questions in any order
- See all choices simultaneously
- Strategic planning encouraged
- Progress bar tracks completion
- Best for: Students who like seeing the big picture

### ⚡ Math Blitz
**One-at-a-time format** - Lightning-fast sequential challenges
- Full-screen focus on current question
- Build answer streaks
- "FAST!" bonus for answers under 3 seconds
- Animated feedback after each answer
- Best for: Students who prefer focused attention

### 🥷 Number Ninja
**Gamified format** - RPG-style with combos and achievements
- Combo system with score multipliers (1x → 1.5x → 2x → 3x)
- Earn achievement badges
- Particle effects and animations
- Ninja-themed visual design
- Best for: Students motivated by game mechanics

## ✨ Key Features

### Common Across All Games
- **20 questions per round**: 16 multiplication (80%), 4 addition/subtraction (20%)
- **2-minute time limit**: Complete all questions before time runs out
- **5 multiple-choice answers**: Reduces guessing, teaches discrimination
- **3 difficulty levels**: Easy, Normal, Hard
- **Player names**: Enter once, stored locally
- **Unified scoreboard**: Separate leaderboards per game and difficulty
- **Two-tab scoreboard**: "My Scores" and "All Players"
- **100% accuracy requirement**: Only perfect scores reach the leaderboard
- **LocalStorage persistence**: All data saved in browser
- **No login required**: Fully client-side, privacy-friendly
- **Offline capable**: Works without internet after first load
- **Mobile-first**: Responsive design for all devices

## 📊 Difficulty Levels

### Easy
- Multiplication: Tables 2-6
- Addition/Subtraction: 2-digit numbers (10-99)
- Target: Students beginning multiplication

### Normal
- Multiplication: Tables 2-10, includes some 7×N and 9×N
- Addition/Subtraction: 2-3 digit numbers (10-999)
- Target: Students with basic multiplication knowledge

### Hard
- Multiplication: All tables 2-12, emphasis on 7, 9, 11, 12
- Addition/Subtraction: 3-digit numbers (100-999)
- Target: Advanced students seeking mastery

## 🚀 Getting Started

### For Players
1. Open `index.html` in a web browser
2. Choose a game from the main menu
3. Enter your player name
4. Select difficulty level
5. Read the instructions
6. Start playing!

### For Developers
```bash
# Clone or download the repository
cd algebrain.dev

# Start a local server (choose one):
python3 -m http.server 8000
# or
npx serve
# or
php -S localhost:8000

# Open in browser
open http://localhost:8000
```

## 📁 Project Structure

```
algebrain.dev/
├── index.html                      # Main game selector/launcher
├── README.md                       # This file
├── CLAUDE.md                       # Project configuration
│
├── shared/                         # Shared resources
│   ├── styles/
│   │   └── common.css             # Design system & common styles
│   └── utils/
│       ├── storage.js             # localStorage management
│       ├── math.js                # Question generation
│       └── scoreboard.js          # Reusable scoreboard component
│
└── games/                          # Individual games
    ├── multiplication-sprint/
    │   ├── index.html             # Game entry point
    │   ├── game.js                # Game logic
    │   ├── style.css              # Game-specific styles
    │   └── README.md              # Game documentation
    │
    ├── math-blitz/
    │   ├── index.html
    │   ├── game.js
    │   ├── style.css
    │   └── README.md
    │
    └── number-ninja/
        ├── index.html
        ├── game.js
        ├── style.css
        └── README.md
```

## 🎨 Design System

### Color Palette
- **Primary**: Indigo (#6366f1) - Main interactive elements
- **Secondary**: Pink (#ec4899) - Accents
- **Success**: Green (#10b981) - Correct answers
- **Warning**: Orange (#f59e0b) - Timers, combos
- **Error**: Red (#ef4444) - Wrong answers
- **Info**: Cyan (#06b6d4) - Informational elements

### Typography
- System font stack (SF Pro, Segoe UI, Roboto)
- Scale: 12px to 48px
- Clear hierarchy for readability

### Spacing
- 4px base unit
- Consistent scale throughout

## 💾 Data Storage

### LocalStorage Schema

**Current Player**
```
algebrain_dev_current_player: "PlayerName"
```

**All Scores**
```json
algebrain_dev_all_scores: [
  {
    "playerName": "Alex",
    "game": "multiplication-sprint",
    "difficulty": "hard",
    "time": 87,
    "accuracy": 100,
    "correctAnswers": 20,
    "totalQuestions": 20,
    "date": "2025-11-24T10:30:00.000Z",
    "timestamp": 1732446600000
  }
]
```

### Privacy
- All data stored locally in browser
- No server communication
- No tracking or analytics
- No personal information collected
- Player name is optional (can be nickname)

## 🧮 Question Generation Algorithm

### Multiplication
- **Easy**: Tables 2-6, multiplied by 2-10
- **Normal**: Tables 2-10, multiplied by 2-12
- **Hard**: Tables 2-12, multiplied by 2-12, with 2× frequency for 7, 9, 11, 12

### Addition/Subtraction
- Random number generation within difficulty range
- Subtraction ensures positive results (num1 ≥ num2)

### Wrong Answers
- Off-by-one variations
- Common mistake patterns (e.g., wrong table)
- Random variations within ±30% range
- Always unique and positive

## 🏆 Scoreboard Logic

### Requirements for Leaderboard
1. **100% accuracy** (20/20 correct)
2. **Complete all questions** (no timeouts mid-game)
3. **Valid player name** set

### Ranking
- Sorted by time (fastest first)
- Ties broken by date (earlier first)

### Display
- **My Scores Tab**: Filtered to current player, all attempts
- **All Players Tab**: Top 50 across all players
- Shows: Rank, Player Name, Time, Date
- Highlights current player with badge
- Top 3 get medal emojis (🥇🥈🥉)

## 🎓 Educational Standards

### Common Core Mathematics
- **3.OA.C.7**: Fluently multiply and divide within 100
- **4.NBT.B.4**: Fluently add and subtract multi-digit numbers
- **5.NBT.B.5**: Fluently multiply multi-digit whole numbers

### NCTM Standards
- Number & Operations: Build fluency with arithmetic
- Problem Solving: Apply computational skills efficiently
- Reasoning: Use estimation to evaluate answers

## ♿ Accessibility

- **WCAG AA compliant**: 4.5:1 color contrast ratios
- **Keyboard navigation**: Full tab + enter support
- **Screen reader support**: ARIA labels throughout
- **Touch targets**: Minimum 44×44px buttons
- **Reduced motion**: Respects `prefers-reduced-motion`
- **High contrast mode**: Adapts to system settings
- **Semantic HTML**: Proper heading hierarchy

## 📱 Browser Support

### Supported (Evergreen Browsers)
- Chrome/Edge 120+
- Firefox 120+
- Safari 17+
- Mobile browsers (iOS Safari 17+, Chrome Android)

### Not Supported
- Internet Explorer (any version)
- Legacy browsers

### Required Features
- ES6+ JavaScript (modules, async/await, destructuring)
- CSS Grid and Flexbox
- CSS Custom Properties
- LocalStorage API

## 🎮 Gameplay Mechanics Summary

### Multiplication Sprint
- Grid display of all questions
- Click answer buttons to select
- Submit when all answered
- Progress bar shows completion
- View correct answers after

### Math Blitz
- One question at a time
- Auto-advance on selection
- Streak counter for consecutive correct
- "FAST!" bonus for <3 second answers
- Animated feedback overlay

### Number Ninja
- One question at a time
- Combo system (resets on wrong answer)
- Score multipliers (1x/1.5x/2x/3x)
- Achievement badges (First Blood, Triple Threat, etc.)
- Particle effects on correct answers
- Ninja star themed buttons

## 📈 Performance Targets

### Load Time
- First paint: <500ms
- Interactive: <1000ms
- Total size: <50KB per game (excluding shared)

### Runtime
- 60fps animations
- <100ms interaction response
- No frame drops during gameplay

## 🔧 Technical Stack

- **HTML5**: Semantic markup
- **CSS3**: Modern layout (Grid, Flexbox)
- **JavaScript ES6+**: Modules, classes, async/await
- **No frameworks**: Pure vanilla JavaScript
- **No build tools**: Direct browser execution
- **No dependencies**: Self-contained

## 🤝 Contributing

This project follows clean code principles:
- No backwards compatibility (always improve)
- Professional code quality
- Mobile-first responsive design
- Accessibility is required, not optional
- Performance is a feature

## 📄 License

See LICENSE file for details.

## 👨‍💻 Development Notes

### Adding a New Game
1. Create folder in `/games/{game-name}/`
2. Copy template structure (index.html, game.js, style.css, README.md)
3. Implement game class with required methods
4. Import shared utilities (storage, math, scoreboard)
5. Use common CSS design system
6. Add to main index.html

### Shared Utilities
- **storage.js**: Always use for player names and scores
- **math.js**: Use `generateQuestionSet()` for consistency
- **scoreboard.js**: Instantiate with game name and difficulty
- **common.css**: Import for design tokens and base styles

### Best Practices
- Keep games standalone (can work independently)
- Follow existing naming conventions
- Maintain 2-minute time limit
- Require 100% accuracy for leaderboard
- Provide comprehensive README for each game

## 🎉 Credits

Built with [Claude Code](https://claude.com/claude-code) following modern web development best practices.

---

**Have fun learning math!** 🎮📚✨

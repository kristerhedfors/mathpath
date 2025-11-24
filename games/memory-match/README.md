# Memory Match 🧠

A memory-based math game that challenges students to match hidden math problems with their answers. This unique dual-grid design combines working memory training with math fact fluency practice.

## Learning Objectives

### Primary Skills
- **Math Fact Fluency**: Instant recall of addition, subtraction, multiplication, and division facts
- **Working Memory**: Holding multiple pieces of information in mind simultaneously
- **Pattern Recognition**: Identifying relationships between problems and answers
- **Strategic Thinking**: Planning which cards to flip for optimal matching

### Cognitive Development
- **Visual-Spatial Memory**: Remembering locations of revealed cards
- **Attention Control**: Maintaining focus across multiple grids
- **Executive Function**: Goal-directed behavior and self-monitoring
- **Mental Calculation**: Quick computation before matching

### Secondary Benefits
- **Problem Solving**: Developing efficient strategies to minimize attempts
- **Perseverance**: Continuing despite incorrect matches
- **Time Management**: Working efficiently within time constraints
- **Self-Assessment**: Evaluating performance and improving strategies

## Game Mechanics

### Layout
- **Left Grid (3×4)**: Problem cards that are initially hidden
  - Click to flip and reveal math problems
  - Problems stay revealed only if matched correctly
  - Unmatched cards flip back after incorrect attempt

- **Right Grid (3×4)**: Answer cards that are always visible
  - Answers are shuffled randomly
  - Click to attempt a match with selected problem
  - Matched answers are highlighted and locked

### Gameplay Flow
1. **Select a Problem**: Click any card in the left grid to flip and reveal
2. **Find the Match**: Click the corresponding answer in the right grid
3. **Validate**:
   - ✅ Correct: Both cards stay revealed and highlighted
   - ❌ Incorrect: Problem card flips back; attempt counted
4. **Continue**: Repeat until all 12 pairs are matched
5. **Win**: Match all pairs before the 3-minute timer expires

### Scoring System
- **Primary Metric**: Number of attempts (lower is better)
- **Perfect Score**: 12 attempts (each card matched on first try)
- **Time Bonus**: Faster completion improves ranking
- **Efficiency**: (12 ÷ attempts) × 100%

## Difficulty Levels

### Easy
- **Operations**: Addition and subtraction only
- **Range**: Numbers 1-10
- **Examples**:
  - 5 + 3 = 8
  - 9 - 4 = 5
- **Ideal For**: Grades K-2, beginners building fact fluency

### Medium
- **Operations**: All four operations (addition, subtraction, multiplication, division)
- **Range**: Numbers 1-50
- **Examples**:
  - 6 × 7 = 42
  - 24 ÷ 6 = 4
  - 35 - 18 = 17
- **Ideal For**: Grades 3-4, intermediate learners

### Hard
- **Operations**: All four operations with complex problems
- **Range**: Numbers 1-100
- **Examples**:
  - 12 × 8 = 96
  - 84 ÷ 7 = 12
  - 67 + 28 = 95
- **Ideal For**: Grades 5+, advanced students

## Educational Standards Alignment

### Common Core Math Standards
- **CCSS.MATH.CONTENT.1.OA.C.6**: Add and subtract within 20
- **CCSS.MATH.CONTENT.2.OA.B.2**: Fluently add and subtract within 20
- **CCSS.MATH.CONTENT.3.OA.C.7**: Fluently multiply and divide within 100
- **CCSS.MATH.CONTENT.4.NBT.B.4**: Fluently add and subtract multi-digit numbers
- **CCSS.MATH.CONTENT.5.NBT.B.5**: Fluently multiply multi-digit whole numbers

### Research-Based Design

**Dual-Coding Theory**: Combining visual (card positions) and verbal (math facts) information enhances memory encoding and retrieval.

**Spaced Retrieval**: Revisiting unmatched problems after intervals strengthens long-term retention.

**Active Recall**: Requiring students to retrieve answers from memory rather than simple recognition improves learning.

**Immediate Feedback**: Instant validation of matches provides corrective learning opportunities.

**Cognitive Load Management**: Limiting to 12 pairs prevents working memory overload while providing sufficient challenge.

## Instructional Strategies

### For Teachers

**Warm-Up Activity**
Use as a 5-10 minute brain booster at the start of math lessons to activate prior knowledge.

**Differentiation**
- Struggling learners: Start with Easy difficulty
- On-level students: Medium difficulty for mixed practice
- Advanced students: Hard difficulty or set personal best goals

**Progress Monitoring**
Track attempts over time to measure improvement in both math fluency and memory skills.

**Small Group Competition**
Students take turns, comparing attempts needed. Encourages peer learning and motivation.

**Error Analysis**
Discuss strategies after games: "Which cards were hardest to remember?" "What patterns helped you match faster?"

### For Parents

**Home Practice**
- 10-15 minutes per session, 3-4 times per week
- Focus on one difficulty level until mastery (≤15 attempts consistently)
- Celebrate improvements in attempts, not just completion

**Growth Mindset**
Emphasize that memory and math skills improve with practice. Frame incorrect matches as learning opportunities.

**Strategy Discussion**
Ask: "How did you remember where cards were?" "Did you group problems mentally?"

## Accessibility Features

- **Keyboard Navigation**: Full game playable via keyboard
- **Screen Reader Support**: ARIA labels for all interactive elements
- **Color Contrast**: WCAG AA compliant (4.5:1 minimum)
- **Touch-Friendly**: 44×44px minimum touch targets
- **Reduced Motion**: Respects prefers-reduced-motion settings
- **Responsive Design**: Works on all screen sizes (phone, tablet, desktop)

## Technical Implementation

### Architecture
- **Client-Side Only**: No server required, works offline
- **Modern JavaScript**: ES6+ with class-based structure
- **CSS Animations**: Hardware-accelerated transforms
- **Local Storage**: Scores persisted across sessions
- **Mobile-First**: Optimized for touch interactions

### Performance
- **Fast Load**: < 1 second on 3G connection
- **Smooth Animations**: 60fps card flips
- **Memory Efficient**: Minimal DOM manipulation
- **Battery Friendly**: RequestAnimationFrame for animations

## Tips for Success

### Beginner Strategies
1. **One at a time**: Focus on remembering one card before flipping another
2. **Patterns first**: Look for easy patterns (e.g., doubles like 5+5)
3. **Left to right**: Flip cards systematically rather than randomly
4. **Repeat answers**: Say the answer aloud to reinforce memory

### Advanced Strategies
1. **Chunking**: Group related problems mentally (all 6× facts together)
2. **Elimination**: Remember which answers you've already tried
3. **Speed reading**: Quickly scan right grid before selecting left card
4. **Visual anchors**: Associate card positions with visual cues

### Time Management
- Don't spend too long searching for answers
- If unsure, make your best guess and move on
- Aim for completion first, then optimize for fewer attempts

## Assessment Rubric

### Mastery Indicators
- **Beginning**: 20+ attempts, frequent timeouts
- **Developing**: 16-19 attempts, occasional timeouts
- **Proficient**: 13-15 attempts, consistent completion
- **Advanced**: ≤12 attempts, no timeouts
- **Expert**: Perfect score (12 attempts) with time under 90 seconds

## Future Enhancements

Potential additions based on user feedback:
- Custom problem sets for targeted practice
- Sound effects and audio feedback options
- Multiplayer mode (pass-and-play or online)
- Daily challenge mode with global leaderboards
- Achievement system for milestone completion
- Adaptive difficulty based on performance

## Credits

Part of the algebrain.dev suite - educational math games for elementary and middle school students.

**Pedagogical Approach**: Based on research in cognitive load theory, spaced repetition, and active recall.

**Design Philosophy**: Engaging gameplay without gamification gimmicks. Pure focus on learning outcomes.

## License

Educational use permitted. See main project LICENSE for details.

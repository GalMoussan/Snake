# Snake Game - Component Specifications

**Version:** 1.0.0
**Last Updated:** 2026-03-24
**Category:** Game UI Components

---

## Table of Contents

1. [Container Components](#container-components)
2. [Canvas & Game Area](#canvas--game-area)
3. [Score Display](#score-display)
4. [Game Entities](#game-entities)
5. [Screen Overlays](#screen-overlays)
6. [Controls](#controls)
7. [Accessibility Notes](#accessibility-notes)

---

## Container Components

### Game Container

**Purpose:** Main wrapper for the entire game interface
**Level:** Wrapper/Layout
**Responsibility:** Center game on screen, manage overall layout

**Visual Specifications:**
- `display: flex`
- `flex-direction: column`
- `align-items: center`
- `justify-content: center`
- `min-height: 100vh` (full viewport height)
- `background-color: #1A1A2E` (dark navy background)
- `font-family: 'Press Start 2P', monospace`
- `overflow: hidden`

**Responsive Behavior:**
- Mobile (<640px): Adjust padding, scale canvas
- Tablet (640px-1024px): Standard layout
- Desktop (>1024px): Standard layout

---

## Canvas & Game Area

### Canvas Element

**Purpose:** Main HTML5 Canvas for game rendering
**Level:** Core Game Surface
**Responsibility:** Render snake, food, grid, and all game visuals

**Technical Specifications:**
```
Canvas Size: 600px × 400px (30×20 cells @ 20px/cell)
Context: 2D (CanvasRenderingContext2D)
Pixel Ratio: window.devicePixelRatio for sharp rendering
Interpolation: imageSmoothingEnabled = true
```

**Visual Styling:**
- `border: 2px solid #333333`
- `border-radius: 8px`
- `box-shadow: 0 10px 15px rgba(0, 0, 0, 0.5)`
- `background-color: #1A1A2E`
- `margin: 16px auto`

**Internal Grid Rendering:**
- Cell size: 20px × 20px
- Grid lines (optional): `rgba(255, 255, 255, 0.05)` stroke
- Line width: 0.5px

**Z-Index Layer:** 1 (base game layer)

---

### Canvas Wrapper

**Purpose:** Container around canvas for layout control
**Level:** Layout

**Visual Specifications:**
```css
display: flex;
align-items: center;
justify-content: center;
flex-direction: column;
padding: 16px;
background-color: transparent;
```

---

## Score Display

### Score Header Container

**Purpose:** Display current score and high score
**Level:** UI Component
**Responsibility:** Show game metrics

**Position:** Above canvas
**Layout:** Horizontal flex, space-between

**Visual Specifications:**
```css
width: 100%;
max-width: 600px;
display: flex;
justify-content: space-between;
align-items: center;
padding: 0 16px;
margin-bottom: 16px;
```

### Score Display (Current)

**Purpose:** Show current game score
**Level:** UI Component

**Visual Specifications:**
- `font-size: 16px`
- `font-weight: 600`
- `color: #FFFFFF`
- `text-shadow: 0 2px 4px rgba(0, 0, 0, 0.5)`
- `font-family: 'Press Start 2P', monospace`
- `letter-spacing: 0.05em`

**Content Format:** `Score: {number}`
**Example:** `Score: 1250`

**Accessibility:**
- `aria-label: "Current score: 1250 points"`
- Updated dynamically when score changes
- Screen reader announcements on score increase

---

### High Score Display

**Purpose:** Show highest score achieved
**Level:** UI Component

**Visual Specifications:**
- `font-size: 16px`
- `font-weight: 600`
- `color: #B0B0B0` (secondary text)
- `text-shadow: 0 2px 4px rgba(0, 0, 0, 0.5)`
- `font-family: 'Press Start 2P', monospace`

**Content Format:** `High: {number}`
**Example:** `High: 5000`

**Accessibility:**
- `aria-label: "High score: 5000 points"`
- Read on page load
- Updated only when current score exceeds previous high

---

## Game Entities

### Snake Visual

**Purpose:** Visual representation of the player's snake
**Level:** Game Entity
**Rendered:** On canvas via rendering system

#### Snake Head

**Visual Specifications:**
- `fill-color: #4CAF50` (vibrant green)
- `width: 20px`
- `height: 20px`
- `border-radius: 2px`
- `box-shadow: inset 0 1px 2px rgba(255, 255, 255, 0.2)` (subtle highlight)
- Optional: Eyes or direction indicator
  - Small circles or points showing facing direction
  - Color: darker green or white
  - Positioned at edge of head toward direction

**Direction Indicators:**
```
Up:    • •  (two dots at top)
Down:  • •  (two dots at bottom)
Left:  • •  (two dots at left)
Right: • •  (two dots at right)
```

**Z-Index Layer:** 4

**Animation:**
- Smooth movement at 60 FPS
- No interpolation between grid cells (snappy movement)
- Death animation: 0.3s fade-out on collision

#### Snake Body Segments

**Visual Specifications:**
- `fill-color: #81C784` (lighter green)
- `width: 20px`
- `height: 20px`
- `border-radius: 2px`
- Slight gap between segments: 1px
- `box-shadow: inset 0 1px 2px rgba(255, 255, 255, 0.15)`

**Z-Index Layer:** 3

**Animation:**
- Smooth following animation
- Each segment trails the segment ahead
- Death animation: cascade fade-out (head to tail)

**Accessibility:**
- Announce collision on death: "Game Over! You hit a wall."
- Aria-live region for real-time updates
- Keyboard navigation still functional during gameplay

---

### Food Visual

**Purpose:** Visual representation of food pellet
**Level:** Game Entity
**Rendered:** On canvas via rendering system

**Visual Specifications:**
- `fill-color: #F44336` (vibrant red)
- `shape: circle`
- `diameter: 16px` (slightly smaller than cell)
- `border-radius: 50%`
- `position: centered in cell` (2px offset from edges)
- `box-shadow: 0 0 8px rgba(244, 67, 54, 0.6)` (glow effect)

**Animation: Food Pulse**
```
Duration: 0.5s
Easing: ease-in-out
Iteration: infinite (repeating)

Keyframes:
  0%:   opacity 0.7, scale 1.0
  50%:  opacity 1.0, scale 1.15
  100%: opacity 0.7, scale 1.0
```

**Glow Effect:**
- Secondary glow circle behind main food
- `fill-color: rgba(244, 67, 54, 0.3)`
- `diameter: 24px`
- Z-order: behind food element

**Z-Index Layer:** 2

**Accessibility:**
- Announce food consumption: "Food eaten! +10 points"
- aria-live region for feedback

---

## Screen Overlays

### Start Screen

**Purpose:** Initial game screen before gameplay
**Level:** Screen/Modal
**Triggered:** On page load, game initialization

**Visual Specifications:**
- Full canvas coverage
- `background-color: rgba(26, 26, 46, 0.95)` (semi-transparent dark overlay)
- `display: flex`
- `flex-direction: column`
- `justify-content: center`
- `align-items: center`
- `z-index: 20`

**Content Elements:**

#### Title
```
Font Size: 24px
Font Weight: 700
Color: #FFFFFF
Text: "SNAKE"
Letter Spacing: 0.05em
Text Shadow: 0 4px 8px rgba(0, 0, 0, 0.7)
Margin Bottom: 48px
```

#### Instructions
```
Font Size: 12px
Font Weight: 400
Color: #B0B0B0
Content: "Use arrow keys or WASD to move"
Margin Bottom: 24px
Text Align: center
```

#### Start Prompt
```
Font Size: 14px
Font Weight: 600
Color: #4CAF50
Content: "Press SPACE to start"
Animation: Blinking (1s duration, infinite)
```

**Animation on Load:**
- Fade in over 0.3s
- Decorative snake animation on side (nice-to-have)

**Keyboard Interaction:**
- `Space` key: Start game, close overlay
- Screen reader announcement: "Press Space to start the game"

**Accessibility:**
- `role: "dialog"`
- `aria-label: "Game start screen"`
- Focus trap on start screen
- Announce instructions to screen readers

---

### Pause Screen Overlay

**Purpose:** Show when game is paused
**Level:** Screen/Modal
**Triggered:** When user presses `Space` during gameplay or clicks Pause button

**Visual Specifications:**
- Full canvas coverage
- `background-color: rgba(0, 0, 0, 0.8)` (darker overlay for emphasis)
- Fade in animation: 0.2s ease-in
- `z-index: 20`

**Content Elements:**

#### "PAUSED" Text
```
Font Size: 20px
Font Weight: 700
Color: #FFFFFF
Text Shadow: 0 4px 8px rgba(0, 0, 0, 0.7)
Margin Bottom: 32px
```

#### Resume Instruction
```
Font Size: 12px
Font Weight: 400
Color: #B0B0B0
Content: "Press SPACE to resume"
```

**Keyboard Interaction:**
- `Space` key: Resume game, close overlay
- `Escape` key: Also resume (alternative)
- Other keys: Buffered for input system

**Accessibility:**
- `role: "dialog"`
- `aria-label: "Game paused"`
- Initial focus on resume instruction
- Announce pause state: "Game paused"

---

### Game Over Screen

**Purpose:** Display end-of-game results and restart prompt
**Level:** Screen/Modal
**Triggered:** When snake collides with wall or itself

**Visual Specifications:**
- Full canvas coverage
- `background-color: rgba(0, 0, 0, 0.85)` (emphasis overlay)
- Fade in animation: 0.3s ease-out
- `display: flex`
- `flex-direction: column`
- `justify-content: center`
- `align-items: center`
- `z-index: 20`

**Content Elements:**

#### "GAME OVER" Heading
```
Font Size: 20px
Font Weight: 700
Color: #F44336 (red for emphasis)
Text Shadow: 0 4px 8px rgba(244, 67, 54, 0.5)
Margin Bottom: 32px
Animation: Slide down + fade in (0.4s ease-out)
```

#### Final Score Display
```
Font Size: 16px
Font Weight: 600
Color: #FFFFFF
Content: "Final Score: {number}"
Margin Bottom: 16px
Text Shadow: 0 2px 4px rgba(0, 0, 0, 0.5)
```

#### High Score Comparison (Conditional)
```
Shown if: Final Score > Previous High Score
Content: "New High Score!"
Font Size: 14px
Font Weight: 700
Color: #4CAF50
Animation: Pulse (0.6s ease-in-out)
Margin Bottom: 24px
```

#### Restart Instruction
```
Font Size: 12px
Font Weight: 400
Color: #B0B0B0
Content: "Press SPACE to restart"
Margin Top: 24px
Animation: Blinking (1s duration, infinite)
```

**Keyboard Interaction:**
- `Space` key: Restart game, close overlay, reset game state
- `Escape` key: Return to start screen (alternative)

**Accessibility:**
- `role: "dialog"`
- `aria-label: "Game over screen"`
- Announce result: "Game over. Final score: 1250"
- If high score: "New high score! 5000 points"
- Focus initially on restart instruction
- Screen reader reads all content

---

## Controls

### Control Button Bar

**Purpose:** Container for game control buttons
**Level:** UI Component
**Position:** Below canvas

**Visual Specifications:**
```css
display: flex;
gap: 12px;
justify-content: center;
align-items: center;
padding: 16px;
margin-top: 16px;
```

---

### Button: Pause

**Purpose:** Toggle game pause state
**Level:** UI Component

**Visual Specifications:**
```
Padding: 12px 24px
Min Height: 44px (touch target)
Background: #4CAF50
Color: #FFFFFF
Font Size: 14px
Font Weight: 600
Font Family: 'Press Start 2P', monospace
Border: None
Border Radius: 4px
Cursor: pointer
Text Shadow: 0 1px 2px rgba(0, 0, 0, 0.2)
```

**States:**
- **Default:** Green background, white text
- **Hover:** Background #66BB6A (lighter green), cursor pointer
- **Active/Pressed:** Background #388E3C (darker green), scale 0.95
- **Disabled:** Background #757575 (gray), cursor not-allowed
  - Disabled when state is IDLE or GAME_OVER

**Animation:**
- Hover: 0.2s ease-out color transition
- Press: 0.1s ease-out scale animation

**Keyboard Accessible:**
- Focusable via Tab
- Activatable via Enter or Space
- Focus ring: 2px white outline with 2px offset

**Accessibility:**
- `role: "button"`
- `aria-label: "Pause game" | "Resume game"` (changes based on state)
- `aria-pressed: true | false`
- Keyboard activation with Enter/Space

---

### Button: Reset

**Purpose:** Reset game to initial state
**Level:** UI Component

**Visual Specifications:**
- Same as Pause button
- Label: "RESET"
- `aria-label: "Reset game to start"`

**Behavior:**
- Available at all times (except during active gameplay)
- Clears score, resets snake to center
- Resets food position
- Does not affect high score

---

### Button: Mute

**Purpose:** Toggle sound effects on/off
**Level:** UI Component

**Visual Specifications:**
- Same button styling as Pause/Reset
- Label: "MUTE" or "SOUND" (toggles)
- `aria-label: "Toggle sound effects"`
- `aria-pressed: true | false`

**Behavior:**
- Persists in localStorage
- Remembers user preference across sessions
- Updates icon/label on toggle

---

### Footer Controls Area

**Purpose:** Container for control buttons
**Level:** Layout Component

**Visual Specifications:**
```css
display: flex;
justify-content: center;
align-items: center;
gap: 12px;
padding: 16px;
width: 100%;
max-width: 600px;
margin: 0 auto;
```

**Responsive:**
- Mobile: Stack buttons vertically if needed
- Desktop: Horizontal layout

---

## Accessibility Notes

### Keyboard Navigation

**Game Controls:**
- `Arrow Up` / `W`: Move snake up
- `Arrow Down` / `S`: Move snake down
- `Arrow Left` / `A`: Move snake left
- `Arrow Right` / `D`: Move snake right
- `Space`: Start/Resume/Restart game, Dismiss overlays
- `P`: Pause/Resume toggle (alternative)
- `R`: Reset game
- `M`: Mute/Unmute sound
- `Tab`: Navigate through UI buttons
- `Escape`: Pause or return to start

**Focus Management:**
- Visible focus ring on all buttons (2px white outline)
- Focus initially on first interactive element
- Logical tab order: Pause → Reset → Mute
- Focus trap on modal screens (start, pause, game over)

### Screen Reader Support

**Announcements:**
- Page load: "Snake game loaded. Press Space to start."
- Game start: "Game started. Use arrow keys or WASD to move."
- Food eaten: "Food eaten! Score increased to {number}."
- Game paused: "Game paused. Press Space to resume."
- Snake collision: "Collision! Game over."
- Game over: "Game over! Final score {number}."
- High score beaten: "New high score! {number} points."

**ARIA Attributes:**
- `aria-label`: Descriptive labels for all interactive elements
- `aria-live="polite"`: Dynamic score and status updates
- `aria-busy="true"`: During animations or loading
- `aria-pressed`: Toggle buttons (Pause, Mute)
- `aria-disabled`: When buttons are disabled

### Color Contrast

**Text on Background:**
- White (#FFFFFF) on dark (#1A1A2E): 14.5:1 ratio (AAA)
- Green (#4CAF50) on dark (#1A1A2E): 5.8:1 ratio (AA)
- Light gray (#B0B0B0) on dark: 8.2:1 ratio (AAA)
- Red (#F44336) on dark: 5.1:1 ratio (AA)

### Reduced Motion

**Implementation:**
```css
@media (prefers-reduced-motion: reduce) {
  * {
    animation-duration: 0s !important;
    transition-duration: 0s !important;
  }

  .food { animation: none; }
  .ui-fade { opacity: 1; transform: none; }
}
```

**Behavior:**
- Disable food pulse animation
- Disable overlay fade animations
- Disable button press scale animation
- Maintain instant state changes

### Focus Management

**Start Screen:** Focus on "Press SPACE" prompt
**Game Over Screen:** Focus on "Press SPACE to restart" text
**During Gameplay:** No focus management needed (keyboard controls active)
**Pause Screen:** Focus on "Press SPACE to resume" text

---

## Component Hierarchy

```
GameContainer
├── GameTitle (Start Screen Only)
├── Instructions (Start Screen Only)
├── CanvasWrapper
│   └── HTMLCanvasElement (600x400)
├── ScoreDisplay
│   ├── CurrentScore
│   └── HighScore
├── ControlButtonBar
│   ├── PauseButton
│   ├── ResetButton
│   └── MuteButton
├── StartScreenOverlay
│   ├── Title
│   ├── Instructions
│   └── StartPrompt
├── PauseScreenOverlay
│   └── ResumePrompt
└── GameOverScreenOverlay
    ├── GameOverHeading
    ├── FinalScore
    ├── HighScoreIndicator (conditional)
    └── RestartPrompt
```

---

## Testing Requirements

### Visual Testing
- [ ] Button states (default, hover, active, disabled)
- [ ] Screen transitions (fade in/out)
- [ ] Score display updates
- [ ] Overlay positioning and opacity

### Interaction Testing
- [ ] Button click handlers
- [ ] Keyboard navigation between buttons
- [ ] Game state transitions via controls
- [ ] Overlay visibility based on game state

### Accessibility Testing
- [ ] Screen reader announces all text
- [ ] Keyboard navigation works without mouse
- [ ] Color contrast meets WCAG AA
- [ ] Focus ring visible on all buttons
- [ ] Reduced motion respected

### Responsive Testing
- [ ] Canvas scales on mobile devices
- [ ] Buttons remain touchable (min 44px)
- [ ] Layout adapts to screen width
- [ ] Text remains readable

---

## Implementation Notes

1. **Canvas Rendering:** All game entities (snake, food, grid) are rendered directly to canvas, not as DOM elements
2. **State-Driven UI:** Overlay visibility driven by game state (IDLE, PLAYING, PAUSED, GAME_OVER)
3. **Event Binding:** Button events bind to game controller methods
4. **Persistence:** High score persisted via localStorage
5. **Touch Compatibility:** Buttons designed for minimum 44px touch target
6. **Animations:** Use CSS for UI animations, RequestAnimationFrame for game rendering

---

**Last Updated:** 2026-03-24
**Next Review:** Upon visual polish sprint (TASK-018)

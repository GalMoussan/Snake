# Snake Game - Layout Specifications

**Version:** 1.0.0
**Last Updated:** 2026-03-24
**Category:** Layout & Responsive Design

---

## Table of Contents

1. [Screen Structure](#screen-structure)
2. [Dimensions & Sizing](#dimensions--sizing)
3. [Responsive Design](#responsive-design)
4. [Grid System](#grid-system)
5. [Z-Index Layers](#z-index-layers)
6. [Safe Areas](#safe-areas)
7. [Spacing Reference](#spacing-reference)

---

## Screen Structure

### Main Layout

```
┌─────────────────────────────────────────────────────────┐
│                   GAME CONTAINER                         │
│                  (Flex Column, Center)                   │
├─────────────────────────────────────────────────────────┤
│                                                           │
│                    HEADER (40px)                         │
│  Score: 0                           High Score: 1250    │
│                                                           │
├─────────────────────────────────────────────────────────┤
│                                                           │
│                    CANVAS AREA                           │
│  ┌───────────────────────────────────────────────────┐  │
│  │                                                   │  │
│  │      GAME CANVAS (600x400 = 30x20 cells)         │  │
│  │                                                   │  │
│  │  [Snake rendering + Food + Grid]                 │  │
│  │                                                   │  │
│  └───────────────────────────────────────────────────┘  │
│  Border: 2px solid #333                                 │
│  Box-shadow: 0 10px 15px rgba(0,0,0,0.5)               │
│                                                           │
├─────────────────────────────────────────────────────────┤
│                                                           │
│               CONTROLS AREA (50px)                       │
│            [Pause] [Reset] [Mute]                        │
│                                                           │
└─────────────────────────────────────────────────────────┘
```

### Start Screen (Before Gameplay)

```
┌─────────────────────────────────────────────────────────┐
│                   GAME CONTAINER                         │
│               (Overlay on Canvas Area)                   │
├─────────────────────────────────────────────────────────┤
│                                                           │
│                                                           │
│                      SNAKE (Title)                       │
│                       24px, Bold                         │
│                      margin-bottom: 48px                │
│                                                           │
│          Use arrow keys or WASD to move                 │
│              12px, secondary color                       │
│                      margin-bottom: 24px                │
│                                                           │
│               Press SPACE to start                       │
│            14px, green (blinking animation)             │
│                                                           │
│                                                           │
└─────────────────────────────────────────────────────────┘
```

### Pause Screen (During Gameplay)

```
┌─────────────────────────────────────────────────────────┐
│              DARK OVERLAY (rgba(0,0,0,0.8))             │
│                   (Flex Center)                         │
├─────────────────────────────────────────────────────────┤
│                                                           │
│                                                           │
│                      PAUSED                              │
│                    20px, Bold, White                     │
│                      margin-bottom: 32px                │
│                                                           │
│                 Press SPACE to resume                    │
│                12px, secondary color                     │
│                                                           │
│                                                           │
└─────────────────────────────────────────────────────────┘
```

### Game Over Screen (End of Gameplay)

```
┌─────────────────────────────────────────────────────────┐
│              DARK OVERLAY (rgba(0,0,0,0.85))            │
│                   (Flex Center)                         │
├─────────────────────────────────────────────────────────┤
│                                                           │
│                     GAME OVER                            │
│                20px, Bold, Red (#F44336)                │
│                      margin-bottom: 32px                │
│                                                           │
│                  Final Score: 1250                       │
│               16px, Bold, White, Center                 │
│                      margin-bottom: 16px                │
│                                                           │
│                  New High Score!  [if applicable]        │
│               14px, Bold, Green, Pulsing                │
│                      margin-bottom: 24px                │
│                                                           │
│                Press SPACE to restart                    │
│              12px, secondary color, blinking            │
│                      margin-top: 24px                   │
│                                                           │
└─────────────────────────────────────────────────────────┘
```

---

## Dimensions & Sizing

### Canvas Dimensions

| Property | Value | Notes |
|----------|-------|-------|
| **Width** | 600px | 30 cells × 20px |
| **Height** | 400px | 20 cells × 20px |
| **Aspect Ratio** | 3:2 | Maintains on responsive |
| **Cell Size** | 20px × 20px | Fixed grid unit |
| **Border** | 2px solid #333 | Visual container |
| **Border Radius** | 8px | Subtle rounded corners |

### Container Dimensions

| Element | Width | Height | Notes |
|---------|-------|--------|-------|
| **Game Container** | 100vw | 100vh | Full screen |
| **Canvas Wrapper** | max-width: 600px | auto | Responsive scaling |
| **Header** | 100% | 40px | Score display area |
| **Canvas** | 600px | 400px | Game rendering area |
| **Footer/Controls** | 100% | 50px | Button container |
| **Total Container Height** | 600px | 490px | Header + Canvas + Footer |

### Responsive Canvas Scaling

**Desktop (>1024px):**
```
Canvas: 600px × 400px (fixed)
Container: 600px × 490px (fixed)
Padding: 16px on sides
```

**Tablet (768px - 1024px):**
```
Canvas: 90vw (max 600px) × auto (maintains aspect ratio)
Container: 90vw × auto
Example: 614px viewport = 551px canvas × 367px
```

**Mobile (320px - 768px):**
```
Canvas: 100vw - 32px (for padding) × auto (maintains aspect ratio)
Container: 100vw × auto
Example: 375px viewport = 311px canvas × 207px
Minimum playable: 280px width
```

**Calculation Formula:**
```javascript
const containerWidth = Math.min(600, windowWidth - 32);
const canvasHeight = containerWidth * (400 / 600); // Aspect ratio
```

---

## Responsive Design

### Mobile-First Approach

The layout prioritizes mobile devices first, then scales up.

### Breakpoints

```javascript
const breakpoints = {
  mobile_small: 320,   // Small phones
  mobile: 640,          // Phones and small tablets
  tablet: 1024,         // Tablets
  desktop: 1280,        // Desktop and large screens
};
```

### Layout Adaptations

#### Mobile (<640px)

**Canvas:**
- Scales to 100% viewport width minus padding (32px)
- Maximum 600px
- Maintains 3:2 aspect ratio
- Minimum width: 280px (playable, but cramped)

**Typography:**
- Title: 20px (down from 24px)
- Score: 14px (down from 16px)
- Body: 11px (down from 12px)
- Button: 12px (down from 14px)

**Spacing:**
- Reduced margins: 8px instead of 16px
- Button padding: 10px 20px (instead of 12px 24px)
- Gap between buttons: 8px (instead of 12px)

**Buttons:**
- Stack vertically if needed
- Width: 100% or flex equally
- Height: 44px minimum (touch target)

**Overlays:**
- Full screen coverage
- Extra padding around content
- Centered vertically and horizontally

**Responsiveness Example:**
```
iPhone SE (375px):
  Canvas width = 375 - 32 = 343px
  Canvas height = 343 × (400/600) = 229px
  Cell size = 343 / 30 ≈ 11.4px (scaled internally)
```

#### Tablet (640px - 1024px)

**Canvas:**
- 90vw, capped at 600px
- Maintains 3:2 aspect ratio
- Centered on screen

**Typography:**
- Standard sizing (24px, 16px, 12px)
- Normal letter spacing

**Spacing:**
- Standard spacing (16px base unit)
- Normal button padding (12px 24px)

**Buttons:**
- Horizontal layout
- Gap: 12px between buttons

#### Desktop (>1024px)

**Canvas:**
- Fixed 600px × 400px
- Centered on screen
- Maximum container: 600px

**Typography:**
- Standard sizing throughout

**Spacing:**
- Standard spacing throughout

**Layout:**
- Fixed dimensions
- Centered in viewport
- No wrapping needed

### Orientation Handling

**Portrait:**
- Canvas width-constrained
- Full-height vertical layout
- Good for phones

**Landscape:**
- Canvas height-constrained
- Can be wider
- Good for tablets and desktop

**Recommendation:**
- Lock to portrait on mobile for consistent experience
- Allow landscape on tablet/desktop

---

## Grid System

### Internal Game Grid

**Grid Dimensions:**
```
Columns: 30 cells
Rows: 20 cells
Cell Size: 20px × 20px
Total: 600px × 400px
```

**Grid Coordinate System:**
```
(0,0) ─────────────────── (29,0)
  │                          │
  │                          │
  │     GAME CANVAS         │
  │                          │
  │                          │
(0,19) ──────────────────(29,19)
```

**Cell Positioning:**
- Cell (x, y) occupies pixel space:
  - `x_pixel = x * 20`
  - `y_pixel = y * 20`

**Example Positions:**
```
Snake head at (15, 10):
  - Top-left pixel: (300, 200)
  - Center: (310, 210)

Food at (8, 5):
  - Top-left pixel: (160, 100)
  - Center: (170, 110)
```

### Rendering Layers

**Canvas Layer Order (Bottom to Top):**

```
Layer 0: Background
├─ Fill: #1A1A2E
└─ Optional grid lines: rgba(255,255,255,0.05)

Layer 1: Grid Lines (Optional)
└─ Grid pattern overlay

Layer 2: Food
├─ Glow circle: 24px diameter, rgba(244,67,54,0.3)
└─ Food pellet: 16px diameter, #F44336

Layer 3: Snake Body
├─ Body segments: #81C784, 20px squares
└─ Slight gaps between segments

Layer 4: Snake Head
└─ Head: #4CAF50, 20px square with direction indicator
```

**Z-Index Values (CSS):**

```css
background = 0
grid_lines = 1
food = 2
snake_body = 3
snake_head = 4
ui_base = 10
ui_elements = 15
overlay = 20
modal = 30
tooltip = 40
```

---

## Z-Index Layers

### Z-Index Map

```
40  ┌─ Tooltips & Popups
    │
30  ├─ Modal Dialogs
    │  ├─ Game Over Screen
    │  ├─ Pause Screen
    │  └─ Start Screen
    │
20  ├─ Overlays
    │  ├─ Dark backdrop for overlays
    │  └─ Fade in/out transitions
    │
15  ├─ UI Elements
    │  ├─ Button Hover states
    │  ├─ Focus rings
    │  └─ Interactive feedback
    │
10  ├─ UI Base Layer
    │  ├─ Score display
    │  ├─ Button backgrounds
    │  └─ Control panel
    │
 4  ├─ Snake Head
    │
 3  ├─ Snake Body
    │
 2  ├─ Food
    │
 1  ├─ Grid Lines (optional)
    │
 0  └─ Background & Canvas Base
```

### Layering Rules

1. **Game entities** (snake, food) are drawn to canvas, not DOM elements
2. **UI controls** (buttons, score) are DOM elements with z-index 10-15
3. **Overlays** (pause, game over) use z-index 20
4. **Modals** (start, dialogs) use z-index 30
5. **Tooltips** use z-index 40

### Interaction with Z-Index

**Overlay Behavior:**
- Overlay appears on top of canvas (z-index: 20)
- Buttons behind overlay are non-interactive
- Focus trapped to overlay content

**Canvas Interaction:**
- Canvas always below overlays
- Game rendering continues during pause (optional visual effect)
- Click events don't pass through overlays

---

## Safe Areas

### Keyboard Navigation Safe Zones

**Focus Elements (Tab Order):**
1. Pause Button (z-index: 15)
2. Reset Button (z-index: 15)
3. Mute Button (z-index: 15)

**Focus Ring:**
- 2px white outline
- 2px offset from element
- Visible at z-index: 16

### Overlay Safe Zones

**Start Screen:**
- Full canvas coverage
- Modal dialog (z-index: 30)
- Focus trap on "Press SPACE to start"

**Pause Screen:**
- Full canvas coverage
- Modal dialog (z-index: 30)
- Focus trap on "Press SPACE to resume"

**Game Over Screen:**
- Full canvas coverage
- Modal dialog (z-index: 30)
- Focus trap on "Press SPACE to restart"

### Minimum Touch Targets

**Mobile (≤640px):**
- All buttons: minimum 44px × 44px
- Spacing between buttons: 12px minimum
- Tap targets should not overlap

**Desktop (>640px):**
- Button height: 44px minimum (good practice)
- Button width: 120px minimum
- Spacing: 12px between buttons

---

## Spacing Reference

### Base Spacing Unit: 8px

```
xs:  4px   (half unit)
sm:  8px   (1 unit)
md:  16px  (2 units)
lg:  24px  (3 units)
xl:  32px  (4 units)
2xl: 48px  (6 units)
```

### Component Spacing

**Header (Score Display):**
```
Top padding: 16px (md)
Bottom margin: 16px (md)
Gap between scores: 24px (lg)
Horizontal padding: 16px (md)
```

**Canvas:**
```
Margin: 16px (md)
Border width: 2px
Border radius: 8px
Box shadow: 0 10px 15px rgba(0,0,0,0.5)
```

**Controls:**
```
Top margin: 16px (md)
Bottom margin: 16px (md)
Gap between buttons: 12px (sm + 4px)
Padding: 16px (md)
```

**Buttons:**
```
Padding: 12px 24px
Min height: 44px
Border radius: 4px
Font size: 14px
```

**Overlays:**
```
Padding top/bottom: 48px (2xl)
Padding left/right: 16px (md)
Gap between elements: 32px (xl)
Title margin: 32px (xl) bottom
```

### Responsive Spacing Adjustments

**Mobile (<640px):**
```
Header: 8px margin instead of 16px
Canvas: 8px margin instead of 16px
Controls: 8px margin instead of 16px
Button padding: 10px 20px instead of 12px 24px
Button gap: 8px instead of 12px
Overlay padding: 24px instead of 48px
```

**Tablet (640px - 1024px):**
```
Standard spacing throughout (as above)
```

**Desktop (>1024px):**
```
Standard spacing throughout (as above)
```

---

## Layout Implementation Checklist

### Viewport & Container
- [ ] Viewport meta tag set: `viewport-width=device-width, initial-scale=1`
- [ ] Body: `width: 100vw, height: 100vh, margin: 0, padding: 0`
- [ ] Game container: `display: flex, flex-direction: column, justify-content: center, align-items: center`

### Canvas Setup
- [ ] Canvas element: 600×400 minimum (before scaling)
- [ ] Canvas wrapper: responsive sizing with max-width
- [ ] Device pixel ratio handling: `canvas.width = canvasElement.clientWidth * window.devicePixelRatio`
- [ ] Border & shadow applied via CSS

### Score Display
- [ ] Header container: flex with space-between
- [ ] Current score and high score: separate elements
- [ ] Typography: Press Start 2P font, 16px, white
- [ ] Text shadow: `0 2px 4px rgba(0,0,0,0.5)`

### Buttons
- [ ] Button container: flex with gap 12px
- [ ] Each button: min-height 44px, padding 12px 24px
- [ ] Focus ring: 2px white outline with 2px offset
- [ ] Hover state: background color change
- [ ] Active state: scale transform

### Overlays
- [ ] Positioned: `position: absolute, top: 0, left: 0, width: 100%, height: 100%`
- [ ] Centered content: `display: flex, flex-direction: column, justify-content: center, align-items: center`
- [ ] Backdrop: `background: rgba(0,0,0,0.8 or 0.85)`
- [ ] Z-index: 20 for overlays, 30 for modals

### Responsive
- [ ] Media queries for 320px, 640px, 1024px breakpoints
- [ ] Aspect ratio maintained on canvas scaling
- [ ] Typography scales on mobile
- [ ] Button spacing adjusts for mobile
- [ ] Touch targets minimum 44px

---

## Testing Checklist

### Layout Testing
- [ ] Desktop: Canvas is 600px × 400px
- [ ] Mobile (320px): Canvas scales to fit screen
- [ ] Mobile (640px): Canvas is responsive
- [ ] Tablet: Canvas scales appropriately
- [ ] All content visible without horizontal scroll

### Responsive Testing
- [ ] Canvas aspect ratio maintained (3:2)
- [ ] Buttons remain clickable on mobile
- [ ] Score display readable on all sizes
- [ ] Overlays fill screen properly
- [ ] Text doesn't overflow containers

### Z-Index Testing
- [ ] Canvas always below overlays
- [ ] Buttons always above canvas
- [ ] Focus ring visible over all elements
- [ ] Overlay blocks canvas interaction
- [ ] Tooltip appears above overlays (if implemented)

### Spacing Testing
- [ ] 16px spacing on desktop
- [ ] 8px spacing on mobile
- [ ] Buttons have 12px gap
- [ ] No content cutoff
- [ ] Consistent margins/padding

---

## Mobile Considerations

### Viewport Configuration
```html
<meta name="viewport" content="width=device-width, initial-scale=1.0, user-scalable=no">
```

### Touch Target Size
- All buttons: minimum 44px × 44px
- Spacing between targets: 12px minimum
- No overlap between touch targets

### Orientation Lock (Recommended)
```javascript
// Lock to portrait on mobile
if (window.innerWidth < 768) {
  screen.orientation.lock('portrait');
}
```

### Safe Area Insets (for notched phones)
```css
padding: max(0px, env(safe-area-inset-top));
padding: max(0px, env(safe-area-inset-left));
padding: max(0px, env(safe-area-inset-right));
padding: max(0px, env(safe-area-inset-bottom));
```

---

## Performance Considerations

### Rendering Performance
- Canvas rendering: 60 FPS target
- UI animations: kept minimal (200-500ms)
- Overlay transitions: 200-300ms fade
- No layout thrashing (batch DOM updates)

### CSS Optimization
- Use `transform` and `opacity` for animations (GPU accelerated)
- Avoid layout-triggering properties
- Use `will-change` sparingly on animated elements
- Hardware acceleration: `transform: translateZ(0)` if needed

### Responsive Image Handling
- SVG icons where possible
- Minimal image assets
- Retina display support via canvas devicePixelRatio

---

**Last Updated:** 2026-03-24
**Next Review:** During visual polish sprint (TASK-018)

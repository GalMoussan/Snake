# Snake Game Design System - Quick Reference

**Version:** 1.0.0
**Last Updated:** 2026-03-24
**Purpose:** Quick lookup for common design specifications

---

## Color Palette

### Primary Game Colors
```
Snake Head:      #4CAF50  (RGB: 76, 175, 80)      - Vibrant Green
Snake Body:      #81C784  (RGB: 129, 199, 132)    - Light Green
Food:            #F44336  (RGB: 244, 67, 54)      - Vibrant Red
Background:      #1A1A2E  (RGB: 26, 26, 46)       - Dark Navy
```

### UI Text Colors
```
Text Primary:    #FFFFFF  (RGB: 255, 255, 255)    - White
Text Secondary:  #B0B0B0  (RGB: 176, 176, 176)    - Light Gray
Border:          #333333  (RGB: 51, 51, 51)       - Dark Gray
```

### Button States
```
Primary (Default):   #4CAF50  - Green
Hover:               #66BB6A  - Lighter Green
Active/Pressed:      #388E3C  - Darker Green
Disabled:            #757575  - Gray
```

### Special Effects
```
Food Glow:           rgba(244, 67, 54, 0.6)      - Red Glow
Grid Lines:          rgba(255, 255, 255, 0.05)   - Subtle Grid
Overlay:             rgba(0, 0, 0, 0.8)          - Dark Overlay
```

---

## Typography

### Font Stack
```
Primary Font:        'Press Start 2P' (retro pixel font)
Fallback Font:       system-ui, -apple-system, sans-serif
Import:              Google Fonts or local file
```

### Size Scale
```
24px  → Game title "SNAKE", major headings
20px  → Screen titles (Game Over, Paused)
16px  → Score display, section headers
14px  → Button labels, UI controls
12px  → Instructions, helper text, body content
10px  → Small labels, micro copy, captions
```

### Font Weights
```
400  → Regular (body text, instructions)
600  → Semi-bold (button labels, headers)
700  → Bold (titles, emphasis)
```

### Line Heights
```
1.2  → Tight (headings)
1.3  → Normal-tight (subheadings)
1.4  → Normal (body, buttons)
1.5  → Relaxed (instructions, helper text)
```

### Letter Spacing
```
-0.02em  → Tight (for large headlines)
0em      → Normal (default)
0.05em   → Wide (game title, buttons)
```

---

## Spacing Scale

### Base Unit: 8px

```
xs   = 4px    (2 pixels short of base unit)
sm   = 8px    (1 base unit)
md   = 16px   (2 base units)
lg   = 24px   (3 base units)
xl   = 32px   (4 base units)
2xl  = 48px   (6 base units)
```

### Common Measurements
```
Header Height:           40px
Canvas Size:             600px × 400px
Controls Height:         50px
Total Container:         600px × 490px

Canvas Border:           2px
Canvas Border-radius:    8px
Button Min-height:       44px (touch target)
Button Padding:          12px 24px
Button Border-radius:    4px
Button Gap:              12px

Score Display:
  Font Size:             16px
  Margin Bottom:         16px
  Horizontal Padding:    16px

Grid Cell Size:          20px × 20px
```

---

## Grid System

### Canvas Grid
```
Total Cells:         30 × 20 (width × height)
Cell Size:           20px × 20px
Total Canvas:        600px × 400px

Origin (0,0):        Top-left corner
Max Position:        (29,19) → Bottom-right

Coordinate Formula:
  pixel_x = cell_x * 20
  pixel_y = cell_y * 20
```

### Example Positions
```
Snake head at (15, 10):
  Pixel position: (300, 200) to (319, 219)
  Center: (310, 210)

Food at (8, 5):
  Pixel position: (160, 100) to (179, 119)
  Center: (170, 110)
```

---

## Animations

### Animation List

| Name | Duration | Easing | Loop | Purpose |
|------|----------|--------|------|---------|
| Food Pulse | 0.5s | ease-in-out | infinite | Food glow effect |
| Snake Death | 0.3s | ease-out | 1x | Collision fade-out |
| UI Fade In | 0.2s | ease-in | 1x | Overlay appear |
| UI Fade Out | 0.2s | ease-out | 1x | Overlay disappear |
| Button Press | 0.1s | ease-out | 1x | Button click feedback |
| Score Pop | 0.4s | ease-out | 1x | Score increase animation |

### Keyframe Details

**Food Pulse:**
```
0%:   opacity 0.7, scale 1.0
50%:  opacity 1.0, scale 1.15
100%: opacity 0.7, scale 1.0
```

**Snake Death:**
```
0%:   opacity 1.0
100%: opacity 0.0
```

**Button Press:**
```
0%:   transform scale(1)
50%:  transform scale(0.95)
100%: transform scale(1)
```

---

## Responsive Breakpoints

### Breakpoint Map
```
Mobile Small:      < 320px
Mobile:            320px - 640px
Tablet:            640px - 1024px
Desktop:           > 1024px
```

### Canvas Scaling
```
Mobile (<640px):
  Width: 100vw - 32px (min 280px)
  Height: Auto (maintains 3:2 ratio)
  Font Scale: 0.9

Tablet (640-1024px):
  Width: 90vw (max 600px)
  Height: Auto (maintains 3:2 ratio)
  Font Scale: 1.0

Desktop (>1024px):
  Width: 600px (fixed)
  Height: 400px (fixed)
  Font Scale: 1.0
```

### Touch Target Sizing
```
Minimum Size:        44px × 44px
Minimum Spacing:     12px between targets
Recommended:         48px × 48px on mobile
Desktop Button Size: 44px minimum height
```

---

## Z-Index Layers

### Z-Index Map (Bottom to Top)
```
0   Background layer
1   Grid lines (optional visual)
2   Food entity
3   Snake body
4   Snake head
10  UI base layer (buttons, score)
15  UI interactive elements
20  Overlay screens
30  Modal dialogs
40  Tooltips
```

### Layering Guide
```
Canvas Rendering:      Layers 0-4 (drawn on canvas)
UI Components:         Layers 10-15 (DOM elements)
Overlays & Modals:     Layers 20-30 (full-screen)
```

---

## Keyboard Navigation

### Game Controls
```
Arrow Up / W      → Move snake up
Arrow Down / S    → Move snake down
Arrow Left / A    → Move snake left
Arrow Right / D   → Move snake right
Space             → Start / Resume / Restart
P                 → Pause / Resume toggle
R                 → Reset game
M                 → Mute / Unmute
Escape            → Pause or return to start
Tab               → Focus next button
Shift+Tab         → Focus previous button
```

### Focus Ring
```
Color:     #FFFFFF (white)
Width:     2px
Offset:    2px
Style:     solid
Applied:   All interactive buttons
```

---

## Accessibility Checklist

### WCAG AA Compliance
- [ ] Color contrast: 4.5:1 for normal text
- [ ] Color contrast: 3:1 for large text (18px+)
- [ ] Focus ring visible on all buttons
- [ ] Keyboard navigation without mouse
- [ ] Screen reader announces all content
- [ ] Reduced motion respected
- [ ] No color used as only indicator

### Required ARIA Attributes
```
aria-label:       Button descriptions
aria-pressed:     Toggle button states
aria-disabled:    Disabled button state
aria-live:        Dynamic score updates
aria-busy:        Animation states
aria-label="Game over": Modal dialogs
```

### Screen Reader Announcements
```
Page Load:        "Snake game loaded. Press Space to start."
Game Start:       "Game started. Use arrow keys or WASD to move."
Food Eaten:       "Food eaten! Score increased to 1250."
Game Paused:      "Game paused. Press Space to resume."
Collision:        "Collision! Game over."
Game Over:        "Game over! Final score 1250."
High Score:       "New high score! 5000 points."
```

---

## Color Contrast Reference

### WCAG AA (Minimum Required)
```
White (#FFFFFF) on Dark (#1A1A2E):       14.5:1 (AAA)
Green (#4CAF50) on Dark (#1A1A2E):       5.8:1  (AA)
Light Gray (#B0B0B0) on Dark:            8.2:1  (AAA)
Red (#F44336) on Dark (#1A1A2E):         5.1:1  (AA)
```

---

## Button Specifications

### Default State
```
Background:     #4CAF50
Color:          #FFFFFF
Padding:        12px 24px
Height:         44px (minimum)
Font Size:      14px
Font Weight:    600
Border:         None
Border-radius:  4px
Cursor:         pointer
Text Shadow:    0 1px 2px rgba(0,0,0,0.2)
```

### Hover State
```
Background:     #66BB6A (lighter green)
Transition:     0.2s ease-out
Cursor:         pointer
```

### Active/Pressed State
```
Background:     #388E3C (darker green)
Transform:      scale(0.95)
Transition:     0.1s ease-out
```

### Disabled State
```
Background:     #757575 (gray)
Color:          #FFFFFF
Cursor:         not-allowed
Opacity:        0.6
```

### Focus State
```
Outline:        2px solid #FFFFFF
Outline-offset: 2px
Visible:        Always visible (never hidden)
```

---

## Component Sizing

### Snake Entity
```
Head:
  Size: 20px × 20px
  Border-radius: 2px
  Color: #4CAF50

Body:
  Size: 20px × 20px
  Border-radius: 2px
  Color: #81C784
  Gap between segments: 1px
```

### Food Entity
```
Main Circle:
  Diameter: 16px (centered in 20px cell)
  Color: #F44336
  Border-radius: 50%
  Box-shadow: 0 0 8px rgba(244,67,54,0.6)

Glow Circle (behind):
  Diameter: 24px
  Color: rgba(244,67,54,0.3)
  z-index: behind food
```

### Canvas
```
Border: 2px solid #333333
Border-radius: 8px
Box-shadow: 0 10px 15px rgba(0,0,0,0.5)
Background: #1A1A2E
Max-width: 600px
Aspect Ratio: 3:2
```

---

## Implementation Checklist

### Visual
- [ ] Use exact hex colors from palette
- [ ] Typography matches size/weight specs
- [ ] Spacing follows 8px unit scale
- [ ] Canvas is 600×400px (or scaled proportionally)
- [ ] Buttons are minimum 44px height
- [ ] Focus rings visible on all buttons
- [ ] Overlays darken canvas properly
- [ ] Animations follow specified durations

### Responsive
- [ ] Mobile (<640px): Canvas scales to fit
- [ ] Tablet (640-1024px): Canvas 90vw max 600px
- [ ] Desktop (>1024px): Canvas fixed 600px
- [ ] Aspect ratio maintained (3:2)
- [ ] No horizontal scroll
- [ ] Touch targets accessible on mobile

### Accessibility
- [ ] Keyboard navigation works without mouse
- [ ] Screen reader announces all text
- [ ] Color contrast meets WCAG AA
- [ ] Focus ring visible on all buttons
- [ ] Reduced motion respected (@media prefers-reduced-motion)
- [ ] All buttons have labels
- [ ] ARIA attributes on dynamic content

---

## Quick Implementation Tips

1. **Start with CSS Variables**
   - Define colors, typography, spacing as variables
   - Makes maintenance and consistency easier
   - Easy to theme or adapt

2. **Use Base Unit (8px)**
   - All spacing should be multiple of 8px
   - Maintains visual harmony
   - Simplifies responsive design

3. **Mobile-First Approach**
   - Build mobile layout first
   - Enhance with media queries for larger screens
   - Simpler cascading CSS

4. **Accessibility is Required**
   - Not optional, must be in initial implementation
   - Screen reader support from day one
   - Keyboard navigation on first pass

5. **Test on Real Devices**
   - Browser dev tools aren't enough
   - Test on actual phones/tablets
   - Verify touch targets are usable

---

## File References

For detailed information:
- **DESIGN_SYSTEM.json** - All design tokens in JSON format
- **COMPONENTS.md** - Detailed component specifications
- **LAYOUT.md** - Layout structure and responsive design
- **README.md** - Complete overview and guides

---

**Quick Reference Version:** 1.0.0
**Last Updated:** 2026-03-24
**Status:** Ready for Implementation

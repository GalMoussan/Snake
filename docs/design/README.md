# Snake Game Design System

**Version:** 1.0.0
**Status:** Complete
**Last Updated:** 2026-03-24

---

## Overview

This directory contains the complete design system and specifications for the Snake Game. These documents provide detailed guidance for implementation, ensuring consistency, accessibility, and visual polish across the entire user interface.

## Document Structure

### 1. DESIGN_SYSTEM.json
**Purpose:** Design tokens and specifications
**Size:** ~11 KB
**Content:**
- Color palette (primary, UI, game, status colors)
- Typography specifications (font families, sizes, weights)
- Spacing scale and margins
- Grid system definition (30×20 cells @ 20px each)
- Animation specifications with keyframes
- Shadows, borders, and rounded corners
- Responsive breakpoints
- Z-index layer definitions
- Accessibility requirements (focus, contrast, keyboard)
- Performance targets (60 FPS)

**Key Sections:**
```json
{
  "colors": {
    "primary": { snake_head, snake_body, food, background },
    "ui": { text_primary, text_secondary, buttons, overlay },
    "game": { grid_lines, wall, food_glow },
    "status": { error, success, warning }
  },
  "typography": { font_family, sizes (title through small) },
  "spacing": { unit scale, canvas padding, button padding },
  "grid": { 30×20 cells @ 20px, 600×400px canvas },
  "animations": { food_pulse, snake_death, ui_fade, button_press, score_pop },
  "accessibility": { focus_ring, contrast_ratios, keyboard_navigation, reduced_motion }
}
```

---

### 2. COMPONENTS.md
**Purpose:** Component specifications and visual design details
**Size:** ~16 KB
**Content:**
- Container components (Game Container, Canvas Wrapper)
- Canvas element specifications
- Score display components (current and high score)
- Game entities (Snake visual, Food visual)
- Screen overlays (Start, Pause, Game Over)
- Control buttons (Pause, Reset, Mute)
- Accessibility notes and keyboard navigation
- Component hierarchy diagram
- Testing requirements checklist

**Component Categories:**

#### Canvas & Game Area
- Canvas Element: 600×400px, 2D context, sharp rendering
- Canvas Wrapper: Responsive container with flex layout
- Grid System: 30×20 cell grid at 20px per cell

#### Visual Elements
- **Snake Head:** #4CAF50 (vibrant green), rounded 2px, direction indicator
- **Snake Body:** #81C784 (lighter green), 1px gaps between segments
- **Food:** #F44336 (red circle), 16px diameter, pulse animation, glow effect

#### Screen Overlays
- **Start Screen:** Title, instructions, "Press SPACE to start"
- **Pause Screen:** "PAUSED" text, "Press SPACE to resume"
- **Game Over Screen:** "GAME OVER", final score, high score indicator, restart prompt

#### Controls
- **Pause Button:** Toggle pause/resume state
- **Reset Button:** Reset game to initial state
- **Mute Button:** Toggle sound on/off
- Button specs: 44px min height, 12px 24px padding, hover/active states

#### Accessibility
- Keyboard navigation (Arrow keys, WASD, Space, P, R, M)
- Screen reader support (ARIA labels, live regions)
- Color contrast (WCAG AA minimum)
- Focus management and visible focus rings
- Reduced motion support

---

### 3. LAYOUT.md
**Purpose:** Layout structure and responsive design specifications
**Size:** ~20 KB
**Content:**
- Screen structure diagrams (ASCII art layouts)
- Dimensions and sizing specifications
- Responsive design breakpoints and adaptations
- Grid system and coordinate mapping
- Z-index layer documentation
- Safe areas and touch targets
- Spacing reference guide
- Implementation checklists
- Mobile considerations and constraints

**Key Specifications:**

#### Screen Structure
```
Header (40px)     → Score: X | High: Y
Canvas (600×400)  → Game area with snake, food, grid
Controls (50px)   → [Pause] [Reset] [Mute] buttons
Total: 600×490px
```

#### Responsive Breakpoints
| Breakpoint | Width | Canvas | Adaptation |
|-----------|-------|--------|------------|
| Mobile | <640px | 100vw - 32px (min 280px) | Scale down, vertical buttons |
| Tablet | 640-1024px | 90vw (max 600px) | Normal sizing |
| Desktop | >1024px | 600px (fixed) | Full-size layout |

#### Z-Index Layers
- 0: Background
- 1: Grid lines
- 2: Food
- 3: Snake body
- 4: Snake head
- 10-15: UI elements
- 20: Overlays
- 30: Modals

#### Touch Targets
- Minimum size: 44×44px (mobile)
- Minimum spacing: 12px between targets
- No overlap between interactive elements

---

## Implementation Guide

### For Frontend Developers

1. **Start with DESIGN_SYSTEM.json**
   - Extract color values for CSS variables
   - Define typography in font declarations
   - Use spacing scale for consistent padding/margins
   - Implement animation keyframes

2. **Reference COMPONENTS.md for each UI element**
   - Copy visual specifications exactly
   - Implement accessibility features (ARIA, keyboard)
   - Add hover/active/disabled states
   - Test with screen readers

3. **Use LAYOUT.md for page structure**
   - Implement responsive breakpoints
   - Set up grid layout for canvas
   - Ensure minimum touch target sizes
   - Test on multiple screen sizes

### For Quality Assurance

**Visual Checklist:**
- [ ] Colors match DESIGN_SYSTEM.json exactly
- [ ] Typography matches size/weight specifications
- [ ] Spacing follows 8px unit scale
- [ ] Canvas is 600×400px (or scaled proportionally)
- [ ] Buttons are minimum 44px height
- [ ] Focus rings are visible on all buttons
- [ ] Overlays darken canvas properly
- [ ] Animations respect reduced motion preference

**Responsive Checklist:**
- [ ] Works on 320px width (mobile)
- [ ] Works on 640px width (tablet)
- [ ] Works on 1024px+ width (desktop)
- [ ] Canvas maintains 3:2 aspect ratio
- [ ] No horizontal scroll
- [ ] Touch targets remain accessible

**Accessibility Checklist:**
- [ ] Keyboard navigation works without mouse
- [ ] Screen reader announces all text
- [ ] Color contrast meets WCAG AA (4.5:1)
- [ ] Focus ring is visible
- [ ] Reduced motion is respected
- [ ] All buttons have labels

---

## Color Palette Quick Reference

```
Primary Game Colors:
  Snake Head: #4CAF50 (RGB: 76, 175, 80)
  Snake Body: #81C784 (RGB: 129, 199, 132)
  Food: #F44336 (RGB: 244, 67, 54)
  Background: #1A1A2E (RGB: 26, 26, 46)

UI Colors:
  Text Primary: #FFFFFF
  Text Secondary: #B0B0B0
  Button Primary: #4CAF50
  Button Hover: #66BB6A
  Button Active: #388E3C
  Button Disabled: #757575
  Border: #333333
```

---

## Typography Quick Reference

```
Font Family: 'Press Start 2P' (retro), fallback: system-ui
Weights: 400 (regular), 600 (semi-bold), 700 (bold)

Sizes:
  Title: 24px, 700 weight (Game "SNAKE" title)
  Heading: 20px, 700 weight (Game Over, Paused)
  Subheading: 16px, 600 weight (Score display)
  Body: 12px, 400 weight (Instructions)
  Button: 14px, 600 weight (Button labels)
  Small: 10px, 400 weight (Helper text)
```

---

## Spacing Quick Reference

```
Base Unit: 8px

Scale:
  xs: 4px
  sm: 8px (header/canvas margin)
  md: 16px (standard margin/padding)
  lg: 24px
  xl: 32px
  2xl: 48px (overlay padding)

Common Measurements:
  Header Height: 40px
  Canvas: 600×400px
  Controls Height: 50px
  Button Padding: 12px 24px
  Button Gap: 12px
  Canvas Border: 2px
  Canvas Border Radius: 8px
  Grid Cell Size: 20px
```

---

## Animation Reference

```
Food Pulse: 0.5s ease-in-out, infinite (opacity 0.7 → 1 → 0.7)
Snake Death: 0.3s ease-out (opacity 1 → 0)
UI Fade In: 0.2s ease-in (opacity 0 → 1)
UI Fade Out: 0.2s ease-out (opacity 1 → 0)
Button Press: 0.1s ease-out (scale 1 → 0.95 → 1)
Score Pop: 0.4s ease-out (scale 1 → 1.2, opacity 1 → 0)

Reduced Motion: All animations removed/disabled
```

---

## Game Grid Specifications

```
Dimensions: 30 columns × 20 rows
Cell Size: 20px × 20px
Total Canvas: 600px × 400px
Aspect Ratio: 3:2

Coordinate System:
  (0,0) = top-left
  (29,19) = bottom-right
  x_pixel = x_cell * 20
  y_pixel = y_cell * 20
```

---

## Keyboard Navigation

### Game Controls
- **Arrow Up / W:** Move snake up
- **Arrow Down / S:** Move snake down
- **Arrow Left / A:** Move snake left
- **Arrow Right / D:** Move snake right
- **Space:** Start/Resume/Restart game
- **P:** Pause/Resume toggle
- **R:** Reset game
- **M:** Mute/Unmute sound
- **Tab:** Navigate between buttons
- **Escape:** Pause or return to start

### Focus Management
- Tab order: Pause → Reset → Mute buttons
- Focus ring: 2px white outline with 2px offset
- Focus trap on overlay screens (start, pause, game over)

---

## Accessibility Standards

**WCAG Compliance:** AA (minimum)
- Color contrast: 4.5:1 for normal text, 3:1 for large text
- Focus indicators: Always visible
- Keyboard navigation: All features accessible without mouse
- Screen reader: All content announced
- Reduced motion: Animations disabled on preference

---

## File Dependencies

```
DESIGN_SYSTEM.json
├── Used by: COMPONENTS.md (references colors, typography, animations)
├── Used by: LAYOUT.md (references spacing, breakpoints, z-index)
└── Used by: Implementation (CSS variables, theme configuration)

COMPONENTS.md
├── Depends on: DESIGN_SYSTEM.json (color values, typography)
├── Used by: Developers (component specifications)
└── Used by: QA (visual testing checklist)

LAYOUT.md
├── Depends on: DESIGN_SYSTEM.json (spacing, breakpoints)
├── Used by: Developers (layout structure, responsive)
└── Used by: QA (responsive testing checklist)
```

---

## Next Steps

1. **Implementation Phase (TASK-018: Visual Polish)**
   - Convert design specs to CSS
   - Implement all component styles
   - Add animations and transitions
   - Ensure accessibility compliance

2. **Testing Phase**
   - Visual regression testing
   - Responsive testing on all breakpoints
   - Accessibility testing (keyboard, screen reader)
   - Cross-browser testing (Chrome, Firefox, Safari, Edge)

3. **Refinement**
   - Address any visual discrepancies
   - Optimize animation performance
   - Fine-tune responsive scaling
   - Document any deviations from spec

---

## Revision History

| Version | Date | Changes |
|---------|------|---------|
| 1.0.0 | 2026-03-24 | Initial design system complete with full specifications |

---

## Contact & Questions

For questions about design specifications or implementation details:
- Review the specific document (DESIGN_SYSTEM.json, COMPONENTS.md, or LAYOUT.md)
- Check accessibility requirements in COMPONENTS.md
- Verify responsive requirements in LAYOUT.md
- Refer to the implementation checklists for completeness

---

**Created by:** Frontend Designer Agent
**Status:** Ready for Implementation
**Next Phase:** TASK-018 (Visual Polish and Styling)

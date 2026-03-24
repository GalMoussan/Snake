# Snake Game

A classic Snake game built with TypeScript, HTML5 Canvas, and modern web technologies. Features clean architecture, comprehensive testing, and smooth gameplay.

## Features

- Classic snake gameplay with smooth controls
- Responsive design that works on desktop and mobile
- High score persistence using localStorage
- Visual polish with gradients, shadows, and animations
- Pause/resume functionality
- Keyboard and button controls
- Progressive difficulty (speed increases as you eat)
- Comprehensive test coverage (unit, integration, and E2E tests)

## How to Play

### Controls

- **Arrow Keys** or **WASD** - Move the snake
- **Space** or **Escape** - Pause/Resume the game
- **Start Button** - Start a new game
- **Pause Button** - Pause/Resume the game

### Objective

- Guide the snake to eat the red food
- Each food item increases your score by 10 points
- The snake grows longer with each food eaten
- The game speeds up as you progress
- Avoid hitting the walls or your own tail
- Try to beat your high score!

## Development Setup

### Prerequisites

- Node.js 18 or higher
- npm or yarn

### Installation

```bash
# Clone the repository
git clone <repository-url>
cd snake

# Install dependencies
npm install
```

### Running Locally

```bash
# Start development server
npm run dev

# Open http://localhost:5173 in your browser
```

### Building for Production

```bash
# Build the project
npm run build

# Preview production build
npm run preview
```

## Testing

### Unit and Integration Tests

```bash
# Run all tests
npm test

# Run tests in watch mode
npm run test:watch

# Run tests with coverage
npm run test:coverage

# Run tests with UI
npm run test:ui
```

### End-to-End Tests

```bash
# Run E2E tests (requires dev server running)
npm run test:e2e

# Run E2E tests with UI
npm run test:e2e:ui
```

### Linting & Formatting

```bash
# Run linter
npm run lint

# Fix linting issues
npm run lint:fix

# Format code
npm run format

# Check formatting
npm run format:check
```

## Architecture Overview

The project follows a modular, entity-component-system (ECS) inspired architecture:

### Core Systems

- **Game** - Main game controller that orchestrates all systems
- **GameLoop** - Fixed timestep game loop with decoupled rendering
- **GameState** - Finite state machine for game states (MENU, PLAYING, PAUSED, GAME_OVER)
- **Grid** - Manages the game grid and coordinate transformations

### Entities

- **Snake** - Snake entity with movement, growth, and collision detection
- **Food** - Food entity with random spawning

### Systems

- **InputSystem** - Handles keyboard input
- **CollisionSystem** - Detects collisions (wall, self, food)
- **RenderSystem** - Renders game graphics to canvas
- **ScoreSystem** - Manages score and high score persistence

### Utilities

- **Vector2D** - Immutable 2D vector for positions
- **Storage** - localStorage wrapper for data persistence
- **Constants** - Game configuration constants

### UI

- **Controls** - Button controls for start/pause

## Project Structure

```
snake/
├── src/
│   ├── core/           # Core game systems
│   │   ├── Game.ts
│   │   ├── GameLoop.ts
│   │   ├── GameState.ts
│   │   ├── Grid.ts
│   │   └── __tests__/
│   ├── entities/       # Game entities
│   │   ├── Snake.ts
│   │   ├── Food.ts
│   │   └── __tests__/
│   ├── systems/        # Game systems
│   │   ├── InputSystem.ts
│   │   ├── CollisionSystem.ts
│   │   ├── RenderSystem.ts
│   │   ├── ScoreSystem.ts
│   │   └── __tests__/
│   ├── ui/            # UI components
│   │   └── Controls.ts
│   ├── utils/         # Utility functions
│   │   ├── Vector2D.ts
│   │   ├── Storage.ts
│   │   ├── Constants.ts
│   │   └── __tests__/
│   ├── types/         # TypeScript types
│   │   └── index.ts
│   ├── main.ts        # Application entry point
│   └── style.css      # Styles
├── tests/
│   └── e2e/           # E2E tests
│       └── game.spec.ts
├── index.html
├── package.json
├── tsconfig.json
├── vite.config.ts
└── playwright.config.ts
```

## Tech Stack

- **TypeScript** - Type-safe JavaScript
- **Vite** - Fast build tool and dev server
- **HTML5 Canvas** - Graphics rendering
- **Vitest** - Unit and integration testing
- **Playwright** - End-to-end testing
- **ESLint** - Code linting
- **Prettier** - Code formatting

## Code Quality

- **Test Coverage**: 80%+ (unit, integration, and E2E tests)
- **TypeScript**: Strict mode enabled
- **Immutability**: All data structures are immutable
- **No Side Effects**: Pure functions where possible
- **Clean Architecture**: Separation of concerns with ECS pattern

## Development Principles

- **Test-Driven Development (TDD)** - Tests written before implementation
- **Immutable Data Structures** - No mutation of state
- **Small, Focused Modules** - Each file has a single responsibility
- **Comprehensive Error Handling** - All error cases handled
- **Type Safety** - Full TypeScript coverage

## Completed Sprints

### Sprint 1: Foundation & Setup
- Project setup and configuration
- Canvas setup
- Type definitions
- Vector2D utility
- Constants module
- Grid system
- Game loop

### Sprint 2: Core Entities & Systems
- Snake entity with movement and collision
- Food entity with spawning
- Input system (keyboard controls)
- Collision system (wall, self, food)
- Render system (canvas drawing)
- Score system with localStorage
- Game state management

### Sprint 3: Integration & Polish
- Main game controller
- UI controls (buttons)
- Visual polish (gradients, animations, shadows)
- E2E tests with Playwright
- Comprehensive integration tests
- Updated documentation

## Screenshots

_Screenshots will be added here_

## License

MIT

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## Acknowledgments

Built as a demonstration of modern TypeScript game development practices.

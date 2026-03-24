export const COLORS = {
  SNAKE_HEAD: '#4CAF50',
  SNAKE_BODY: '#81C784',
  FOOD: '#F44336',
  BACKGROUND: '#1A1A2E',
  GRID_LINES: 'rgba(255, 255, 255, 0.05)',
  TEXT: '#FFFFFF',
} as const;

export const GRID = {
  WIDTH: 30,
  HEIGHT: 20,
  CELL_SIZE: 20,
} as const;

export const GAME = {
  INITIAL_SPEED: 150, // ms per tick
  SPEED_INCREASE: 5,
  POINTS_PER_FOOD: 10,
} as const;

export const STORAGE_KEYS = {
  HIGH_SCORE: 'snake_high_score',
} as const;

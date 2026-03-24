export interface Vector2D {
  readonly x: number;
  readonly y: number;
}

export enum Direction {
  UP = 'UP',
  DOWN = 'DOWN',
  LEFT = 'LEFT',
  RIGHT = 'RIGHT',
}

export enum GameStateType {
  MENU = 'MENU',
  PLAYING = 'PLAYING',
  PAUSED = 'PAUSED',
  GAME_OVER = 'GAME_OVER',
}

export interface GameConfig {
  readonly gridWidth: number;
  readonly gridHeight: number;
  readonly cellSize: number;
  readonly initialSpeed: number;
}

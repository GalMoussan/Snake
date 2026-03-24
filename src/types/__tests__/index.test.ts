import { describe, it, expect } from 'vitest';
import type { Vector2D, GameConfig } from '../index';
import { Direction, GameStateType } from '../index';

describe('Types and Enums', () => {
  describe('Vector2D interface', () => {
    it('should define Vector2D with x and y properties', () => {
      const vector: Vector2D = { x: 10, y: 20 };
      expect(vector.x).toBe(10);
      expect(vector.y).toBe(20);
    });

    it('should support negative coordinates', () => {
      const vector: Vector2D = { x: -5, y: -10 };
      expect(vector.x).toBe(-5);
      expect(vector.y).toBe(-10);
    });

    it('should support zero coordinates', () => {
      const vector: Vector2D = { x: 0, y: 0 };
      expect(vector.x).toBe(0);
      expect(vector.y).toBe(0);
    });

    it('should support decimal coordinates', () => {
      const vector: Vector2D = { x: 1.5, y: 2.7 };
      expect(vector.x).toBe(1.5);
      expect(vector.y).toBe(2.7);
    });
  });

  describe('Direction enum', () => {
    it('should have UP direction', () => {
      expect(Direction.UP).toBe('UP');
    });

    it('should have DOWN direction', () => {
      expect(Direction.DOWN).toBe('DOWN');
    });

    it('should have LEFT direction', () => {
      expect(Direction.LEFT).toBe('LEFT');
    });

    it('should have RIGHT direction', () => {
      expect(Direction.RIGHT).toBe('RIGHT');
    });

    it('should have exactly 4 directions', () => {
      const directions = Object.values(Direction);
      expect(directions.length).toBe(4);
    });

    it('should have unique direction values', () => {
      const directions = Object.values(Direction);
      const uniqueDirections = new Set(directions);
      expect(uniqueDirections.size).toBe(4);
    });

    it('should support all direction values', () => {
      const allDirections: Direction[] = [
        Direction.UP,
        Direction.DOWN,
        Direction.LEFT,
        Direction.RIGHT,
      ];
      expect(allDirections).toHaveLength(4);
    });
  });

  describe('GameStateType enum', () => {
    it('should have MENU state', () => {
      expect(GameStateType.MENU).toBe('MENU');
    });

    it('should have PLAYING state', () => {
      expect(GameStateType.PLAYING).toBe('PLAYING');
    });

    it('should have PAUSED state', () => {
      expect(GameStateType.PAUSED).toBe('PAUSED');
    });

    it('should have GAME_OVER state', () => {
      expect(GameStateType.GAME_OVER).toBe('GAME_OVER');
    });

    it('should have exactly 4 states', () => {
      const states = Object.values(GameStateType);
      expect(states.length).toBe(4);
    });

    it('should have unique state values', () => {
      const states = Object.values(GameStateType);
      const uniqueStates = new Set(states);
      expect(uniqueStates.size).toBe(4);
    });

    it('should support all state values', () => {
      const allStates: GameStateType[] = [
        GameStateType.MENU,
        GameStateType.PLAYING,
        GameStateType.PAUSED,
        GameStateType.GAME_OVER,
      ];
      expect(allStates).toHaveLength(4);
    });
  });

  describe('GameConfig interface', () => {
    it('should define GameConfig with required properties', () => {
      const config: GameConfig = {
        gridWidth: 20,
        gridHeight: 20,
        cellSize: 20,
        initialSpeed: 100,
      };
      expect(config.gridWidth).toBe(20);
      expect(config.gridHeight).toBe(20);
      expect(config.cellSize).toBe(20);
      expect(config.initialSpeed).toBe(100);
    });

    it('should support various grid dimensions', () => {
      const smallGrid: GameConfig = {
        gridWidth: 10,
        gridHeight: 10,
        cellSize: 20,
        initialSpeed: 100,
      };
      const largeGrid: GameConfig = {
        gridWidth: 100,
        gridHeight: 100,
        cellSize: 10,
        initialSpeed: 50,
      };

      expect(smallGrid.gridWidth).toBe(10);
      expect(largeGrid.gridWidth).toBe(100);
    });

    it('should support various cell sizes', () => {
      const smallCell: GameConfig = {
        gridWidth: 20,
        gridHeight: 20,
        cellSize: 5,
        initialSpeed: 100,
      };
      const largeCell: GameConfig = {
        gridWidth: 20,
        gridHeight: 20,
        cellSize: 50,
        initialSpeed: 100,
      };

      expect(smallCell.cellSize).toBe(5);
      expect(largeCell.cellSize).toBe(50);
    });

    it('should support various initial speeds', () => {
      const slowGame: GameConfig = {
        gridWidth: 20,
        gridHeight: 20,
        cellSize: 20,
        initialSpeed: 50,
      };
      const fastGame: GameConfig = {
        gridWidth: 20,
        gridHeight: 20,
        cellSize: 20,
        initialSpeed: 300,
      };

      expect(slowGame.initialSpeed).toBe(50);
      expect(fastGame.initialSpeed).toBe(300);
    });

    it('should enforce readonly properties', () => {
      const config: GameConfig = {
        gridWidth: 20,
        gridHeight: 20,
        cellSize: 20,
        initialSpeed: 100,
      };

      // TypeScript would prevent this at compile time, but we can verify the values don't change
      expect(config.gridWidth).toBe(20);
      // Attempting to mutate would be a TypeScript error
    });
  });

  describe('Type definitions together', () => {
    it('should support complete game configuration with vector', () => {
      const config: GameConfig = {
        gridWidth: 20,
        gridHeight: 20,
        cellSize: 20,
        initialSpeed: 100,
      };

      const position: Vector2D = { x: 10, y: 10 };
      const direction: Direction = Direction.UP;
      const state: GameStateType = GameStateType.PLAYING;

      expect(config.gridWidth).toBe(20);
      expect(position.x).toBe(10);
      expect(direction).toBe('UP');
      expect(state).toBe('PLAYING');
    });

    it('should handle direction transitions', () => {
      const directions = [Direction.UP, Direction.RIGHT, Direction.DOWN, Direction.LEFT];
      expect(directions).toHaveLength(4);
      expect(directions[0]).toBe('UP');
      expect(directions[1]).toBe('RIGHT');
      expect(directions[2]).toBe('DOWN');
      expect(directions[3]).toBe('LEFT');
    });

    it('should handle game state transitions', () => {
      const states = [
        GameStateType.MENU,
        GameStateType.PLAYING,
        GameStateType.PAUSED,
        GameStateType.GAME_OVER,
      ];
      expect(states).toHaveLength(4);
      expect(states[0]).toBe('MENU');
      expect(states[3]).toBe('GAME_OVER');
    });
  });
});

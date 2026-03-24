import { describe, it, expect, beforeEach, vi } from 'vitest';
import { Food } from '../Food';
import { Grid } from '../../core/Grid';
import { Vec2 } from '../../utils/Vector2D';

describe('Food', () => {
  let grid: Grid;

  beforeEach(() => {
    grid = new Grid(30, 20, 20);
  });

  describe('constructor', () => {
    it('should create food at random position', () => {
      const food = new Food(grid);

      expect(grid.isWithinBounds(food.getPosition())).toBe(true);
    });

    it('should exclude specified positions', () => {
      const excludePositions = [new Vec2(5, 5), new Vec2(10, 10)];
      const food = new Food(grid, excludePositions);
      const position = food.getPosition();

      const isExcluded = excludePositions.some((pos) => pos.equals(position));
      expect(isExcluded).toBe(false);
    });

    it('should work with empty exclude array', () => {
      const food = new Food(grid, []);

      expect(grid.isWithinBounds(food.getPosition())).toBe(true);
    });

    it('should create different positions for multiple instances', () => {
      const positions = new Set<string>();

      for (let i = 0; i < 50; i++) {
        const food = new Food(grid);
        const pos = food.getPosition();
        positions.add(`${pos.x},${pos.y}`);
      }

      // Should get multiple unique positions
      expect(positions.size).toBeGreaterThan(10);
    });

    it('should avoid large exclude list', () => {
      const exclude: Vec2[] = [];
      // Exclude many positions
      for (let y = 0; y < 10; y++) {
        for (let x = 0; x < 20; x++) {
          exclude.push(new Vec2(x, y));
        }
      }

      const food = new Food(grid, exclude);
      const position = food.getPosition();

      const isExcluded = exclude.some((pos) => pos.equals(position));
      expect(isExcluded).toBe(false);
      expect(grid.isWithinBounds(position)).toBe(true);
    });
  });

  describe('spawn', () => {
    it('should spawn food at new position', () => {
      const food = new Food(grid);
      const oldPosition = food.getPosition();

      // Exclude old position to guarantee change
      food.spawn(grid, [oldPosition]);
      const newPosition = food.getPosition();

      expect(newPosition.equals(oldPosition)).toBe(false);
    });

    it('should exclude specified positions when spawning', () => {
      const food = new Food(grid);
      const excludePositions = [new Vec2(5, 5), new Vec2(10, 10), new Vec2(15, 15)];

      food.spawn(grid, excludePositions);
      const position = food.getPosition();

      const isExcluded = excludePositions.some((pos) => pos.equals(position));
      expect(isExcluded).toBe(false);
    });

    it('should work with empty exclude array', () => {
      const food = new Food(grid);
      food.spawn(grid, []);

      expect(grid.isWithinBounds(food.getPosition())).toBe(true);
    });

    it('should place food within grid bounds', () => {
      const food = new Food(grid);

      for (let i = 0; i < 10; i++) {
        food.spawn(grid, []);
        expect(grid.isWithinBounds(food.getPosition())).toBe(true);
      }
    });

    it('should avoid snake body positions', () => {
      const food = new Food(grid);
      const snakeBody = [
        new Vec2(10, 10),
        new Vec2(11, 10),
        new Vec2(12, 10),
        new Vec2(13, 10),
      ];

      food.spawn(grid, snakeBody);
      const position = food.getPosition();

      const isOnSnake = snakeBody.some((seg) => seg.equals(position));
      expect(isOnSnake).toBe(false);
    });

    it('should update position on multiple spawns', () => {
      const food = new Food(grid);
      const positions: Vec2[] = [];

      for (let i = 0; i < 5; i++) {
        food.spawn(grid, positions);
        positions.push(food.getPosition());
      }

      // All positions should be unique
      const uniqueCount = positions.reduce((count, pos, index) => {
        const isDuplicate = positions.slice(0, index).some((p) => p.equals(pos));
        return isDuplicate ? count : count + 1;
      }, 0);

      expect(uniqueCount).toBe(5);
    });
  });

  describe('getPosition', () => {
    it('should return current food position', () => {
      const food = new Food(grid);
      const position = food.getPosition();

      expect(position).toBeInstanceOf(Vec2);
      expect(grid.isWithinBounds(position)).toBe(true);
    });

    it('should return same position until spawn is called', () => {
      const food = new Food(grid);
      const position1 = food.getPosition();
      const position2 = food.getPosition();

      expect(position1.equals(position2)).toBe(true);
    });

    it('should return updated position after spawn', () => {
      const food = new Food(grid);
      const position1 = food.getPosition();

      food.spawn(grid, [position1]);
      const position2 = food.getPosition();

      expect(position2.equals(position1)).toBe(false);
    });

    it('should not mutate returned position', () => {
      const food = new Food(grid);
      const position = food.getPosition();
      const originalX = position.x;
      const originalY = position.y;

      food.spawn(grid, []);

      expect(position.x).toBe(originalX);
      expect(position.y).toBe(originalY);
    });
  });

  describe('integration scenarios', () => {
    it('should work in typical game scenario', () => {
      const food = new Food(grid);

      // Snake eats food
      const snakeBody = [food.getPosition(), new Vec2(5, 5)];

      // Spawn new food avoiding snake
      food.spawn(grid, snakeBody);

      const newPosition = food.getPosition();
      const isOnSnake = snakeBody.some((seg) => seg.equals(newPosition));

      expect(isOnSnake).toBe(false);
      expect(grid.isWithinBounds(newPosition)).toBe(true);
    });

    it('should handle growing snake', () => {
      const food = new Food(grid);
      const snakeBody: Vec2[] = [new Vec2(10, 10)];

      for (let i = 0; i < 10; i++) {
        food.spawn(grid, snakeBody);
        const position = food.getPosition();

        // Food should not be on snake
        const isOnSnake = snakeBody.some((seg) => seg.equals(position));
        expect(isOnSnake).toBe(false);

        // Simulate snake eating and growing
        snakeBody.push(position);
      }

      expect(snakeBody.length).toBe(11);
    });

    it('should work with small grid and large snake', () => {
      const smallGrid = new Grid(5, 5, 20);
      const food = new Food(smallGrid);

      // Create a snake that fills most of the grid
      const snakeBody: Vec2[] = [];
      for (let y = 0; y < 4; y++) {
        for (let x = 0; x < 5; x++) {
          snakeBody.push(new Vec2(x, y));
        }
      }

      food.spawn(smallGrid, snakeBody);
      const position = food.getPosition();

      const isOnSnake = snakeBody.some((seg) => seg.equals(position));
      expect(isOnSnake).toBe(false);
      expect(smallGrid.isWithinBounds(position)).toBe(true);
    });
  });
});

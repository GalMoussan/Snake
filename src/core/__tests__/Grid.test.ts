import { describe, it, expect } from 'vitest';
import { Grid } from '../Grid';
import { Vec2 } from '../../utils/Vector2D';

describe('Grid', () => {
  describe('constructor', () => {
    it('should create a grid with specified dimensions', () => {
      const grid = new Grid(30, 20, 20);
      expect(grid.width).toBe(30);
      expect(grid.height).toBe(20);
      expect(grid.cellSize).toBe(20);
    });

    it('should have readonly properties', () => {
      const grid = new Grid(30, 20, 20);
      // TypeScript enforces readonly at compile time
      // Attempting to modify would cause a TypeScript error
      expect(grid.width).toBe(30);
      expect(grid.height).toBe(20);
      expect(grid.cellSize).toBe(20);
    });
  });

  describe('isWithinBounds', () => {
    const grid = new Grid(30, 20, 20);

    it('should return true for position at origin', () => {
      expect(grid.isWithinBounds(new Vec2(0, 0))).toBe(true);
    });

    it('should return true for position in middle', () => {
      expect(grid.isWithinBounds(new Vec2(15, 10))).toBe(true);
    });

    it('should return true for position at top-left corner', () => {
      expect(grid.isWithinBounds(new Vec2(0, 0))).toBe(true);
    });

    it('should return true for position at bottom-right corner', () => {
      expect(grid.isWithinBounds(new Vec2(29, 19))).toBe(true);
    });

    it('should return false for negative x', () => {
      expect(grid.isWithinBounds(new Vec2(-1, 10))).toBe(false);
    });

    it('should return false for negative y', () => {
      expect(grid.isWithinBounds(new Vec2(15, -1))).toBe(false);
    });

    it('should return false for x >= width', () => {
      expect(grid.isWithinBounds(new Vec2(30, 10))).toBe(false);
    });

    it('should return false for y >= height', () => {
      expect(grid.isWithinBounds(new Vec2(15, 20))).toBe(false);
    });

    it('should return false for both coordinates out of bounds', () => {
      expect(grid.isWithinBounds(new Vec2(-5, -5))).toBe(false);
      expect(grid.isWithinBounds(new Vec2(35, 25))).toBe(false);
    });
  });

  describe('getRandomPosition', () => {
    const grid = new Grid(30, 20, 20);

    it('should return a position within bounds', () => {
      const pos = grid.getRandomPosition();
      expect(grid.isWithinBounds(pos)).toBe(true);
    });

    it('should return different positions on multiple calls', () => {
      const positions = new Set<string>();
      for (let i = 0; i < 100; i++) {
        const pos = grid.getRandomPosition();
        positions.add(`${pos.x},${pos.y}`);
      }
      // With 100 random positions in a 30x20 grid, we should get multiple unique positions
      expect(positions.size).toBeGreaterThan(10);
    });

    it('should exclude specified positions', () => {
      const exclude = [new Vec2(5, 5), new Vec2(10, 10), new Vec2(15, 15)];
      for (let i = 0; i < 50; i++) {
        const pos = grid.getRandomPosition(exclude);
        const isExcluded = exclude.some((e) => e.equals(pos));
        expect(isExcluded).toBe(false);
      }
    });

    it('should handle empty exclude array', () => {
      const pos = grid.getRandomPosition([]);
      expect(grid.isWithinBounds(pos)).toBe(true);
    });

    it('should work with no exclude parameter', () => {
      const pos = grid.getRandomPosition();
      expect(grid.isWithinBounds(pos)).toBe(true);
    });

    it('should handle large exclude list', () => {
      const exclude: Vec2[] = [];
      // Exclude first 100 positions
      for (let y = 0; y < 5; y++) {
        for (let x = 0; x < 20; x++) {
          exclude.push(new Vec2(x, y));
        }
      }
      const pos = grid.getRandomPosition(exclude);
      const isExcluded = exclude.some((e) => e.equals(pos));
      expect(isExcluded).toBe(false);
      expect(grid.isWithinBounds(pos)).toBe(true);
    });
  });

  describe('toPixel', () => {
    const grid = new Grid(30, 20, 20);

    it('should convert grid position (0,0) to pixel (0,0)', () => {
      const pixel = grid.toPixel(new Vec2(0, 0));
      expect(pixel.x).toBe(0);
      expect(pixel.y).toBe(0);
    });

    it('should convert grid position to pixel coordinates', () => {
      const pixel = grid.toPixel(new Vec2(5, 10));
      expect(pixel.x).toBe(100);
      expect(pixel.y).toBe(200);
    });

    it('should handle position at maximum bounds', () => {
      const pixel = grid.toPixel(new Vec2(29, 19));
      expect(pixel.x).toBe(580);
      expect(pixel.y).toBe(380);
    });

    it('should scale correctly with different cell sizes', () => {
      const smallGrid = new Grid(30, 20, 10);
      const pixel = smallGrid.toPixel(new Vec2(5, 10));
      expect(pixel.x).toBe(50);
      expect(pixel.y).toBe(100);
    });

    it('should work with position (1,1)', () => {
      const pixel = grid.toPixel(new Vec2(1, 1));
      expect(pixel.x).toBe(20);
      expect(pixel.y).toBe(20);
    });
  });

  describe('integration tests', () => {
    it('should work with realistic game scenarios', () => {
      const grid = new Grid(30, 20, 20);

      // Get a random position
      const foodPos = grid.getRandomPosition();
      expect(grid.isWithinBounds(foodPos)).toBe(true);

      // Convert to pixels for rendering
      const foodPixel = grid.toPixel(foodPos);
      expect(foodPixel.x).toBeGreaterThanOrEqual(0);
      expect(foodPixel.y).toBeGreaterThanOrEqual(0);
      expect(foodPixel.x).toBeLessThan(grid.width * grid.cellSize);
      expect(foodPixel.y).toBeLessThan(grid.height * grid.cellSize);
    });

    it('should handle snake body exclusion', () => {
      const grid = new Grid(30, 20, 20);
      const snakeBody = [
        new Vec2(10, 10),
        new Vec2(11, 10),
        new Vec2(12, 10),
        new Vec2(13, 10),
      ];

      const foodPos = grid.getRandomPosition(snakeBody);
      const isOnSnake = snakeBody.some((seg) => seg.equals(foodPos));
      expect(isOnSnake).toBe(false);
    });
  });
});

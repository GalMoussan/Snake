import { describe, it, expect, beforeEach } from 'vitest';
import { CollisionSystem } from '../CollisionSystem';
import { Grid } from '../../core/Grid';
import { Snake } from '../../entities/Snake';
import { Food } from '../../entities/Food';
import { Vec2 } from '../../utils/Vector2D';
import { Direction } from '../../types';

describe('CollisionSystem', () => {
  let grid: Grid;
  let collisionSystem: CollisionSystem;

  beforeEach(() => {
    grid = new Grid(30, 20, 20);
    collisionSystem = new CollisionSystem(grid);
  });

  describe('constructor', () => {
    it('should create collision system with grid', () => {
      expect(collisionSystem).toBeInstanceOf(CollisionSystem);
    });

    it('should accept grid parameter', () => {
      const customGrid = new Grid(40, 30, 15);
      const system = new CollisionSystem(customGrid);

      expect(system).toBeInstanceOf(CollisionSystem);
    });
  });

  describe('checkWallCollision', () => {
    it('should return false for position in center', () => {
      const position = new Vec2(15, 10);

      expect(collisionSystem.checkWallCollision(position)).toBe(false);
    });

    it('should return false for position at origin', () => {
      const position = new Vec2(0, 0);

      expect(collisionSystem.checkWallCollision(position)).toBe(false);
    });

    it('should return false for position at bottom-right corner', () => {
      const position = new Vec2(29, 19);

      expect(collisionSystem.checkWallCollision(position)).toBe(false);
    });

    it('should return true for position with negative x', () => {
      const position = new Vec2(-1, 10);

      expect(collisionSystem.checkWallCollision(position)).toBe(true);
    });

    it('should return true for position with negative y', () => {
      const position = new Vec2(15, -1);

      expect(collisionSystem.checkWallCollision(position)).toBe(true);
    });

    it('should return true for position with x >= grid width', () => {
      const position = new Vec2(30, 10);

      expect(collisionSystem.checkWallCollision(position)).toBe(true);
    });

    it('should return true for position with y >= grid height', () => {
      const position = new Vec2(15, 20);

      expect(collisionSystem.checkWallCollision(position)).toBe(true);
    });

    it('should return true for position beyond right wall', () => {
      const position = new Vec2(35, 10);

      expect(collisionSystem.checkWallCollision(position)).toBe(true);
    });

    it('should return true for position beyond bottom wall', () => {
      const position = new Vec2(15, 25);

      expect(collisionSystem.checkWallCollision(position)).toBe(true);
    });

    it('should return true for position beyond all walls', () => {
      const position = new Vec2(-5, -5);

      expect(collisionSystem.checkWallCollision(position)).toBe(true);
    });
  });

  describe('checkSelfCollision', () => {
    it('should return false for initial snake', () => {
      const snake = new Snake(new Vec2(10, 10), Direction.RIGHT);

      expect(collisionSystem.checkSelfCollision(snake)).toBe(false);
    });

    it('should return false for short snake', () => {
      const snake = new Snake(new Vec2(10, 10), Direction.RIGHT);
      snake.grow();
      snake.move();

      expect(collisionSystem.checkSelfCollision(snake)).toBe(false);
    });

    it('should return false when snake moves in straight line', () => {
      const snake = new Snake(new Vec2(10, 10), Direction.RIGHT);

      for (let i = 0; i < 5; i++) {
        snake.grow();
        snake.move();
      }

      expect(collisionSystem.checkSelfCollision(snake)).toBe(false);
    });

    it('should return true when snake head touches body', () => {
      const snake = new Snake(new Vec2(10, 10), Direction.RIGHT);

      // Grow the snake
      for (let i = 0; i < 5; i++) {
        snake.grow();
        snake.move();
      }

      // Make a loop to collide with self
      snake.changeDirection(Direction.UP);
      snake.move();
      snake.changeDirection(Direction.LEFT);
      snake.move();
      snake.changeDirection(Direction.DOWN);
      snake.move();

      expect(collisionSystem.checkSelfCollision(snake)).toBe(true);
    });

    it('should delegate to snake checkSelfCollision method', () => {
      const snake = new Snake(new Vec2(10, 10), Direction.RIGHT);
      const snakeCheckSpy = vi.spyOn(snake, 'checkSelfCollision');

      collisionSystem.checkSelfCollision(snake);

      expect(snakeCheckSpy).toHaveBeenCalled();
    });

    it('should return false when snake grows but does not loop', () => {
      const snake = new Snake(new Vec2(10, 10), Direction.RIGHT);

      for (let i = 0; i < 5; i++) {
        snake.grow();
        snake.move();
      }

      snake.changeDirection(Direction.UP);
      snake.move();
      snake.changeDirection(Direction.RIGHT);
      snake.move();

      expect(collisionSystem.checkSelfCollision(snake)).toBe(false);
    });
  });

  describe('checkFoodCollision', () => {
    it('should return true when snake head is at food position', () => {
      const foodPosition = new Vec2(10, 10);
      const food = new Food(grid);
      // Use spawn to set specific position
      vi.spyOn(grid, 'getRandomPosition').mockReturnValue(foodPosition);
      food.spawn(grid, []);

      expect(collisionSystem.checkFoodCollision(foodPosition, food)).toBe(true);
    });

    it('should return false when snake head is not at food position', () => {
      const snakeHead = new Vec2(10, 10);
      const foodPosition = new Vec2(15, 15);
      const food = new Food(grid);
      vi.spyOn(grid, 'getRandomPosition').mockReturnValue(foodPosition);
      food.spawn(grid, []);

      expect(collisionSystem.checkFoodCollision(snakeHead, food)).toBe(false);
    });

    it('should return false when positions differ by one cell', () => {
      const snakeHead = new Vec2(10, 10);
      const foodPosition = new Vec2(11, 10);
      const food = new Food(grid);
      vi.spyOn(grid, 'getRandomPosition').mockReturnValue(foodPosition);
      food.spawn(grid, []);

      expect(collisionSystem.checkFoodCollision(snakeHead, food)).toBe(false);
    });

    it('should return true when positions are exactly equal', () => {
      const position = new Vec2(5, 5);
      const food = new Food(grid);
      vi.spyOn(grid, 'getRandomPosition').mockReturnValue(position);
      food.spawn(grid, []);

      expect(collisionSystem.checkFoodCollision(position, food)).toBe(true);
    });

    it('should work at grid boundaries', () => {
      const foodPosition = new Vec2(0, 0);
      const food = new Food(grid);
      vi.spyOn(grid, 'getRandomPosition').mockReturnValue(foodPosition);
      food.spawn(grid, []);

      expect(collisionSystem.checkFoodCollision(new Vec2(0, 0), food)).toBe(true);
      expect(collisionSystem.checkFoodCollision(new Vec2(1, 0), food)).toBe(false);
    });

    it('should work at opposite corner', () => {
      const foodPosition = new Vec2(29, 19);
      const food = new Food(grid);
      vi.spyOn(grid, 'getRandomPosition').mockReturnValue(foodPosition);
      food.spawn(grid, []);

      expect(collisionSystem.checkFoodCollision(new Vec2(29, 19), food)).toBe(true);
      expect(collisionSystem.checkFoodCollision(new Vec2(28, 19), food)).toBe(false);
    });
  });

  describe('integration scenarios', () => {
    it('should detect wall collision after snake moves out of bounds', () => {
      const snake = new Snake(new Vec2(0, 10), Direction.LEFT);
      snake.move(); // Move to (-1, 10)

      expect(collisionSystem.checkWallCollision(snake.getHead())).toBe(true);
    });

    it('should detect multiple collision types', () => {
      const snake = new Snake(new Vec2(10, 10), Direction.RIGHT);

      // Grow the snake
      for (let i = 0; i < 5; i++) {
        snake.grow();
        snake.move();
      }

      // Check no collisions during growth
      expect(collisionSystem.checkSelfCollision(snake)).toBe(false);
      expect(collisionSystem.checkWallCollision(snake.getHead())).toBe(false);
    });

    it('should handle snake eating food scenario', () => {
      const snake = new Snake(new Vec2(10, 10), Direction.RIGHT);
      const food = new Food(grid);
      const foodPos = new Vec2(11, 10);
      vi.spyOn(grid, 'getRandomPosition').mockReturnValue(foodPos);
      food.spawn(grid, []);

      snake.move(); // Move head to (11, 10)

      expect(collisionSystem.checkFoodCollision(snake.getHead(), food)).toBe(true);
      expect(collisionSystem.checkWallCollision(snake.getHead())).toBe(false);
      expect(collisionSystem.checkSelfCollision(snake)).toBe(false);
    });

    it('should work with different grid sizes', () => {
      const smallGrid = new Grid(10, 10, 20);
      const smallSystem = new CollisionSystem(smallGrid);

      expect(smallSystem.checkWallCollision(new Vec2(5, 5))).toBe(false);
      expect(smallSystem.checkWallCollision(new Vec2(10, 5))).toBe(true);
      expect(smallSystem.checkWallCollision(new Vec2(5, 10))).toBe(true);
    });

    it('should handle rapid collision checks', () => {
      const snake = new Snake(new Vec2(10, 10), Direction.RIGHT);

      for (let i = 0; i < 10; i++) {
        expect(collisionSystem.checkSelfCollision(snake)).toBe(false);
        expect(collisionSystem.checkWallCollision(snake.getHead())).toBe(false);
        snake.move();
      }
    });

    it('should detect collision at exact boundary', () => {
      const snake = new Snake(new Vec2(29, 10), Direction.RIGHT);
      snake.move(); // Move to (30, 10) - out of bounds

      expect(collisionSystem.checkWallCollision(snake.getHead())).toBe(true);
    });
  });
});

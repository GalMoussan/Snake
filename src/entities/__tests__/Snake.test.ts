import { describe, it, expect, beforeEach } from 'vitest';
import { Snake } from '../Snake';
import { Vec2 } from '../../utils/Vector2D';
import { Direction } from '../../types';

describe('Snake', () => {
  describe('constructor', () => {
    it('should create snake with initial body of 2 segments', () => {
      const startPos = new Vec2(10, 10);
      const snake = new Snake(startPos, Direction.RIGHT);

      expect(snake.getBody().length).toBe(2);
    });

    it('should position head at start position', () => {
      const startPos = new Vec2(10, 10);
      const snake = new Snake(startPos, Direction.RIGHT);

      expect(snake.getHead().equals(startPos)).toBe(true);
    });

    it('should position tail one cell to the left when facing right', () => {
      const startPos = new Vec2(10, 10);
      const snake = new Snake(startPos, Direction.RIGHT);
      const body = snake.getBody();

      expect(body[1].equals(new Vec2(9, 10))).toBe(true);
    });

    it('should set initial direction to RIGHT by default', () => {
      const startPos = new Vec2(10, 10);
      const snake = new Snake(startPos);

      expect(snake.getDirection()).toBe(Direction.RIGHT);
    });

    it('should accept custom initial direction', () => {
      const startPos = new Vec2(10, 10);
      const snake = new Snake(startPos, Direction.UP);

      expect(snake.getDirection()).toBe(Direction.UP);
    });

    it('should return readonly body array', () => {
      const startPos = new Vec2(10, 10);
      const snake = new Snake(startPos);
      const body = snake.getBody();

      expect(Array.isArray(body)).toBe(true);
      // Body should be readonly - TypeScript enforces this at compile time
    });
  });

  describe('move', () => {
    it('should move head forward in current direction', () => {
      const snake = new Snake(new Vec2(10, 10), Direction.RIGHT);
      snake.move();

      expect(snake.getHead().equals(new Vec2(11, 10))).toBe(true);
    });

    it('should move up when direction is UP', () => {
      const snake = new Snake(new Vec2(10, 10), Direction.UP);
      snake.move();

      expect(snake.getHead().equals(new Vec2(10, 9))).toBe(true);
    });

    it('should move down when direction is DOWN', () => {
      const snake = new Snake(new Vec2(10, 10), Direction.DOWN);
      snake.move();

      expect(snake.getHead().equals(new Vec2(10, 11))).toBe(true);
    });

    it('should move left when direction is LEFT', () => {
      const snake = new Snake(new Vec2(10, 10), Direction.LEFT);
      snake.move();

      expect(snake.getHead().equals(new Vec2(9, 10))).toBe(true);
    });

    it('should remove tail segment when not growing', () => {
      const snake = new Snake(new Vec2(10, 10), Direction.RIGHT);
      const initialLength = snake.getBody().length;
      snake.move();

      expect(snake.getBody().length).toBe(initialLength);
    });

    it('should update direction from nextDirection', () => {
      const snake = new Snake(new Vec2(10, 10), Direction.RIGHT);
      snake.changeDirection(Direction.UP);
      snake.move();

      expect(snake.getDirection()).toBe(Direction.UP);
    });

    it('should maintain body segments in order', () => {
      const snake = new Snake(new Vec2(10, 10), Direction.RIGHT);
      snake.move();
      const body = snake.getBody();

      expect(body[0].equals(new Vec2(11, 10))).toBe(true);
      expect(body[1].equals(new Vec2(10, 10))).toBe(true);
    });

    it('should not mutate original body array', () => {
      const snake = new Snake(new Vec2(10, 10), Direction.RIGHT);
      const originalBody = snake.getBody();
      const originalHead = originalBody[0];

      snake.move();

      expect(originalHead.equals(new Vec2(10, 10))).toBe(true);
    });
  });

  describe('grow', () => {
    it('should mark snake for growth', () => {
      const snake = new Snake(new Vec2(10, 10), Direction.RIGHT);
      const initialLength = snake.getBody().length;

      snake.grow();
      snake.move();

      expect(snake.getBody().length).toBe(initialLength + 1);
    });

    it('should only grow once per grow call', () => {
      const snake = new Snake(new Vec2(10, 10), Direction.RIGHT);
      const initialLength = snake.getBody().length;

      snake.grow();
      snake.move();
      snake.move();

      expect(snake.getBody().length).toBe(initialLength + 1);
    });

    it('should allow multiple grow calls', () => {
      const snake = new Snake(new Vec2(10, 10), Direction.RIGHT);
      const initialLength = snake.getBody().length;

      snake.grow();
      snake.move();
      snake.grow();
      snake.move();

      expect(snake.getBody().length).toBe(initialLength + 2);
    });

    it('should keep tail segment when growing', () => {
      const snake = new Snake(new Vec2(10, 10), Direction.RIGHT);
      snake.grow();
      snake.move();
      const body = snake.getBody();

      expect(body.length).toBe(3);
      expect(body[2].equals(new Vec2(9, 10))).toBe(true);
    });
  });

  describe('changeDirection', () => {
    it('should change direction to UP', () => {
      const snake = new Snake(new Vec2(10, 10), Direction.RIGHT);
      snake.changeDirection(Direction.UP);
      snake.move();

      expect(snake.getDirection()).toBe(Direction.UP);
    });

    it('should change direction to DOWN', () => {
      const snake = new Snake(new Vec2(10, 10), Direction.RIGHT);
      snake.changeDirection(Direction.DOWN);
      snake.move();

      expect(snake.getDirection()).toBe(Direction.DOWN);
    });

    it('should change direction to LEFT', () => {
      const snake = new Snake(new Vec2(10, 10), Direction.UP);
      snake.changeDirection(Direction.LEFT);
      snake.move();

      expect(snake.getDirection()).toBe(Direction.LEFT);
    });

    it('should prevent 180-degree turn from RIGHT to LEFT', () => {
      const snake = new Snake(new Vec2(10, 10), Direction.RIGHT);
      snake.changeDirection(Direction.LEFT);
      snake.move();

      expect(snake.getDirection()).toBe(Direction.RIGHT);
    });

    it('should prevent 180-degree turn from LEFT to RIGHT', () => {
      const snake = new Snake(new Vec2(10, 10), Direction.LEFT);
      snake.changeDirection(Direction.RIGHT);
      snake.move();

      expect(snake.getDirection()).toBe(Direction.LEFT);
    });

    it('should prevent 180-degree turn from UP to DOWN', () => {
      const snake = new Snake(new Vec2(10, 10), Direction.UP);
      snake.changeDirection(Direction.DOWN);
      snake.move();

      expect(snake.getDirection()).toBe(Direction.UP);
    });

    it('should prevent 180-degree turn from DOWN to UP', () => {
      const snake = new Snake(new Vec2(10, 10), Direction.DOWN);
      snake.changeDirection(Direction.UP);
      snake.move();

      expect(snake.getDirection()).toBe(Direction.DOWN);
    });

    it('should allow same direction change', () => {
      const snake = new Snake(new Vec2(10, 10), Direction.RIGHT);
      snake.changeDirection(Direction.RIGHT);
      snake.move();

      expect(snake.getDirection()).toBe(Direction.RIGHT);
    });

    it('should buffer direction change until next move', () => {
      const snake = new Snake(new Vec2(10, 10), Direction.RIGHT);
      snake.changeDirection(Direction.UP);

      expect(snake.getDirection()).toBe(Direction.RIGHT);
    });

    it('should allow rapid direction changes with buffering', () => {
      const snake = new Snake(new Vec2(10, 10), Direction.RIGHT);
      snake.changeDirection(Direction.UP);
      snake.changeDirection(Direction.LEFT); // Should be ignored (opposite of UP's future right)
      snake.move();

      expect(snake.getDirection()).toBe(Direction.UP);
    });
  });

  describe('checkSelfCollision', () => {
    it('should return false for initial snake', () => {
      const snake = new Snake(new Vec2(10, 10), Direction.RIGHT);

      expect(snake.checkSelfCollision()).toBe(false);
    });

    it('should return false when head does not touch body', () => {
      const snake = new Snake(new Vec2(10, 10), Direction.RIGHT);
      snake.grow();
      snake.move();
      snake.grow();
      snake.move();

      expect(snake.checkSelfCollision()).toBe(false);
    });

    it('should return true when head collides with body', () => {
      const snake = new Snake(new Vec2(10, 10), Direction.RIGHT);

      // Create a longer snake moving right
      for (let i = 0; i < 5; i++) {
        snake.grow();
        snake.move();
      }
      // Snake is now at (15, 10) with body extending left

      // Make a tight loop to collide with self
      snake.changeDirection(Direction.UP);
      snake.move(); // (15, 9)
      snake.changeDirection(Direction.LEFT);
      snake.move(); // (14, 9)
      snake.changeDirection(Direction.DOWN);
      snake.move(); // (14, 10) - This should collide with body segment at (14, 10)

      expect(snake.checkSelfCollision()).toBe(true);
    });

    it('should not count head position as collision', () => {
      const snake = new Snake(new Vec2(10, 10), Direction.RIGHT);
      snake.move();

      expect(snake.checkSelfCollision()).toBe(false);
    });
  });

  describe('getHead', () => {
    it('should return current head position', () => {
      const startPos = new Vec2(10, 10);
      const snake = new Snake(startPos);

      expect(snake.getHead().equals(startPos)).toBe(true);
    });

    it('should return updated head after move', () => {
      const snake = new Snake(new Vec2(10, 10), Direction.RIGHT);
      snake.move();

      expect(snake.getHead().equals(new Vec2(11, 10))).toBe(true);
    });

    it('should not mutate when head reference is obtained', () => {
      const snake = new Snake(new Vec2(10, 10), Direction.RIGHT);
      const head = snake.getHead();
      snake.move();

      expect(head.equals(new Vec2(10, 10))).toBe(true);
    });
  });

  describe('getBody', () => {
    it('should return full body including head', () => {
      const snake = new Snake(new Vec2(10, 10), Direction.RIGHT);
      const body = snake.getBody();

      expect(body.length).toBeGreaterThanOrEqual(2);
      expect(body[0]).toBe(snake.getHead());
    });

    it('should return immutable body reference', () => {
      const snake = new Snake(new Vec2(10, 10), Direction.RIGHT);
      const body1 = snake.getBody();
      const body2 = snake.getBody();

      expect(body1).not.toBe(body2);
    });
  });

  describe('getDirection', () => {
    it('should return current direction', () => {
      const snake = new Snake(new Vec2(10, 10), Direction.UP);

      expect(snake.getDirection()).toBe(Direction.UP);
    });

    it('should return updated direction after move', () => {
      const snake = new Snake(new Vec2(10, 10), Direction.RIGHT);
      snake.changeDirection(Direction.UP);
      snake.move();

      expect(snake.getDirection()).toBe(Direction.UP);
    });
  });

  describe('integration scenarios', () => {
    it('should handle complex movement pattern', () => {
      const snake = new Snake(new Vec2(10, 10), Direction.RIGHT);

      // Move right
      snake.move();
      expect(snake.getHead().equals(new Vec2(11, 10))).toBe(true);

      // Change to UP and move
      snake.changeDirection(Direction.UP);
      snake.move();
      // Direction changes apply on the move call
      expect(snake.getHead().equals(new Vec2(11, 9))).toBe(true);

      // Change to LEFT and move
      snake.changeDirection(Direction.LEFT);
      snake.move();
      expect(snake.getHead().equals(new Vec2(10, 9))).toBe(true);
    });

    it('should handle growth during movement', () => {
      const snake = new Snake(new Vec2(10, 10), Direction.RIGHT);

      snake.grow();
      snake.move();
      const length1 = snake.getBody().length;

      snake.grow();
      snake.move();
      const length2 = snake.getBody().length;

      expect(length2).toBe(length1 + 1);
    });

    it('should maintain body integrity through multiple operations', () => {
      const snake = new Snake(new Vec2(10, 10), Direction.RIGHT);

      for (let i = 0; i < 3; i++) {
        snake.grow();
        snake.move();
      }

      const body = snake.getBody();
      expect(body.length).toBe(5);

      // Verify no gaps in body
      for (let i = 0; i < body.length - 1; i++) {
        const current = body[i];
        const next = body[i + 1];
        const distance = Math.abs(current.x - next.x) + Math.abs(current.y - next.y);
        expect(distance).toBe(1);
      }
    });
  });
});

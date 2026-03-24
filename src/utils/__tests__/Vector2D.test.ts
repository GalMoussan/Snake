import { describe, it, expect } from 'vitest';
import { Vec2 } from '../Vector2D';
import { Direction } from '../../types';

describe('Vec2', () => {
  describe('constructor', () => {
    it('should create a vector with x and y coordinates', () => {
      const vec = new Vec2(5, 10);
      expect(vec.x).toBe(5);
      expect(vec.y).toBe(10);
    });

    it('should have readonly coordinates', () => {
      const vec = new Vec2(3, 4);
      // TypeScript enforces readonly at compile time
      // Attempting to modify would cause a TypeScript error
      expect(vec.x).toBe(3);
      expect(vec.y).toBe(4);
    });
  });

  describe('equals', () => {
    it('should return true for vectors with same coordinates', () => {
      const vec1 = new Vec2(5, 10);
      const vec2 = new Vec2(5, 10);
      expect(vec1.equals(vec2)).toBe(true);
    });

    it('should return false for vectors with different x', () => {
      const vec1 = new Vec2(5, 10);
      const vec2 = new Vec2(6, 10);
      expect(vec1.equals(vec2)).toBe(false);
    });

    it('should return false for vectors with different y', () => {
      const vec1 = new Vec2(5, 10);
      const vec2 = new Vec2(5, 11);
      expect(vec1.equals(vec2)).toBe(false);
    });

    it('should return false for vectors with both coordinates different', () => {
      const vec1 = new Vec2(5, 10);
      const vec2 = new Vec2(6, 11);
      expect(vec1.equals(vec2)).toBe(false);
    });
  });

  describe('add', () => {
    it('should add two vectors and return a new vector', () => {
      const vec1 = new Vec2(5, 10);
      const vec2 = new Vec2(3, 4);
      const result = vec1.add(vec2);
      expect(result.x).toBe(8);
      expect(result.y).toBe(14);
    });

    it('should not mutate the original vectors', () => {
      const vec1 = new Vec2(5, 10);
      const vec2 = new Vec2(3, 4);
      vec1.add(vec2);
      expect(vec1.x).toBe(5);
      expect(vec1.y).toBe(10);
      expect(vec2.x).toBe(3);
      expect(vec2.y).toBe(4);
    });

    it('should handle negative numbers', () => {
      const vec1 = new Vec2(5, 10);
      const vec2 = new Vec2(-3, -4);
      const result = vec1.add(vec2);
      expect(result.x).toBe(2);
      expect(result.y).toBe(6);
    });

    it('should handle zero vectors', () => {
      const vec1 = new Vec2(5, 10);
      const vec2 = new Vec2(0, 0);
      const result = vec1.add(vec2);
      expect(result.x).toBe(5);
      expect(result.y).toBe(10);
    });
  });

  describe('copy', () => {
    it('should create a new vector with same coordinates', () => {
      const vec = new Vec2(5, 10);
      const copy = vec.copy();
      expect(copy.x).toBe(5);
      expect(copy.y).toBe(10);
    });

    it('should create a different instance', () => {
      const vec = new Vec2(5, 10);
      const copy = vec.copy();
      expect(copy).not.toBe(vec);
    });

    it('should create an independent copy', () => {
      const vec = new Vec2(5, 10);
      const copy = vec.copy();
      const modified = copy.add(new Vec2(1, 1));
      expect(vec.x).toBe(5);
      expect(vec.y).toBe(10);
      expect(modified.x).toBe(6);
      expect(modified.y).toBe(11);
    });
  });

  describe('fromDirection', () => {
    it('should convert UP to (0, -1)', () => {
      const vec = Vec2.fromDirection(Direction.UP);
      expect(vec.x).toBe(0);
      expect(vec.y).toBe(-1);
    });

    it('should convert DOWN to (0, 1)', () => {
      const vec = Vec2.fromDirection(Direction.DOWN);
      expect(vec.x).toBe(0);
      expect(vec.y).toBe(1);
    });

    it('should convert LEFT to (-1, 0)', () => {
      const vec = Vec2.fromDirection(Direction.LEFT);
      expect(vec.x).toBe(-1);
      expect(vec.y).toBe(0);
    });

    it('should convert RIGHT to (1, 0)', () => {
      const vec = Vec2.fromDirection(Direction.RIGHT);
      expect(vec.x).toBe(1);
      expect(vec.y).toBe(0);
    });
  });

  describe('integration tests', () => {
    it('should chain operations correctly', () => {
      const start = new Vec2(10, 10);
      const right = Vec2.fromDirection(Direction.RIGHT);
      const down = Vec2.fromDirection(Direction.DOWN);

      const result = start.add(right).add(down);

      expect(result.x).toBe(11);
      expect(result.y).toBe(11);
    });

    it('should work with multiple additions', () => {
      const pos = new Vec2(0, 0);
      const step = new Vec2(1, 1);

      const pos1 = pos.add(step);
      const pos2 = pos1.add(step);
      const pos3 = pos2.add(step);

      expect(pos3.x).toBe(3);
      expect(pos3.y).toBe(3);
    });
  });
});

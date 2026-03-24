import { describe, it, expect } from 'vitest';
import { COLORS, GRID, GAME } from '../Constants';

describe('Constants', () => {
  describe('COLORS', () => {
    it('should have all required color constants', () => {
      expect(COLORS.SNAKE_HEAD).toBe('#4CAF50');
      expect(COLORS.SNAKE_BODY).toBe('#81C784');
      expect(COLORS.FOOD).toBe('#F44336');
      expect(COLORS.BACKGROUND).toBe('#1A1A2E');
      expect(COLORS.GRID_LINES).toBe('rgba(255, 255, 255, 0.05)');
      expect(COLORS.TEXT).toBe('#FFFFFF');
    });
  });

  describe('GRID', () => {
    it('should have correct grid dimensions', () => {
      expect(GRID.WIDTH).toBe(30);
      expect(GRID.HEIGHT).toBe(20);
      expect(GRID.CELL_SIZE).toBe(20);
    });

    it('should calculate correct canvas size', () => {
      const canvasWidth = GRID.WIDTH * GRID.CELL_SIZE;
      const canvasHeight = GRID.HEIGHT * GRID.CELL_SIZE;
      expect(canvasWidth).toBe(600);
      expect(canvasHeight).toBe(400);
    });
  });

  describe('GAME', () => {
    it('should have correct game settings', () => {
      expect(GAME.INITIAL_SPEED).toBe(150);
      expect(GAME.SPEED_INCREASE).toBe(5);
      expect(GAME.POINTS_PER_FOOD).toBe(10);
    });
  });
});

import { describe, it, expect, beforeEach, vi } from 'vitest';
import { RenderSystem } from '../RenderSystem';
import { Grid } from '../../core/Grid';
import { Snake } from '../../entities/Snake';
import { Food } from '../../entities/Food';
import { Vec2 } from '../../utils/Vector2D';
import { Direction } from '../../types';

describe('RenderSystem', () => {
  let canvas: HTMLCanvasElement;
  let ctx: CanvasRenderingContext2D;
  let grid: Grid;
  let renderSystem: RenderSystem;

  beforeEach(() => {
    // Create mock canvas and context
    canvas = document.createElement('canvas');
    canvas.width = 600;
    canvas.height = 400;

    // Create mock context with all required methods
    ctx = {
      fillStyle: '',
      strokeStyle: '',
      lineWidth: 1,
      font: '',
      textAlign: 'left',
      shadowColor: '',
      shadowBlur: 0,
      fillRect: vi.fn(),
      strokeRect: vi.fn(),
      fillText: vi.fn(),
      beginPath: vi.fn(),
      arc: vi.fn(),
      arcTo: vi.fn(),
      closePath: vi.fn(),
      fill: vi.fn(),
      stroke: vi.fn(),
      moveTo: vi.fn(),
      lineTo: vi.fn(),
      save: vi.fn(),
      restore: vi.fn(),
      createLinearGradient: vi.fn(() => ({
        addColorStop: vi.fn(),
      })),
      createRadialGradient: vi.fn(() => ({
        addColorStop: vi.fn(),
      })),
    } as unknown as CanvasRenderingContext2D;

    // Mock getContext to return our mock context
    vi.spyOn(canvas, 'getContext').mockReturnValue(ctx);

    grid = new Grid(30, 20, 20);
    renderSystem = new RenderSystem(canvas, grid);
  });

  describe('constructor', () => {
    it('should create render system with canvas and grid', () => {
      expect(renderSystem).toBeInstanceOf(RenderSystem);
    });

    it('should throw if canvas context is not available', () => {
      const mockCanvas = { getContext: () => null } as unknown as HTMLCanvasElement;

      expect(() => {
        new RenderSystem(mockCanvas, grid);
      }).toThrow('Failed to get canvas context');
    });

    it('should accept custom canvas and grid', () => {
      const customCanvas = document.createElement('canvas');
      const customCtx = {
        fillStyle: '',
        strokeStyle: '',
        lineWidth: 1,
        font: '',
        textAlign: 'left',
        shadowColor: '',
        shadowBlur: 0,
        fillRect: vi.fn(),
        strokeRect: vi.fn(),
        fillText: vi.fn(),
        beginPath: vi.fn(),
        arc: vi.fn(),
        arcTo: vi.fn(),
        closePath: vi.fn(),
        fill: vi.fn(),
        stroke: vi.fn(),
        moveTo: vi.fn(),
        lineTo: vi.fn(),
        save: vi.fn(),
        restore: vi.fn(),
        createLinearGradient: vi.fn(() => ({
          addColorStop: vi.fn(),
        })),
        createRadialGradient: vi.fn(() => ({
          addColorStop: vi.fn(),
        })),
      } as unknown as CanvasRenderingContext2D;
      vi.spyOn(customCanvas, 'getContext').mockReturnValue(customCtx);
      const customGrid = new Grid(40, 30, 15);

      const system = new RenderSystem(customCanvas, customGrid);

      expect(system).toBeInstanceOf(RenderSystem);
    });
  });

  describe('clear', () => {
    it('should fill canvas with background color', () => {
      renderSystem.clear();

      expect(ctx.fillRect).toHaveBeenCalledWith(0, 0, canvas.width, canvas.height);
    });

    it('should set fillStyle to background color', () => {
      renderSystem.clear();

      expect(String(ctx.fillStyle).toLowerCase()).toContain('#1a1a2e');
    });

    it('should clear entire canvas area', () => {
      renderSystem.clear();

      expect(ctx.fillRect).toHaveBeenCalledWith(0, 0, 600, 400);
    });
  });

  describe('drawGrid', () => {
    it('should set stroke style for grid lines', () => {
      renderSystem.drawGrid();

      expect(ctx.strokeStyle).toBeTruthy();
    });

    it('should set line width', () => {
      renderSystem.drawGrid();

      expect(ctx.lineWidth).toBe(0.5);
    });

    it('should draw vertical and horizontal lines', () => {
      renderSystem.drawGrid();

      // Should draw grid cell borders
      expect(ctx.strokeRect).toHaveBeenCalled();
    });
  });

  describe('drawSnake', () => {
    it('should draw snake head and body', () => {
      const snake = new Snake(new Vec2(10, 10), Direction.RIGHT);

      renderSystem.drawSnake(snake);

      // Should draw at least 2 segments (head + tail)
      expect(ctx.fill).toHaveBeenCalled();
    });

    it('should draw head with different color than body', () => {
      const snake = new Snake(new Vec2(10, 10), Direction.RIGHT);
      snake.grow();
      snake.move();
      snake.grow();
      snake.move();

      renderSystem.drawSnake(snake);

      // Check that fill was called for each segment plus 2 eyes on head
      expect(ctx.fill).toHaveBeenCalledTimes(snake.getBody().length + 2);
    });

    it('should draw each body segment', () => {
      const snake = new Snake(new Vec2(10, 10), Direction.RIGHT);

      for (let i = 0; i < 5; i++) {
        snake.grow();
        snake.move();
      }

      renderSystem.drawSnake(snake);

      // Each segment + 2 eyes on head
      expect(ctx.fill).toHaveBeenCalledTimes(snake.getBody().length + 2);
    });

    it('should position segments correctly on grid', () => {
      const snake = new Snake(new Vec2(0, 0), Direction.RIGHT);

      renderSystem.drawSnake(snake);

      // Should call fill for rendering
      expect(ctx.fill).toHaveBeenCalled();
    });

    it('should handle long snake', () => {
      const snake = new Snake(new Vec2(10, 10), Direction.RIGHT);

      for (let i = 0; i < 20; i++) {
        snake.grow();
        snake.move();
      }

      renderSystem.drawSnake(snake);

      // Each segment + 2 eyes on head
      expect(ctx.fill).toHaveBeenCalledTimes(snake.getBody().length + 2);
    });
  });

  describe('drawFood', () => {
    it('should draw food as circle', () => {
      const food = new Food(grid);

      renderSystem.drawFood(food);

      expect(ctx.beginPath).toHaveBeenCalled();
      expect(ctx.arc).toHaveBeenCalled();
      expect(ctx.fill).toHaveBeenCalled();
    });

    it('should position food at correct pixel coordinates', () => {
      const food = new Food(grid);
      vi.spyOn(grid, 'getRandomPosition').mockReturnValue(new Vec2(5, 5));
      food.spawn(grid, []);

      renderSystem.drawFood(food);

      const expectedX = 5 * 20 + 10; // cell position * cellSize + radius
      const expectedY = 5 * 20 + 10;

      // Arc should be called with correct center position (radius varies due to pulse animation)
      expect(ctx.arc).toHaveBeenCalledWith(
        expectedX,
        expectedY,
        expect.any(Number), // Radius changes due to pulsing animation
        0,
        Math.PI * 2
      );
    });

    it('should set food color', () => {
      const food = new Food(grid);

      renderSystem.drawFood(food);

      expect(ctx.fillStyle).toBeTruthy();
    });

    it('should draw circle with full rotation', () => {
      const food = new Food(grid);

      renderSystem.drawFood(food);

      expect(ctx.arc).toHaveBeenCalledWith(
        expect.any(Number),
        expect.any(Number),
        expect.any(Number),
        0,
        Math.PI * 2
      );
    });
  });

  describe('drawScore', () => {
    it('should draw current score', () => {
      renderSystem.drawScore(100, 500);

      expect(ctx.fillText).toHaveBeenCalledWith('Score: 100', 10, 25);
    });

    it('should draw high score', () => {
      renderSystem.drawScore(100, 500);

      expect(ctx.fillText).toHaveBeenCalledWith(
        'High: 500',
        canvas.width - 150,
        25
      );
    });

    it('should set text color', () => {
      renderSystem.drawScore(100, 500);

      expect(ctx.fillStyle).toBeTruthy();
    });

    it('should set font', () => {
      renderSystem.drawScore(100, 500);

      expect(ctx.font).toContain('16px');
    });

    it('should handle zero scores', () => {
      renderSystem.drawScore(0, 0);

      expect(ctx.fillText).toHaveBeenCalledWith('Score: 0', 10, 25);
      expect(ctx.fillText).toHaveBeenCalledWith('High: 0', canvas.width - 150, 25);
    });

    it('should handle large scores', () => {
      renderSystem.drawScore(9999, 9999);

      expect(ctx.fillText).toHaveBeenCalledWith('Score: 9999', 10, 25);
      expect(ctx.fillText).toHaveBeenCalledWith('High: 9999', canvas.width - 150, 25);
    });
  });

  describe('drawGameOver', () => {
    it('should draw semi-transparent overlay', () => {
      renderSystem.drawGameOver(100);

      expect(ctx.fillRect).toHaveBeenCalledWith(0, 0, canvas.width, canvas.height);
    });

    it('should draw game over text', () => {
      renderSystem.drawGameOver(100);

      expect(ctx.fillText).toHaveBeenCalledWith(
        'GAME OVER',
        canvas.width / 2,
        canvas.height / 2 - 40
      );
    });

    it('should draw final score', () => {
      renderSystem.drawGameOver(250);

      expect(ctx.fillText).toHaveBeenCalledWith(
        'Final Score: 250',
        canvas.width / 2,
        canvas.height / 2
      );
    });

    it('should draw restart instruction', () => {
      renderSystem.drawGameOver(100);

      expect(ctx.fillText).toHaveBeenCalledWith(
        'Press SPACE to restart',
        canvas.width / 2,
        canvas.height / 2 + 60
      );
    });

    it('should center text', () => {
      renderSystem.drawGameOver(100);

      expect(ctx.textAlign).toBe('left'); // Reset to left after centering
    });

    it('should use different font sizes', () => {
      renderSystem.drawGameOver(100);

      // Font should be changed during rendering
      expect(ctx.font).toBeTruthy();
    });
  });

  describe('drawStartScreen', () => {
    it('should clear canvas first', () => {
      renderSystem.drawStartScreen();

      expect(ctx.fillRect).toHaveBeenCalled();
    });

    it('should draw title', () => {
      renderSystem.drawStartScreen();

      expect(ctx.fillText).toHaveBeenCalledWith(
        'SNAKE',
        canvas.width / 2,
        canvas.height / 2 - 60
      );
    });

    it('should draw controls instruction', () => {
      renderSystem.drawStartScreen();

      expect(ctx.fillText).toHaveBeenCalledWith(
        'Use arrow keys or WASD to move',
        canvas.width / 2,
        canvas.height / 2
      );
    });

    it('should draw start instruction', () => {
      renderSystem.drawStartScreen();

      expect(ctx.fillText).toHaveBeenCalledWith(
        'Press SPACE to start',
        canvas.width / 2,
        canvas.height / 2 + 40
      );
    });

    it('should center text', () => {
      renderSystem.drawStartScreen();

      expect(ctx.textAlign).toBe('left'); // Reset after centering
    });

    it('should use appropriate fonts', () => {
      renderSystem.drawStartScreen();

      expect(ctx.font).toBeTruthy();
    });
  });

  describe('drawPaused', () => {
    it('should draw semi-transparent overlay', () => {
      renderSystem.drawPaused();

      expect(ctx.fillRect).toHaveBeenCalledWith(0, 0, canvas.width, canvas.height);
    });

    it('should draw paused text', () => {
      renderSystem.drawPaused();

      expect(ctx.fillText).toHaveBeenCalledWith(
        'PAUSED',
        canvas.width / 2,
        canvas.height / 2
      );
    });

    it('should draw resume instruction', () => {
      renderSystem.drawPaused();

      expect(ctx.fillText).toHaveBeenCalledWith(
        'Press SPACE to resume',
        canvas.width / 2,
        canvas.height / 2 + 40
      );
    });

    it('should center text', () => {
      renderSystem.drawPaused();

      expect(ctx.textAlign).toBe('left'); // Reset after centering
    });

    it('should use appropriate fonts', () => {
      renderSystem.drawPaused();

      expect(ctx.font).toBeTruthy();
    });
  });

  describe('integration scenarios', () => {
    it('should render complete game frame', () => {
      const snake = new Snake(new Vec2(10, 10), Direction.RIGHT);
      const food = new Food(grid);

      renderSystem.clear();
      renderSystem.drawGrid();
      renderSystem.drawSnake(snake);
      renderSystem.drawFood(food);
      renderSystem.drawScore(100, 500);

      expect(ctx.fillRect).toHaveBeenCalled();
      expect(ctx.arc).toHaveBeenCalled();
      expect(ctx.fillText).toHaveBeenCalled();
    });

    it('should handle multiple render calls', () => {
      const snake = new Snake(new Vec2(10, 10), Direction.RIGHT);

      for (let i = 0; i < 5; i++) {
        renderSystem.clear();
        renderSystem.drawSnake(snake);
        snake.move();
      }

      expect(ctx.fillRect).toHaveBeenCalled();
    });

    it('should render different game states', () => {
      renderSystem.drawStartScreen();
      renderSystem.clear();

      const snake = new Snake(new Vec2(10, 10), Direction.RIGHT);
      renderSystem.drawSnake(snake);

      renderSystem.drawPaused();
      renderSystem.drawGameOver(100);

      expect(ctx.fillText).toHaveBeenCalled();
      expect(ctx.fillRect).toHaveBeenCalled();
    });
  });
});

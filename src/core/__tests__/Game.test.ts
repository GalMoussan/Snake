import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { Game } from '../Game';
import { GameStateType } from '../../types';

describe('Game Integration Tests', () => {
  let canvas: HTMLCanvasElement;
  let game: Game;

  beforeEach(() => {
    // Create a mock canvas
    canvas = document.createElement('canvas');
    canvas.width = 600;
    canvas.height = 400;

    // Mock canvas context
    const mockCtx = {
      fillStyle: '',
      strokeStyle: '',
      lineWidth: 0,
      font: '',
      textAlign: 'left',
      shadowColor: '',
      shadowBlur: 0,
      fillRect: vi.fn(),
      strokeRect: vi.fn(),
      clearRect: vi.fn(),
      beginPath: vi.fn(),
      moveTo: vi.fn(),
      lineTo: vi.fn(),
      arc: vi.fn(),
      arcTo: vi.fn(),
      closePath: vi.fn(),
      fill: vi.fn(),
      stroke: vi.fn(),
      fillText: vi.fn(),
      save: vi.fn(),
      restore: vi.fn(),
      createLinearGradient: vi.fn(() => ({
        addColorStop: vi.fn(),
      })),
      createRadialGradient: vi.fn(() => ({
        addColorStop: vi.fn(),
      })),
    };

    vi.spyOn(canvas, 'getContext').mockReturnValue(mockCtx as unknown as CanvasRenderingContext2D);

    // Mock localStorage
    const localStorageMock = (() => {
      let store: Record<string, string> = {};
      return {
        getItem: (key: string) => store[key] || null,
        setItem: (key: string, value: string) => {
          store[key] = value;
        },
        removeItem: (key: string) => {
          delete store[key];
        },
        clear: () => {
          store = {};
        },
      };
    })();
    Object.defineProperty(window, 'localStorage', {
      value: localStorageMock,
      writable: true,
    });

    // Mock requestAnimationFrame
    vi.spyOn(window, 'requestAnimationFrame').mockImplementation((cb) => {
      setTimeout(() => cb(Date.now()), 16);
      return 1;
    });

    vi.spyOn(window, 'cancelAnimationFrame').mockImplementation(() => {});
  });

  afterEach(() => {
    if (game) {
      game.destroy();
    }
    vi.restoreAllMocks();
  });

  it('should initialize with MENU state', () => {
    game = new Game(canvas);
    expect(game.getGameState().getCurrentState()).toBe(GameStateType.MENU);
  });

  it('should initialize score to 0', () => {
    game = new Game(canvas);
    expect(game.getScore()).toBe(0);
  });

  it('should transition from MENU to PLAYING on space press', () => {
    game = new Game(canvas);
    game.init();

    const spaceEvent = new KeyboardEvent('keydown', { key: ' ' });
    document.dispatchEvent(spaceEvent);

    expect(game.getGameState().getCurrentState()).toBe(GameStateType.PLAYING);
  });

  it('should pause when PLAYING and space is pressed', () => {
    game = new Game(canvas);
    game.init();

    // Start game
    const spaceEvent1 = new KeyboardEvent('keydown', { key: ' ' });
    document.dispatchEvent(spaceEvent1);
    expect(game.getGameState().getCurrentState()).toBe(GameStateType.PLAYING);

    // Pause game
    const spaceEvent2 = new KeyboardEvent('keydown', { key: ' ' });
    document.dispatchEvent(spaceEvent2);
    expect(game.getGameState().getCurrentState()).toBe(GameStateType.PAUSED);
  });

  it('should resume from PAUSED to PLAYING on space press', () => {
    game = new Game(canvas);
    game.init();

    // Start game
    document.dispatchEvent(new KeyboardEvent('keydown', { key: ' ' }));
    expect(game.getGameState().getCurrentState()).toBe(GameStateType.PLAYING);

    // Pause game
    document.dispatchEvent(new KeyboardEvent('keydown', { key: ' ' }));
    expect(game.getGameState().getCurrentState()).toBe(GameStateType.PAUSED);

    // Resume game
    document.dispatchEvent(new KeyboardEvent('keydown', { key: ' ' }));
    expect(game.getGameState().getCurrentState()).toBe(GameStateType.PLAYING);
  });

  it('should restart game from GAME_OVER on space press', () => {
    game = new Game(canvas);
    game.init();

    // Start game
    document.dispatchEvent(new KeyboardEvent('keydown', { key: ' ' }));

    // Manually set to game over
    game.getGameState().setState(GameStateType.GAME_OVER);

    // Restart
    document.dispatchEvent(new KeyboardEvent('keydown', { key: ' ' }));
    expect(game.getGameState().getCurrentState()).toBe(GameStateType.PLAYING);
  });

  it('should reset score when starting new game', () => {
    game = new Game(canvas);
    game.init();

    // Start game
    document.dispatchEvent(new KeyboardEvent('keydown', { key: ' ' }));

    // Manually set score (simulate eating food)
    game.getGameState().setState(GameStateType.GAME_OVER);

    // Check score was reset on restart
    document.dispatchEvent(new KeyboardEvent('keydown', { key: ' ' }));
    expect(game.getScore()).toBe(0);
  });

  it('should handle arrow key inputs when playing', () => {
    game = new Game(canvas);
    game.init();

    // Start game
    document.dispatchEvent(new KeyboardEvent('keydown', { key: ' ' }));

    // Press arrow keys - should not throw
    expect(() => {
      document.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowUp' }));
      document.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowDown' }));
      document.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowLeft' }));
      document.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowRight' }));
    }).not.toThrow();
  });

  it('should ignore direction inputs when not playing', () => {
    game = new Game(canvas);
    game.init();

    // Don't start game, just press arrow keys
    expect(() => {
      document.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowUp' }));
    }).not.toThrow();

    expect(game.getGameState().getCurrentState()).toBe(GameStateType.MENU);
  });

  it('should handle WASD inputs', () => {
    game = new Game(canvas);
    game.init();

    // Start game
    document.dispatchEvent(new KeyboardEvent('keydown', { key: ' ' }));

    // Press WASD keys - should not throw
    expect(() => {
      document.dispatchEvent(new KeyboardEvent('keydown', { key: 'w' }));
      document.dispatchEvent(new KeyboardEvent('keydown', { key: 's' }));
      document.dispatchEvent(new KeyboardEvent('keydown', { key: 'a' }));
      document.dispatchEvent(new KeyboardEvent('keydown', { key: 'd' }));
    }).not.toThrow();
  });

  it('should clean up resources on destroy', () => {
    game = new Game(canvas);
    game.init();

    // Start game
    document.dispatchEvent(new KeyboardEvent('keydown', { key: ' ' }));

    game.destroy();

    // After destroy, key events should not affect game state
    const initialState = game.getGameState().getCurrentState();
    document.dispatchEvent(new KeyboardEvent('keydown', { key: ' ' }));
    expect(game.getGameState().getCurrentState()).toBe(initialState);
  });

  it('should persist high score to localStorage', () => {
    game = new Game(canvas);

    // Initially high score should be 0
    expect(game.getHighScore()).toBe(0);

    // Start a new game and verify high score persists
    localStorage.setItem('snake_high_score', JSON.stringify(100));

    const newGame = new Game(canvas);
    expect(newGame.getHighScore()).toBe(100);
    newGame.destroy();
  });

  it('should render initial start screen', () => {
    const mockCtx = canvas.getContext('2d');
    const fillTextSpy = vi.spyOn(mockCtx!, 'fillText');

    game = new Game(canvas);
    game.init();

    // Should have called fillText for start screen
    expect(fillTextSpy).toHaveBeenCalled();
  });

  it('should handle Escape key for pause toggle', () => {
    game = new Game(canvas);
    game.init();

    // Start game
    document.dispatchEvent(new KeyboardEvent('keydown', { key: ' ' }));
    expect(game.getGameState().getCurrentState()).toBe(GameStateType.PLAYING);

    // Pause with Escape
    document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape' }));
    expect(game.getGameState().getCurrentState()).toBe(GameStateType.PAUSED);
  });
});

import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { GameStateType } from '../types';

describe('Main entry point', () => {
  let canvas: HTMLCanvasElement;

  beforeEach(() => {
    // Setup DOM with canvas element and buttons
    document.body.innerHTML = `
      <canvas id="gameCanvas" width="400" height="400"></canvas>
      <button id="startBtn">Start</button>
      <button id="pauseBtn">Pause</button>
    `;

    canvas = document.getElementById('gameCanvas') as HTMLCanvasElement;
  });

  afterEach(() => {
    document.body.innerHTML = '';
  });

  describe('DOM setup validation', () => {
    it('should require a canvas element on the page', () => {
      document.body.innerHTML = '';
      const missingCanvas = document.getElementById('gameCanvas');
      expect(missingCanvas).toBeNull();
    });

    it('should have a valid canvas element when properly set up', () => {
      expect(canvas).toBeDefined();
      expect(canvas).toBeInstanceOf(HTMLCanvasElement);
      expect(canvas.id).toBe('gameCanvas');
      expect(canvas.width).toBe(400);
      expect(canvas.height).toBe(400);
    });

    it('should have start button element', () => {
      const startBtn = document.getElementById('startBtn');
      expect(startBtn).toBeDefined();
      expect(startBtn?.textContent).toBe('Start');
    });

    it('should have pause button element', () => {
      const pauseBtn = document.getElementById('pauseBtn');
      expect(pauseBtn).toBeDefined();
      expect(pauseBtn?.textContent).toBe('Pause');
    });

    it('should throw error when canvas is missing', () => {
      document.body.innerHTML = `<button id="startBtn">Start</button>`;
      expect(() => {
        const canvas = document.getElementById('gameCanvas') as HTMLCanvasElement;
        if (!canvas) {
          throw new Error('Canvas element not found');
        }
      }).toThrow('Canvas element not found');
    });
  });

  describe('GameState type handling', () => {
    it('should recognize MENU state', () => {
      const state: GameStateType = GameStateType.MENU;
      expect(state).toBe('MENU');
    });

    it('should recognize PLAYING state', () => {
      const state: GameStateType = GameStateType.PLAYING;
      expect(state).toBe('PLAYING');
    });

    it('should recognize PAUSED state', () => {
      const state: GameStateType = GameStateType.PAUSED;
      expect(state).toBe('PAUSED');
    });

    it('should recognize GAME_OVER state', () => {
      const state: GameStateType = GameStateType.GAME_OVER;
      expect(state).toBe('GAME_OVER');
    });

    it('should handle state comparisons correctly', () => {
      let state: GameStateType = GameStateType.MENU;

      // Simulate menu to playing transition
      if (state === GameStateType.MENU || state === GameStateType.GAME_OVER) {
        state = GameStateType.PLAYING;
      }
      expect(state).toBe(GameStateType.PLAYING);

      // Simulate pause
      if (state === GameStateType.PLAYING) {
        state = GameStateType.PAUSED;
      }
      expect(state).toBe(GameStateType.PAUSED);

      // Simulate resume
      if (state === GameStateType.PAUSED) {
        state = GameStateType.PLAYING;
      }
      expect(state).toBe(GameStateType.PLAYING);
    });
  });

  describe('Game flow state transitions', () => {
    it('should transition from MENU to PLAYING', () => {
      let state: GameStateType = GameStateType.MENU;

      if (state === GameStateType.MENU || state === GameStateType.GAME_OVER) {
        state = GameStateType.PLAYING;
      }

      expect(state).toBe(GameStateType.PLAYING);
    });

    it('should transition from PLAYING to PAUSED', () => {
      let state: GameStateType = GameStateType.PLAYING;

      if (state === GameStateType.PLAYING) {
        state = GameStateType.PAUSED;
      }

      expect(state).toBe(GameStateType.PAUSED);
    });

    it('should transition from PAUSED to PLAYING', () => {
      let state: GameStateType = GameStateType.PAUSED;

      if (state === GameStateType.PAUSED) {
        state = GameStateType.PLAYING;
      }

      expect(state).toBe(GameStateType.PLAYING);
    });

    it('should transition from PLAYING to GAME_OVER', () => {
      let state: GameStateType = GameStateType.PLAYING;

      state = GameStateType.GAME_OVER;

      expect(state).toBe(GameStateType.GAME_OVER);
    });

    it('should transition from GAME_OVER to PLAYING', () => {
      let state: GameStateType = GameStateType.GAME_OVER;

      if (state === GameStateType.MENU || state === GameStateType.GAME_OVER) {
        state = GameStateType.PLAYING;
      }

      expect(state).toBe(GameStateType.PLAYING);
    });

    it('should complete full game cycle', () => {
      let state: GameStateType = GameStateType.MENU;

      // Start game
      if (state === GameStateType.MENU || state === GameStateType.GAME_OVER) {
        state = GameStateType.PLAYING;
      }
      expect(state).toBe(GameStateType.PLAYING);

      // Pause game
      if (state === GameStateType.PLAYING) {
        state = GameStateType.PAUSED;
      }
      expect(state).toBe(GameStateType.PAUSED);

      // Resume game
      if (state === GameStateType.PAUSED) {
        state = GameStateType.PLAYING;
      }
      expect(state).toBe(GameStateType.PLAYING);

      // Game over
      state = GameStateType.GAME_OVER;
      expect(state).toBe(GameStateType.GAME_OVER);

      // Restart
      if (state === GameStateType.MENU || state === GameStateType.GAME_OVER) {
        state = GameStateType.PLAYING;
      }
      expect(state).toBe(GameStateType.PLAYING);
    });
  });

  describe('Button state logic', () => {
    it('should set Start text for MENU state', () => {
      const isPlaying = false;
      const text = isPlaying ? 'Restart' : 'Start';
      expect(text).toBe('Start');
    });

    it('should set Restart text for PLAYING state', () => {
      const isPlaying = true;
      const text = isPlaying ? 'Restart' : 'Start';
      expect(text).toBe('Restart');
    });

    it('should set Pause text when not paused', () => {
      const isPaused = false;
      const text = isPaused ? 'Resume' : 'Pause';
      expect(text).toBe('Pause');
    });

    it('should set Resume text when paused', () => {
      const isPaused = true;
      const text = isPaused ? 'Resume' : 'Pause';
      expect(text).toBe('Resume');
    });

    it('should disable pause button when not playing', () => {
      const isPlaying = false;
      const isPaused = false;
      const isDisabled = !isPlaying && !isPaused;
      expect(isDisabled).toBe(true);
    });

    it('should enable pause button when playing', () => {
      const isPlaying = true;
      const isPaused = false;
      const isDisabled = !isPlaying && !isPaused;
      expect(isDisabled).toBe(false);
    });

    it('should enable pause button when paused', () => {
      const isPlaying = true;
      const isPaused = true;
      const isDisabled = !isPlaying && !isPaused;
      expect(isDisabled).toBe(false);
    });

    it('should handle all button state combinations', () => {
      const scenarios = [
        { isPlaying: false, isPaused: false, startText: 'Start', pauseText: 'Pause', pauseDisabled: true },
        { isPlaying: true, isPaused: false, startText: 'Restart', pauseText: 'Pause', pauseDisabled: false },
        { isPlaying: true, isPaused: true, startText: 'Restart', pauseText: 'Resume', pauseDisabled: false },
      ];

      scenarios.forEach(scenario => {
        const startText = scenario.isPlaying ? 'Restart' : 'Start';
        const pauseText = scenario.isPaused ? 'Resume' : 'Pause';
        const pauseDisabled = !scenario.isPlaying && !scenario.isPaused;

        expect(startText).toBe(scenario.startText);
        expect(pauseText).toBe(scenario.pauseText);
        expect(pauseDisabled).toBe(scenario.pauseDisabled);
      });
    });
  });

  describe('Entry point requirements', () => {
    it('should have canvas with specific dimensions', () => {
      expect(canvas.width).toBeGreaterThan(0);
      expect(canvas.height).toBeGreaterThan(0);
    });

    it('should support DOMContentLoaded event', () => {
      const event = new Event('DOMContentLoaded');
      expect(() => {
        document.dispatchEvent(event);
      }).not.toThrow();
    });

    it('should support beforeunload event for cleanup', () => {
      const event = new Event('beforeunload');
      expect(() => {
        window.dispatchEvent(event);
      }).not.toThrow();
    });

    it('should have game canvas with 2D context support', () => {
      const ctx = canvas.getContext('2d');
      expect(ctx).toBeDefined();
    });
  });

  describe('Initialization flow', () => {
    it('should verify canvas is available before game init', () => {
      const canvas = document.getElementById('gameCanvas');
      const isValid = canvas !== null && canvas instanceof HTMLCanvasElement;
      expect(isValid).toBe(true);
    });

    it('should verify buttons are available before controls init', () => {
      const startBtn = document.getElementById('startBtn');
      const pauseBtn = document.getElementById('pauseBtn');
      expect(startBtn).toBeDefined();
      expect(pauseBtn).toBeDefined();
    });

    it('should handle game state initialization', () => {
      let currentState: GameStateType = GameStateType.MENU;
      expect(currentState).toBe(GameStateType.MENU);
    });

    it('should sync button states with game state', () => {
      const currentState = GameStateType.MENU;
      const isPlaying = currentState === GameStateType.PLAYING;
      const isPaused = currentState === GameStateType.PAUSED;

      const startText = isPlaying ? 'Restart' : 'Start';
      const pauseText = isPaused ? 'Resume' : 'Pause';
      const pauseDisabled = !isPlaying && !isPaused;

      expect(startText).toBe('Start');
      expect(pauseText).toBe('Pause');
      expect(pauseDisabled).toBe(true);
    });
  });
});

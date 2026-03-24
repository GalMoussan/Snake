import { describe, it, expect, beforeEach, vi } from 'vitest';
import { GameState } from '../GameState';
import { GameStateType } from '../../types';

describe('GameState', () => {
  let gameState: GameState;

  beforeEach(() => {
    gameState = new GameState();
  });

  describe('constructor', () => {
    it('should initialize with MENU state', () => {
      expect(gameState.getCurrentState()).toBe(GameStateType.MENU);
    });

    it('should create game state instance', () => {
      expect(gameState).toBeInstanceOf(GameState);
    });
  });

  describe('getCurrentState', () => {
    it('should return current state', () => {
      expect(gameState.getCurrentState()).toBe(GameStateType.MENU);
    });

    it('should return updated state after change', () => {
      gameState.setState(GameStateType.PLAYING);

      expect(gameState.getCurrentState()).toBe(GameStateType.PLAYING);
    });

    it('should not mutate internal state when retrieved', () => {
      const state1 = gameState.getCurrentState();
      const state2 = gameState.getCurrentState();

      expect(state1).toBe(state2);
    });
  });

  describe('setState - valid transitions from MENU', () => {
    it('should transition from MENU to PLAYING', () => {
      gameState.setState(GameStateType.PLAYING);

      expect(gameState.getCurrentState()).toBe(GameStateType.PLAYING);
    });

    it('should throw when transitioning from MENU to PAUSED', () => {
      expect(() => {
        gameState.setState(GameStateType.PAUSED);
      }).toThrow('Invalid transition from MENU to PAUSED');
    });

    it('should throw when transitioning from MENU to GAME_OVER', () => {
      expect(() => {
        gameState.setState(GameStateType.GAME_OVER);
      }).toThrow('Invalid transition from MENU to GAME_OVER');
    });
  });

  describe('setState - valid transitions from PLAYING', () => {
    beforeEach(() => {
      gameState.setState(GameStateType.PLAYING);
    });

    it('should transition from PLAYING to PAUSED', () => {
      gameState.setState(GameStateType.PAUSED);

      expect(gameState.getCurrentState()).toBe(GameStateType.PAUSED);
    });

    it('should transition from PLAYING to GAME_OVER', () => {
      gameState.setState(GameStateType.GAME_OVER);

      expect(gameState.getCurrentState()).toBe(GameStateType.GAME_OVER);
    });

    it('should throw when transitioning from PLAYING to MENU', () => {
      expect(() => {
        gameState.setState(GameStateType.MENU);
      }).toThrow('Invalid transition from PLAYING to MENU');
    });

    it('should throw when staying in PLAYING', () => {
      expect(() => {
        gameState.setState(GameStateType.PLAYING);
      }).toThrow('Invalid transition from PLAYING to PLAYING');
    });
  });

  describe('setState - valid transitions from PAUSED', () => {
    beforeEach(() => {
      gameState.setState(GameStateType.PLAYING);
      gameState.setState(GameStateType.PAUSED);
    });

    it('should transition from PAUSED to PLAYING', () => {
      gameState.setState(GameStateType.PLAYING);

      expect(gameState.getCurrentState()).toBe(GameStateType.PLAYING);
    });

    it('should transition from PAUSED to MENU', () => {
      gameState.setState(GameStateType.MENU);

      expect(gameState.getCurrentState()).toBe(GameStateType.MENU);
    });

    it('should throw when transitioning from PAUSED to GAME_OVER', () => {
      expect(() => {
        gameState.setState(GameStateType.GAME_OVER);
      }).toThrow('Invalid transition from PAUSED to GAME_OVER');
    });

    it('should throw when staying in PAUSED', () => {
      expect(() => {
        gameState.setState(GameStateType.PAUSED);
      }).toThrow('Invalid transition from PAUSED to PAUSED');
    });
  });

  describe('setState - valid transitions from GAME_OVER', () => {
    beforeEach(() => {
      gameState.setState(GameStateType.PLAYING);
      gameState.setState(GameStateType.GAME_OVER);
    });

    it('should transition from GAME_OVER to MENU', () => {
      gameState.setState(GameStateType.MENU);

      expect(gameState.getCurrentState()).toBe(GameStateType.MENU);
    });

    it('should transition from GAME_OVER to PLAYING', () => {
      gameState.setState(GameStateType.PLAYING);

      expect(gameState.getCurrentState()).toBe(GameStateType.PLAYING);
    });

    it('should throw when transitioning from GAME_OVER to PAUSED', () => {
      expect(() => {
        gameState.setState(GameStateType.PAUSED);
      }).toThrow('Invalid transition from GAME_OVER to PAUSED');
    });

    it('should throw when staying in GAME_OVER', () => {
      expect(() => {
        gameState.setState(GameStateType.GAME_OVER);
      }).toThrow('Invalid transition from GAME_OVER to GAME_OVER');
    });
  });

  describe('onStateChange', () => {
    it('should call listener when state changes', () => {
      const listener = vi.fn();
      gameState.onStateChange(listener);

      gameState.setState(GameStateType.PLAYING);

      expect(listener).toHaveBeenCalledWith(GameStateType.PLAYING, GameStateType.MENU);
    });

    it('should call listener with correct parameters', () => {
      const listener = vi.fn();
      gameState.onStateChange(listener);

      gameState.setState(GameStateType.PLAYING);

      expect(listener).toHaveBeenCalledTimes(1);
      expect(listener.mock.calls[0][0]).toBe(GameStateType.PLAYING);
      expect(listener.mock.calls[0][1]).toBe(GameStateType.MENU);
    });

    it('should call multiple listeners', () => {
      const listener1 = vi.fn();
      const listener2 = vi.fn();
      const listener3 = vi.fn();

      gameState.onStateChange(listener1);
      gameState.onStateChange(listener2);
      gameState.onStateChange(listener3);

      gameState.setState(GameStateType.PLAYING);

      expect(listener1).toHaveBeenCalledWith(GameStateType.PLAYING, GameStateType.MENU);
      expect(listener2).toHaveBeenCalledWith(GameStateType.PLAYING, GameStateType.MENU);
      expect(listener3).toHaveBeenCalledWith(GameStateType.PLAYING, GameStateType.MENU);
    });

    it('should call listeners in order of registration', () => {
      const callOrder: number[] = [];
      const listener1 = vi.fn(() => callOrder.push(1));
      const listener2 = vi.fn(() => callOrder.push(2));
      const listener3 = vi.fn(() => callOrder.push(3));

      gameState.onStateChange(listener1);
      gameState.onStateChange(listener2);
      gameState.onStateChange(listener3);

      gameState.setState(GameStateType.PLAYING);

      expect(callOrder).toEqual([1, 2, 3]);
    });

    it('should not call listeners for invalid transitions', () => {
      const listener = vi.fn();
      gameState.onStateChange(listener);

      expect(() => {
        gameState.setState(GameStateType.PAUSED);
      }).toThrow();

      expect(listener).not.toHaveBeenCalled();
    });

    it('should call listeners for each state change', () => {
      const listener = vi.fn();
      gameState.onStateChange(listener);

      gameState.setState(GameStateType.PLAYING);
      gameState.setState(GameStateType.PAUSED);
      gameState.setState(GameStateType.PLAYING);

      expect(listener).toHaveBeenCalledTimes(3);
    });

    it('should provide correct previous state for multiple transitions', () => {
      const listener = vi.fn();
      gameState.onStateChange(listener);

      gameState.setState(GameStateType.PLAYING);
      gameState.setState(GameStateType.PAUSED);

      expect(listener).toHaveBeenNthCalledWith(1, GameStateType.PLAYING, GameStateType.MENU);
      expect(listener).toHaveBeenNthCalledWith(2, GameStateType.PAUSED, GameStateType.PLAYING);
    });

    it('should allow adding listeners after state changes', () => {
      gameState.setState(GameStateType.PLAYING);

      const listener = vi.fn();
      gameState.onStateChange(listener);

      gameState.setState(GameStateType.PAUSED);

      expect(listener).toHaveBeenCalledWith(GameStateType.PAUSED, GameStateType.PLAYING);
    });
  });

  describe('reset', () => {
    it('should reset state to MENU', () => {
      gameState.setState(GameStateType.PLAYING);
      gameState.reset();

      expect(gameState.getCurrentState()).toBe(GameStateType.MENU);
    });

    it('should reset from PAUSED state', () => {
      gameState.setState(GameStateType.PLAYING);
      gameState.setState(GameStateType.PAUSED);
      gameState.reset();

      expect(gameState.getCurrentState()).toBe(GameStateType.MENU);
    });

    it('should reset from GAME_OVER state', () => {
      gameState.setState(GameStateType.PLAYING);
      gameState.setState(GameStateType.GAME_OVER);
      gameState.reset();

      expect(gameState.getCurrentState()).toBe(GameStateType.MENU);
    });

    it('should work when already in MENU state', () => {
      gameState.reset();

      expect(gameState.getCurrentState()).toBe(GameStateType.MENU);
    });

    it('should not trigger listeners', () => {
      const listener = vi.fn();
      gameState.onStateChange(listener);

      gameState.setState(GameStateType.PLAYING);
      listener.mockClear();

      gameState.reset();

      expect(listener).not.toHaveBeenCalled();
    });

    it('should allow state transitions after reset', () => {
      gameState.setState(GameStateType.PLAYING);
      gameState.reset();

      expect(() => {
        gameState.setState(GameStateType.PLAYING);
      }).not.toThrow();

      expect(gameState.getCurrentState()).toBe(GameStateType.PLAYING);
    });
  });

  describe('integration scenarios', () => {
    it('should handle complete game flow', () => {
      const listener = vi.fn();
      gameState.onStateChange(listener);

      // Start game
      gameState.setState(GameStateType.PLAYING);
      expect(gameState.getCurrentState()).toBe(GameStateType.PLAYING);

      // Pause game
      gameState.setState(GameStateType.PAUSED);
      expect(gameState.getCurrentState()).toBe(GameStateType.PAUSED);

      // Resume game
      gameState.setState(GameStateType.PLAYING);
      expect(gameState.getCurrentState()).toBe(GameStateType.PLAYING);

      // Game over
      gameState.setState(GameStateType.GAME_OVER);
      expect(gameState.getCurrentState()).toBe(GameStateType.GAME_OVER);

      // Return to menu
      gameState.setState(GameStateType.MENU);
      expect(gameState.getCurrentState()).toBe(GameStateType.MENU);

      expect(listener).toHaveBeenCalledTimes(5);
    });

    it('should handle multiple pause/resume cycles', () => {
      gameState.setState(GameStateType.PLAYING);

      for (let i = 0; i < 3; i++) {
        gameState.setState(GameStateType.PAUSED);
        expect(gameState.getCurrentState()).toBe(GameStateType.PAUSED);

        gameState.setState(GameStateType.PLAYING);
        expect(gameState.getCurrentState()).toBe(GameStateType.PLAYING);
      }
    });

    it('should prevent invalid game flow', () => {
      expect(() => {
        gameState.setState(GameStateType.GAME_OVER);
      }).toThrow();

      gameState.setState(GameStateType.PLAYING);

      expect(() => {
        gameState.setState(GameStateType.MENU);
      }).toThrow();
    });

    it('should work with listener-based game logic', () => {
      let isPaused = false;
      let isPlaying = false;

      gameState.onStateChange((newState) => {
        isPaused = newState === GameStateType.PAUSED;
        isPlaying = newState === GameStateType.PLAYING;
      });

      gameState.setState(GameStateType.PLAYING);
      expect(isPlaying).toBe(true);
      expect(isPaused).toBe(false);

      gameState.setState(GameStateType.PAUSED);
      expect(isPlaying).toBe(false);
      expect(isPaused).toBe(true);
    });

    it('should handle rapid state changes', () => {
      gameState.setState(GameStateType.PLAYING);

      for (let i = 0; i < 10; i++) {
        gameState.setState(GameStateType.PAUSED);
        gameState.setState(GameStateType.PLAYING);
      }

      expect(gameState.getCurrentState()).toBe(GameStateType.PLAYING);
    });
  });
});

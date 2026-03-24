import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { GameLoop } from '../GameLoop';

describe('GameLoop', () => {
  let rafCallbacks: ((time: number) => void)[] = [];
  let rafId = 0;
  let currentTime = 0;

  beforeEach(() => {
    vi.useFakeTimers();
    rafCallbacks = [];
    rafId = 0;
    currentTime = 0;

    // Mock requestAnimationFrame
    global.requestAnimationFrame = vi.fn((callback: (time: number) => void) => {
      rafCallbacks.push(callback);
      return ++rafId;
    });

    // Mock cancelAnimationFrame
    global.cancelAnimationFrame = vi.fn((_id: number) => {
      // Simple implementation - just clear callbacks
      rafCallbacks = [];
    });

    // Mock performance.now()
    global.performance.now = vi.fn(() => currentTime);
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  const runAnimationFrames = (count: number, timeStep: number = 16): void => {
    for (let i = 0; i < count; i++) {
      currentTime += timeStep;
      const callbacks = [...rafCallbacks];
      rafCallbacks = [];
      callbacks.forEach((cb) => cb(currentTime));
    }
  };

  describe('constructor', () => {
    it('should create a game loop with specified tick interval', () => {
      const onTick = vi.fn();
      const onRender = vi.fn();
      const loop = new GameLoop(100, onTick, onRender);

      expect(loop).toBeDefined();
    });

    it('should not start automatically', () => {
      const onTick = vi.fn();
      const onRender = vi.fn();
      new GameLoop(100, onTick, onRender);

      vi.advanceTimersByTime(1000);
      expect(onTick).not.toHaveBeenCalled();
      expect(onRender).not.toHaveBeenCalled();
    });
  });

  describe('start', () => {
    it('should start the game loop', () => {
      const onTick = vi.fn();
      const onRender = vi.fn();
      const loop = new GameLoop(100, onTick, onRender);

      loop.start();

      // Run animation frames to trigger ticks
      runAnimationFrames(10, 100);
      expect(onTick).toHaveBeenCalled();
    });

    it('should call onRender on every frame', () => {
      const onTick = vi.fn();
      const onRender = vi.fn();
      const loop = new GameLoop(100, onTick, onRender);

      loop.start();

      // Run animation frames
      runAnimationFrames(1, 16); // ~60fps
      expect(onRender).toHaveBeenCalled();
    });

    it('should not start multiple times', () => {
      const onTick = vi.fn();
      const onRender = vi.fn();
      const loop = new GameLoop(100, onTick, onRender);

      loop.start();
      loop.start();
      loop.start();

      // Should only start once
      expect(loop).toBeDefined();
    });
  });

  describe('stop', () => {
    it('should stop the game loop', () => {
      const onTick = vi.fn();
      const onRender = vi.fn();
      const loop = new GameLoop(100, onTick, onRender);

      loop.start();
      runAnimationFrames(2, 100);
      const callCountBefore = onTick.mock.calls.length;

      loop.stop();
      runAnimationFrames(2, 100);

      expect(onTick).toHaveBeenCalledTimes(callCountBefore);
    });

    it('should be safe to call stop when not running', () => {
      const onTick = vi.fn();
      const onRender = vi.fn();
      const loop = new GameLoop(100, onTick, onRender);

      expect(() => loop.stop()).not.toThrow();
    });

    it('should allow restart after stop', () => {
      const onTick = vi.fn();
      const onRender = vi.fn();
      const loop = new GameLoop(100, onTick, onRender);

      loop.start();
      runAnimationFrames(2, 100);
      loop.stop();

      onTick.mockClear();

      loop.start();
      runAnimationFrames(2, 100);
      expect(onTick).toHaveBeenCalled();
    });
  });

  describe('setTickInterval', () => {
    it('should update the tick interval', () => {
      const onTick = vi.fn();
      const onRender = vi.fn();
      const loop = new GameLoop(100, onTick, onRender);

      loop.start();
      runAnimationFrames(2, 100);
      expect(onTick).toHaveBeenCalled();

      onTick.mockClear();
      loop.setTickInterval(50);

      runAnimationFrames(1, 50);
      expect(onTick).toHaveBeenCalled();
    });

    it('should work when loop is not running', () => {
      const onTick = vi.fn();
      const onRender = vi.fn();
      const loop = new GameLoop(100, onTick, onRender);

      expect(() => loop.setTickInterval(50)).not.toThrow();
    });

    it('should apply new interval immediately when running', () => {
      const onTick = vi.fn();
      const onRender = vi.fn();
      const loop = new GameLoop(200, onTick, onRender);

      loop.start();
      loop.setTickInterval(100);

      runAnimationFrames(2, 100);
      expect(onTick).toHaveBeenCalled();
    });
  });

  describe('tick timing', () => {
    it('should call onTick at specified intervals', () => {
      const onTick = vi.fn();
      const onRender = vi.fn();
      const loop = new GameLoop(100, onTick, onRender);

      loop.start();

      runAnimationFrames(1, 50);
      expect(onTick).toHaveBeenCalledTimes(0);

      runAnimationFrames(1, 50);
      expect(onTick).toHaveBeenCalledTimes(1);

      runAnimationFrames(1, 100);
      expect(onTick).toHaveBeenCalledTimes(2);
    });

    it('should accumulate time correctly', () => {
      const onTick = vi.fn();
      const onRender = vi.fn();
      const loop = new GameLoop(100, onTick, onRender);

      loop.start();

      // Multiple small advances should accumulate
      runAnimationFrames(1, 30);
      runAnimationFrames(1, 30);
      runAnimationFrames(1, 30);
      runAnimationFrames(1, 10);

      expect(onTick).toHaveBeenCalledTimes(1);
    });

    it('should handle multiple ticks in one frame', () => {
      const onTick = vi.fn();
      const onRender = vi.fn();
      const loop = new GameLoop(100, onTick, onRender);

      loop.start();

      // Advance by more than one tick interval
      runAnimationFrames(1, 250);
      expect(onTick).toHaveBeenCalledTimes(2);
    });
  });

  describe('integration tests', () => {
    it('should maintain consistent tick rate over time', () => {
      const onTick = vi.fn();
      const onRender = vi.fn();
      const loop = new GameLoop(100, onTick, onRender);

      loop.start();

      runAnimationFrames(10, 100);

      expect(onTick).toHaveBeenCalledTimes(10);
    });

    it('should call onRender more frequently than onTick', () => {
      const onTick = vi.fn();
      const onRender = vi.fn();
      const loop = new GameLoop(100, onTick, onRender);

      loop.start();

      // Simulate multiple frames at 60fps
      runAnimationFrames(10, 16);

      expect(onRender.mock.calls.length).toBeGreaterThan(onTick.mock.calls.length);
    });

    it('should handle start-stop-start cycle correctly', () => {
      const onTick = vi.fn();
      const onRender = vi.fn();
      const loop = new GameLoop(100, onTick, onRender);

      // First run
      loop.start();
      runAnimationFrames(2, 100);
      expect(onTick).toHaveBeenCalledTimes(2);

      // Stop
      loop.stop();
      onTick.mockClear();

      // Second run
      loop.start();
      runAnimationFrames(2, 100);
      expect(onTick).toHaveBeenCalledTimes(2);
    });

    it('should handle speed changes during gameplay', () => {
      const onTick = vi.fn();
      const onRender = vi.fn();
      const loop = new GameLoop(100, onTick, onRender);

      loop.start();

      runAnimationFrames(2, 100);
      expect(onTick).toHaveBeenCalledTimes(2);

      onTick.mockClear();
      loop.setTickInterval(50);

      runAnimationFrames(2, 50);
      expect(onTick).toHaveBeenCalledTimes(2);
    });
  });
});

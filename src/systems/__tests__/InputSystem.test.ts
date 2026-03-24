import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { InputSystem } from '../InputSystem';
import { Direction } from '../../types';

describe('InputSystem', () => {
  let inputSystem: InputSystem;
  let directionCallback: ReturnType<typeof vi.fn>;
  let pauseCallback: ReturnType<typeof vi.fn>;

  beforeEach(() => {
    inputSystem = new InputSystem();
    directionCallback = vi.fn();
    pauseCallback = vi.fn();
  });

  afterEach(() => {
    inputSystem.destroy();
  });

  describe('init', () => {
    it('should register keyboard event listener', () => {
      const addEventListenerSpy = vi.spyOn(document, 'addEventListener');
      inputSystem.init(directionCallback, pauseCallback);

      expect(addEventListenerSpy).toHaveBeenCalledWith('keydown', expect.any(Function));
    });

    it('should not throw when initialized', () => {
      expect(() => {
        inputSystem.init(directionCallback, pauseCallback);
      }).not.toThrow();
    });
  });

  describe('destroy', () => {
    it('should remove keyboard event listener', () => {
      const removeEventListenerSpy = vi.spyOn(document, 'removeEventListener');
      inputSystem.init(directionCallback, pauseCallback);
      inputSystem.destroy();

      expect(removeEventListenerSpy).toHaveBeenCalledWith('keydown', expect.any(Function));
    });

    it('should not respond to keyboard after destroy', () => {
      inputSystem.init(directionCallback, pauseCallback);
      inputSystem.destroy();

      const event = new KeyboardEvent('keydown', { key: 'ArrowUp' });
      document.dispatchEvent(event);

      expect(directionCallback).not.toHaveBeenCalled();
    });
  });

  describe('arrow key handling', () => {
    beforeEach(() => {
      inputSystem.init(directionCallback, pauseCallback);
    });

    it('should call direction callback with UP for ArrowUp', () => {
      const event = new KeyboardEvent('keydown', { key: 'ArrowUp' });
      document.dispatchEvent(event);

      expect(directionCallback).toHaveBeenCalledWith(Direction.UP);
      expect(directionCallback).toHaveBeenCalledTimes(1);
    });

    it('should call direction callback with DOWN for ArrowDown', () => {
      const event = new KeyboardEvent('keydown', { key: 'ArrowDown' });
      document.dispatchEvent(event);

      expect(directionCallback).toHaveBeenCalledWith(Direction.DOWN);
    });

    it('should call direction callback with LEFT for ArrowLeft', () => {
      const event = new KeyboardEvent('keydown', { key: 'ArrowLeft' });
      document.dispatchEvent(event);

      expect(directionCallback).toHaveBeenCalledWith(Direction.LEFT);
    });

    it('should call direction callback with RIGHT for ArrowRight', () => {
      const event = new KeyboardEvent('keydown', { key: 'ArrowRight' });
      document.dispatchEvent(event);

      expect(directionCallback).toHaveBeenCalledWith(Direction.RIGHT);
    });

    it('should prevent default for arrow keys', () => {
      const event = new KeyboardEvent('keydown', { key: 'ArrowUp' });
      const preventDefaultSpy = vi.spyOn(event, 'preventDefault');

      document.dispatchEvent(event);

      expect(preventDefaultSpy).toHaveBeenCalled();
    });
  });

  describe('WASD key handling', () => {
    beforeEach(() => {
      inputSystem.init(directionCallback, pauseCallback);
    });

    it('should call direction callback with UP for w key', () => {
      const event = new KeyboardEvent('keydown', { key: 'w' });
      document.dispatchEvent(event);

      expect(directionCallback).toHaveBeenCalledWith(Direction.UP);
    });

    it('should call direction callback with UP for W key', () => {
      const event = new KeyboardEvent('keydown', { key: 'W' });
      document.dispatchEvent(event);

      expect(directionCallback).toHaveBeenCalledWith(Direction.UP);
    });

    it('should call direction callback with DOWN for s key', () => {
      const event = new KeyboardEvent('keydown', { key: 's' });
      document.dispatchEvent(event);

      expect(directionCallback).toHaveBeenCalledWith(Direction.DOWN);
    });

    it('should call direction callback with DOWN for S key', () => {
      const event = new KeyboardEvent('keydown', { key: 'S' });
      document.dispatchEvent(event);

      expect(directionCallback).toHaveBeenCalledWith(Direction.DOWN);
    });

    it('should call direction callback with LEFT for a key', () => {
      const event = new KeyboardEvent('keydown', { key: 'a' });
      document.dispatchEvent(event);

      expect(directionCallback).toHaveBeenCalledWith(Direction.LEFT);
    });

    it('should call direction callback with LEFT for A key', () => {
      const event = new KeyboardEvent('keydown', { key: 'A' });
      document.dispatchEvent(event);

      expect(directionCallback).toHaveBeenCalledWith(Direction.LEFT);
    });

    it('should call direction callback with RIGHT for d key', () => {
      const event = new KeyboardEvent('keydown', { key: 'd' });
      document.dispatchEvent(event);

      expect(directionCallback).toHaveBeenCalledWith(Direction.RIGHT);
    });

    it('should call direction callback with RIGHT for D key', () => {
      const event = new KeyboardEvent('keydown', { key: 'D' });
      document.dispatchEvent(event);

      expect(directionCallback).toHaveBeenCalledWith(Direction.RIGHT);
    });
  });

  describe('pause key handling', () => {
    beforeEach(() => {
      inputSystem.init(directionCallback, pauseCallback);
    });

    it('should call pause callback for space key', () => {
      const event = new KeyboardEvent('keydown', { key: ' ' });
      document.dispatchEvent(event);

      expect(pauseCallback).toHaveBeenCalledTimes(1);
      expect(directionCallback).not.toHaveBeenCalled();
    });

    it('should call pause callback for Escape key', () => {
      const event = new KeyboardEvent('keydown', { key: 'Escape' });
      document.dispatchEvent(event);

      expect(pauseCallback).toHaveBeenCalledTimes(1);
      expect(directionCallback).not.toHaveBeenCalled();
    });

    it('should prevent default for pause keys', () => {
      const event = new KeyboardEvent('keydown', { key: ' ' });
      const preventDefaultSpy = vi.spyOn(event, 'preventDefault');

      document.dispatchEvent(event);

      expect(preventDefaultSpy).toHaveBeenCalled();
    });
  });

  describe('unrecognized keys', () => {
    beforeEach(() => {
      inputSystem.init(directionCallback, pauseCallback);
    });

    it('should not call callbacks for unrecognized keys', () => {
      const event = new KeyboardEvent('keydown', { key: 'x' });
      document.dispatchEvent(event);

      expect(directionCallback).not.toHaveBeenCalled();
      expect(pauseCallback).not.toHaveBeenCalled();
    });

    it('should not prevent default for unrecognized keys', () => {
      const event = new KeyboardEvent('keydown', { key: 'x' });
      const preventDefaultSpy = vi.spyOn(event, 'preventDefault');

      document.dispatchEvent(event);

      expect(preventDefaultSpy).not.toHaveBeenCalled();
    });

    it('should ignore number keys', () => {
      const event = new KeyboardEvent('keydown', { key: '1' });
      document.dispatchEvent(event);

      expect(directionCallback).not.toHaveBeenCalled();
      expect(pauseCallback).not.toHaveBeenCalled();
    });

    it('should ignore Enter key', () => {
      const event = new KeyboardEvent('keydown', { key: 'Enter' });
      document.dispatchEvent(event);

      expect(directionCallback).not.toHaveBeenCalled();
      expect(pauseCallback).not.toHaveBeenCalled();
    });
  });

  describe('multiple key presses', () => {
    beforeEach(() => {
      inputSystem.init(directionCallback, pauseCallback);
    });

    it('should handle rapid direction changes', () => {
      document.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowUp' }));
      document.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowRight' }));
      document.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowDown' }));

      expect(directionCallback).toHaveBeenCalledTimes(3);
      expect(directionCallback).toHaveBeenNthCalledWith(1, Direction.UP);
      expect(directionCallback).toHaveBeenNthCalledWith(2, Direction.RIGHT);
      expect(directionCallback).toHaveBeenNthCalledWith(3, Direction.DOWN);
    });

    it('should handle mixed arrow and WASD keys', () => {
      document.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowUp' }));
      document.dispatchEvent(new KeyboardEvent('keydown', { key: 'd' }));

      expect(directionCallback).toHaveBeenCalledTimes(2);
      expect(directionCallback).toHaveBeenNthCalledWith(1, Direction.UP);
      expect(directionCallback).toHaveBeenNthCalledWith(2, Direction.RIGHT);
    });

    it('should handle direction and pause keys together', () => {
      document.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowUp' }));
      document.dispatchEvent(new KeyboardEvent('keydown', { key: ' ' }));

      expect(directionCallback).toHaveBeenCalledTimes(1);
      expect(pauseCallback).toHaveBeenCalledTimes(1);
    });
  });

  describe('re-initialization', () => {
    it('should handle destroy and re-init', () => {
      inputSystem.init(directionCallback, pauseCallback);
      inputSystem.destroy();

      const newDirectionCallback = vi.fn();
      const newPauseCallback = vi.fn();
      inputSystem.init(newDirectionCallback, newPauseCallback);

      const event = new KeyboardEvent('keydown', { key: 'ArrowUp' });
      document.dispatchEvent(event);

      expect(newDirectionCallback).toHaveBeenCalledWith(Direction.UP);
      expect(directionCallback).not.toHaveBeenCalled();
    });
  });

  describe('callback edge cases', () => {
    it('should not throw if callbacks are not set', () => {
      const system = new InputSystem();

      expect(() => {
        const event = new KeyboardEvent('keydown', { key: 'ArrowUp' });
        document.dispatchEvent(event);
      }).not.toThrow();

      system.destroy();
    });

    it('should work with different callback instances', () => {
      const callback1 = vi.fn();
      const callback2 = vi.fn();

      inputSystem.init(callback1, callback2);

      document.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowUp' }));
      document.dispatchEvent(new KeyboardEvent('keydown', { key: ' ' }));

      expect(callback1).toHaveBeenCalledTimes(1);
      expect(callback2).toHaveBeenCalledTimes(1);
    });
  });
});

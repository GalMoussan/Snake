import { describe, it, expect, beforeEach, vi } from 'vitest';
import { Controls } from '../Controls';

describe('Controls', () => {
  let startButton: HTMLButtonElement;
  let pauseButton: HTMLButtonElement;
  let onStartCallback: ReturnType<typeof vi.fn>;
  let onPauseCallback: ReturnType<typeof vi.fn>;
  let controls: Controls;

  beforeEach(() => {
    // Setup DOM elements
    document.body.innerHTML = `
      <button id="startBtn">Start</button>
      <button id="pauseBtn">Pause</button>
    `;

    startButton = document.getElementById('startBtn') as HTMLButtonElement;
    pauseButton = document.getElementById('pauseBtn') as HTMLButtonElement;

    onStartCallback = vi.fn();
    onPauseCallback = vi.fn();

    controls = new Controls(onStartCallback, onPauseCallback);
  });

  describe('constructor and setupListeners', () => {
    it('should find the start and pause buttons', () => {
      expect(startButton).toBeDefined();
      expect(pauseButton).toBeDefined();
    });

    it('should attach click listeners to buttons', () => {
      startButton.click();
      expect(onStartCallback).toHaveBeenCalledTimes(1);

      pauseButton.click();
      expect(onPauseCallback).toHaveBeenCalledTimes(1);
    });

    it('should handle missing buttons gracefully', () => {
      document.body.innerHTML = '';
      expect(() => {
        new Controls(vi.fn(), vi.fn());
      }).not.toThrow();
    });
  });

  describe('updateButtonStates', () => {
    it('should set Start text when not playing', () => {
      controls.updateButtonStates(false, false);
      expect(startButton.textContent).toBe('Start');
    });

    it('should set Restart text when playing', () => {
      controls.updateButtonStates(true, false);
      expect(startButton.textContent).toBe('Restart');
    });

    it('should set Pause text when not paused', () => {
      controls.updateButtonStates(true, false);
      expect(pauseButton.textContent).toBe('Pause');
    });

    it('should set Resume text when paused', () => {
      controls.updateButtonStates(true, true);
      expect(pauseButton.textContent).toBe('Resume');
    });

    it('should disable pause button when not playing and not paused', () => {
      controls.updateButtonStates(false, false);
      expect(pauseButton.disabled).toBe(true);
    });

    it('should enable pause button when playing', () => {
      controls.updateButtonStates(true, false);
      expect(pauseButton.disabled).toBe(false);
    });

    it('should enable pause button when paused', () => {
      controls.updateButtonStates(true, true);
      expect(pauseButton.disabled).toBe(false);
    });

    it('should disable pause button when not playing and not paused (after state change)', () => {
      controls.updateButtonStates(true, false);
      expect(pauseButton.disabled).toBe(false);

      controls.updateButtonStates(false, false);
      expect(pauseButton.disabled).toBe(true);
    });

    it('should handle missing buttons without throwing', () => {
      document.body.innerHTML = '';
      controls = new Controls(vi.fn(), vi.fn());
      expect(() => {
        controls.updateButtonStates(true, false);
      }).not.toThrow();
    });
  });

  describe('destroy', () => {
    it('should remove click event listeners', () => {
      controls.destroy();

      startButton.click();
      expect(onStartCallback).not.toHaveBeenCalled();

      pauseButton.click();
      expect(onPauseCallback).not.toHaveBeenCalled();
    });

    it('should handle missing buttons gracefully', () => {
      document.body.innerHTML = '';
      controls = new Controls(vi.fn(), vi.fn());
      expect(() => {
        controls.destroy();
      }).not.toThrow();
    });

    it('should prevent callbacks after destroy', () => {
      controls.destroy();
      startButton.click();
      pauseButton.click();

      expect(onStartCallback).not.toHaveBeenCalled();
      expect(onPauseCallback).not.toHaveBeenCalled();
    });
  });

  describe('integration scenarios', () => {
    it('should handle full lifecycle: create, update, click, destroy', () => {
      controls.updateButtonStates(false, false);
      expect(startButton.textContent).toBe('Start');

      startButton.click();
      expect(onStartCallback).toHaveBeenCalledTimes(1);

      controls.updateButtonStates(true, false);
      expect(startButton.textContent).toBe('Restart');
      expect(pauseButton.disabled).toBe(false);

      pauseButton.click();
      expect(onPauseCallback).toHaveBeenCalledTimes(1);

      controls.destroy();
      startButton.click();
      pauseButton.click();

      expect(onStartCallback).toHaveBeenCalledTimes(1);
      expect(onPauseCallback).toHaveBeenCalledTimes(1);
    });

    it('should handle rapid state changes', () => {
      for (let i = 0; i < 5; i++) {
        controls.updateButtonStates(true, false);
        expect(startButton.textContent).toBe('Restart');
        controls.updateButtonStates(true, true);
        expect(pauseButton.textContent).toBe('Resume');
        controls.updateButtonStates(false, false);
        expect(startButton.textContent).toBe('Start');
      }
    });

    it('should handle all valid state combinations', () => {
      // MENU/GAME_OVER state: isPlaying=false, isPaused=false
      controls.updateButtonStates(false, false);
      expect(startButton.textContent).toBe('Start');
      expect(pauseButton.textContent).toBe('Pause');
      expect(pauseButton.disabled).toBe(true);

      // PLAYING state: isPlaying=true, isPaused=false
      controls.updateButtonStates(true, false);
      expect(startButton.textContent).toBe('Restart');
      expect(pauseButton.textContent).toBe('Pause');
      expect(pauseButton.disabled).toBe(false);

      // PAUSED state: isPlaying=true, isPaused=true
      controls.updateButtonStates(true, true);
      expect(startButton.textContent).toBe('Restart');
      expect(pauseButton.textContent).toBe('Resume');
      expect(pauseButton.disabled).toBe(false);
    });
  });
});

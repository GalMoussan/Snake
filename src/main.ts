import { Game } from './core/Game';
import { Controls } from './ui/Controls';
import { GameStateType } from './types';
import './style.css';

document.addEventListener('DOMContentLoaded', () => {
  const canvas = document.getElementById('gameCanvas') as HTMLCanvasElement;
  if (!canvas) {
    throw new Error('Canvas element not found');
  }

  const game = new Game(canvas);

  const controls = new Controls(
    () => {
      // Handle start/restart
      const state = game.getGameState().getCurrentState();
      if (state === GameStateType.MENU || state === GameStateType.GAME_OVER) {
        game.getGameState().setState(GameStateType.PLAYING);
      } else if (state === GameStateType.PLAYING || state === GameStateType.PAUSED) {
        // Restart - go to game over then back to playing (this will reset the game)
        game.getGameState().setState(GameStateType.GAME_OVER);
        // Small delay to ensure state machine processes the transition
        requestAnimationFrame(() => {
          game.getGameState().setState(GameStateType.PLAYING);
        });
      }
      updateButtonStates();
    },
    () => {
      // Handle pause/resume
      const state = game.getGameState().getCurrentState();
      if (state === GameStateType.PLAYING) {
        game.getGameState().setState(GameStateType.PAUSED);
      } else if (state === GameStateType.PAUSED) {
        game.getGameState().setState(GameStateType.PLAYING);
      }
      updateButtonStates();
    }
  );

  function updateButtonStates(): void {
    const state = game.getGameState().getCurrentState();
    const isPlaying = state === GameStateType.PLAYING;
    const isPaused = state === GameStateType.PAUSED;
    controls.updateButtonStates(isPlaying, isPaused);
  }

  // Listen to game state changes
  game.getGameState().onStateChange(() => {
    updateButtonStates();
  });

  game.init();
  updateButtonStates();

  // Cleanup on page unload
  window.addEventListener('beforeunload', () => {
    game.destroy();
    controls.destroy();
  });
});

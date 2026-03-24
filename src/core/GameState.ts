import { GameStateType } from '../types';

type StateChangeCallback = (newState: GameStateType, previousState: GameStateType) => void;

export class GameState {
  private state: GameStateType = GameStateType.MENU;
  private listeners: StateChangeCallback[] = [];

  getCurrentState(): GameStateType {
    return this.state;
  }

  setState(newState: GameStateType): void {
    const validTransitions: Record<GameStateType, GameStateType[]> = {
      [GameStateType.MENU]: [GameStateType.PLAYING],
      [GameStateType.PLAYING]: [GameStateType.PAUSED, GameStateType.GAME_OVER],
      [GameStateType.PAUSED]: [GameStateType.PLAYING, GameStateType.MENU],
      [GameStateType.GAME_OVER]: [GameStateType.MENU, GameStateType.PLAYING],
    };

    if (!validTransitions[this.state].includes(newState)) {
      throw new Error(`Invalid transition from ${this.state} to ${newState}`);
    }

    const previousState = this.state;
    this.state = newState;
    this.listeners.forEach((cb) => cb(newState, previousState));
  }

  onStateChange(callback: StateChangeCallback): () => void {
    this.listeners.push(callback);
    return () => {
      const index = this.listeners.indexOf(callback);
      if (index > -1) {
        this.listeners.splice(index, 1);
      }
    };
  }

  reset(): void {
    this.state = GameStateType.MENU;
  }
}

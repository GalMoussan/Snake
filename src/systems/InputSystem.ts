import { Direction } from '../types';

type DirectionCallback = (direction: Direction) => void;

export class InputSystem {
  private keyMap: Map<string, Direction> = new Map([
    ['ArrowUp', Direction.UP],
    ['w', Direction.UP],
    ['W', Direction.UP],
    ['ArrowDown', Direction.DOWN],
    ['s', Direction.DOWN],
    ['S', Direction.DOWN],
    ['ArrowLeft', Direction.LEFT],
    ['a', Direction.LEFT],
    ['A', Direction.LEFT],
    ['ArrowRight', Direction.RIGHT],
    ['d', Direction.RIGHT],
    ['D', Direction.RIGHT],
  ]);
  private onDirection: DirectionCallback | null = null;
  private onPause: (() => void) | null = null;
  private handleKeyDown: (event: KeyboardEvent) => void;

  constructor() {
    this.handleKeyDown = this.createKeyDownHandler();
  }

  init(onDirection: DirectionCallback, onPause: () => void): void {
    this.onDirection = onDirection;
    this.onPause = onPause;
    document.addEventListener('keydown', this.handleKeyDown);
  }

  destroy(): void {
    document.removeEventListener('keydown', this.handleKeyDown);
  }

  private createKeyDownHandler(): (event: KeyboardEvent) => void {
    return (event: KeyboardEvent): void => {
      const direction = this.keyMap.get(event.key);
      if (direction && this.onDirection) {
        event.preventDefault();
        this.onDirection(direction);
      }
      if ((event.key === ' ' || event.key === 'Escape') && this.onPause) {
        event.preventDefault();
        this.onPause();
      }
    };
  }
}

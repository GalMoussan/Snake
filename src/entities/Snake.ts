import { Vec2 } from '../utils/Vector2D';
import { Direction } from '../types';

export class Snake {
  private body: Vec2[];
  private direction: Direction;
  private nextDirection: Direction;
  private hasEaten: boolean = false;

  constructor(startPosition: Vec2, initialDirection: Direction = Direction.RIGHT) {
    this.body = [startPosition, startPosition.add(Vec2.fromDirection(Direction.LEFT))];
    this.direction = initialDirection;
    this.nextDirection = initialDirection;
  }

  move(): void {
    this.direction = this.nextDirection;
    const currentHead = this.body[0];
    if (!currentHead) return;
    const newHead = currentHead.add(Vec2.fromDirection(this.direction));
    this.body = [newHead, ...this.body.slice(0, this.hasEaten ? undefined : -1)];
    this.hasEaten = false;
  }

  grow(): void {
    this.hasEaten = true;
  }

  changeDirection(newDir: Direction): void {
    const opposite: Record<Direction, Direction> = {
      [Direction.UP]: Direction.DOWN,
      [Direction.DOWN]: Direction.UP,
      [Direction.LEFT]: Direction.RIGHT,
      [Direction.RIGHT]: Direction.LEFT,
    };

    if (opposite[newDir] !== this.direction) {
      this.nextDirection = newDir;
    }
  }

  checkSelfCollision(): boolean {
    const head = this.body[0];
    if (!head) return false;
    return this.body.slice(1).some((segment) => segment.equals(head));
  }

  getHead(): Vec2 {
    const head = this.body[0];
    if (!head) throw new Error('Snake has no head');
    return head;
  }

  getBody(): ReadonlyArray<Vec2> {
    return [...this.body];
  }

  getDirection(): Direction {
    return this.direction;
  }
}

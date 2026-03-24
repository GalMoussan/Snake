import { Direction } from '../types';

export class Vec2 {
  constructor(
    public readonly x: number,
    public readonly y: number
  ) {}

  equals(other: Vec2): boolean {
    return this.x === other.x && this.y === other.y;
  }

  add(other: Vec2): Vec2 {
    return new Vec2(this.x + other.x, this.y + other.y);
  }

  copy(): Vec2 {
    return new Vec2(this.x, this.y);
  }

  static fromDirection(dir: Direction): Vec2 {
    switch (dir) {
      case Direction.UP:
        return new Vec2(0, -1);
      case Direction.DOWN:
        return new Vec2(0, 1);
      case Direction.LEFT:
        return new Vec2(-1, 0);
      case Direction.RIGHT:
        return new Vec2(1, 0);
    }
  }
}

import { Vec2 } from '../utils/Vector2D';

export class Grid {
  constructor(
    public readonly width: number,
    public readonly height: number,
    public readonly cellSize: number
  ) {}

  isWithinBounds(pos: Vec2): boolean {
    return pos.x >= 0 && pos.x < this.width && pos.y >= 0 && pos.y < this.height;
  }

  getRandomPosition(exclude: Vec2[] = []): Vec2 {
    let position: Vec2;
    let attempts = 0;
    const maxAttempts = 1000;

    do {
      const x = Math.floor(Math.random() * this.width);
      const y = Math.floor(Math.random() * this.height);
      position = new Vec2(x, y);
      attempts++;

      if (attempts >= maxAttempts) {
        // Fallback: find first available position
        for (let y = 0; y < this.height; y++) {
          for (let x = 0; x < this.width; x++) {
            const candidate = new Vec2(x, y);
            if (!exclude.some((e) => e.equals(candidate))) {
              return candidate;
            }
          }
        }
        // If all positions are excluded (shouldn't happen in normal gameplay)
        return position;
      }
    } while (exclude.some((e) => e.equals(position)));

    return position;
  }

  toPixel(pos: Vec2): { x: number; y: number } {
    return {
      x: pos.x * this.cellSize,
      y: pos.y * this.cellSize,
    };
  }
}

import { Vec2 } from '../utils/Vector2D';
import { Grid } from '../core/Grid';

export class Food {
  private position: Vec2;

  constructor(grid: Grid, excludePositions: Vec2[] = []) {
    this.position = grid.getRandomPosition(excludePositions);
  }

  spawn(grid: Grid, excludePositions: Vec2[]): void {
    this.position = grid.getRandomPosition(excludePositions);
  }

  getPosition(): Vec2 {
    return this.position;
  }
}

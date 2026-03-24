import { Vec2 } from '../utils/Vector2D';
import { Grid } from '../core/Grid';
import { Snake } from '../entities/Snake';
import { Food } from '../entities/Food';

export class CollisionSystem {
  constructor(private readonly grid: Grid) {}

  checkWallCollision(position: Vec2): boolean {
    return !this.grid.isWithinBounds(position);
  }

  checkSelfCollision(snake: Snake): boolean {
    return snake.checkSelfCollision();
  }

  checkFoodCollision(snakeHead: Vec2, food: Food): boolean {
    return snakeHead.equals(food.getPosition());
  }
}

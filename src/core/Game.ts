import { Grid } from './Grid';
import { GameLoop } from './GameLoop';
import { GameState } from './GameState';
import { Snake } from '../entities/Snake';
import { Food } from '../entities/Food';
import { InputSystem } from '../systems/InputSystem';
import { CollisionSystem } from '../systems/CollisionSystem';
import { RenderSystem } from '../systems/RenderSystem';
import { ScoreSystem } from '../systems/ScoreSystem';
import { Storage } from '../utils/Storage';
import { Vec2 } from '../utils/Vector2D';
import { Direction, GameStateType } from '../types';
import { GRID, GAME } from '../utils/Constants';

export class Game {
  private readonly grid: Grid;
  private readonly gameLoop: GameLoop;
  private readonly gameState: GameState;
  private readonly inputSystem: InputSystem;
  private readonly collisionSystem: CollisionSystem;
  private readonly renderSystem: RenderSystem;
  private readonly scoreSystem: ScoreSystem;

  private snake!: Snake;
  private food!: Food;
  private tickInterval: number = GAME.INITIAL_SPEED;

  constructor(canvas: HTMLCanvasElement) {
    this.grid = new Grid(GRID.WIDTH, GRID.HEIGHT, GRID.CELL_SIZE);
    this.gameState = new GameState();
    this.inputSystem = new InputSystem();
    this.collisionSystem = new CollisionSystem(this.grid);
    this.renderSystem = new RenderSystem(canvas, this.grid);
    this.scoreSystem = new ScoreSystem(new Storage());
    this.gameLoop = new GameLoop(
      this.tickInterval,
      this.update.bind(this),
      this.render.bind(this)
    );

    this.initEntities();
    this.setupInput();
    this.setupStateHandlers();
  }

  private initEntities(): void {
    const startPos = new Vec2(
      Math.floor(GRID.WIDTH / 2),
      Math.floor(GRID.HEIGHT / 2)
    );
    this.snake = new Snake(startPos);
    this.food = new Food(this.grid, this.snake.getBody() as Vec2[]);
  }

  private setupInput(): void {
    this.inputSystem.init(
      (direction: Direction) => {
        if (this.gameState.getCurrentState() === GameStateType.PLAYING) {
          this.snake.changeDirection(direction);
        }
      },
      () => this.handlePauseToggle()
    );
  }

  private setupStateHandlers(): void {
    this.gameState.onStateChange((newState, prevState) => {
      if (newState === GameStateType.PLAYING && prevState === GameStateType.MENU) {
        this.resetGame();
        this.gameLoop.start();
      } else if (newState === GameStateType.PLAYING && prevState === GameStateType.GAME_OVER) {
        this.resetGame();
        this.gameLoop.start();
      } else if (newState === GameStateType.PLAYING && prevState === GameStateType.PAUSED) {
        this.gameLoop.start();
      } else if (newState === GameStateType.PAUSED) {
        this.gameLoop.stop();
      } else if (newState === GameStateType.GAME_OVER) {
        this.gameLoop.stop();
      }
    });
  }

  private handlePauseToggle(): void {
    const state = this.gameState.getCurrentState();
    if (state === GameStateType.MENU || state === GameStateType.GAME_OVER) {
      this.gameState.setState(GameStateType.PLAYING);
    } else if (state === GameStateType.PLAYING) {
      this.gameState.setState(GameStateType.PAUSED);
    } else if (state === GameStateType.PAUSED) {
      this.gameState.setState(GameStateType.PLAYING);
    }
  }

  private resetGame(): void {
    this.initEntities();
    this.scoreSystem.reset();
    this.tickInterval = GAME.INITIAL_SPEED;
    this.gameLoop.setTickInterval(this.tickInterval);
  }

  private update(): void {
    if (this.gameState.getCurrentState() !== GameStateType.PLAYING) return;

    this.snake.move();
    const head = this.snake.getHead();

    // Check collisions
    if (
      this.collisionSystem.checkWallCollision(head) ||
      this.collisionSystem.checkSelfCollision(this.snake)
    ) {
      this.gameState.setState(GameStateType.GAME_OVER);
      return;
    }

    // Check food collision
    if (this.collisionSystem.checkFoodCollision(head, this.food)) {
      this.snake.grow();
      this.scoreSystem.addPoints(GAME.POINTS_PER_FOOD);
      this.food.spawn(this.grid, this.snake.getBody() as Vec2[]);

      // Increase speed
      this.tickInterval = Math.max(50, this.tickInterval - GAME.SPEED_INCREASE);
      this.gameLoop.setTickInterval(this.tickInterval);
    }
  }

  private render(): void {
    const state = this.gameState.getCurrentState();

    if (state === GameStateType.MENU) {
      this.renderSystem.drawStartScreen();
    } else if (state === GameStateType.PLAYING || state === GameStateType.PAUSED) {
      this.renderSystem.clear();
      this.renderSystem.drawGrid();
      this.renderSystem.drawFood(this.food);
      this.renderSystem.drawSnake(this.snake);
      this.renderSystem.drawScore(
        this.scoreSystem.getScore(),
        this.scoreSystem.getHighScore()
      );

      if (state === GameStateType.PAUSED) {
        this.renderSystem.drawPaused();
      }
    } else if (state === GameStateType.GAME_OVER) {
      this.renderSystem.clear();
      this.renderSystem.drawGrid();
      this.renderSystem.drawFood(this.food);
      this.renderSystem.drawSnake(this.snake);
      this.renderSystem.drawGameOver(this.scoreSystem.getScore());
    }
  }

  init(): void {
    this.render(); // Initial render to show start screen
  }

  destroy(): void {
    this.gameLoop.stop();
    this.inputSystem.destroy();
  }

  getGameState(): GameState {
    return this.gameState;
  }

  getScore(): number {
    return this.scoreSystem.getScore();
  }

  getHighScore(): number {
    return this.scoreSystem.getHighScore();
  }
}

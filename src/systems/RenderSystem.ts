import { Grid } from '../core/Grid';
import { Snake } from '../entities/Snake';
import { Food } from '../entities/Food';
import { Direction } from '../types';
import { COLORS } from '../utils/Constants';

export class RenderSystem {
  private ctx: CanvasRenderingContext2D;
  private animationFrame: number = 0;

  constructor(
    private readonly canvas: HTMLCanvasElement,
    private readonly grid: Grid
  ) {
    const context = canvas.getContext('2d');
    if (!context) throw new Error('Failed to get canvas context');
    this.ctx = context;
  }

  clear(): void {
    this.ctx.fillStyle = COLORS.BACKGROUND;
    this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
  }

  drawGrid(): void {
    this.ctx.strokeStyle = COLORS.GRID_LINES;
    this.ctx.lineWidth = 0.5;

    // Draw cell borders
    for (let x = 0; x < this.grid.width; x++) {
      for (let y = 0; y < this.grid.height; y++) {
        const pixelX = x * this.grid.cellSize;
        const pixelY = y * this.grid.cellSize;
        this.ctx.strokeRect(pixelX, pixelY, this.grid.cellSize, this.grid.cellSize);
      }
    }
  }

  drawSnake(snake: Snake): void {
    const body = snake.getBody();
    const direction = snake.getDirection();

    body.forEach((segment, index) => {
      const { x, y } = this.grid.toPixel(segment);
      const padding = 2;
      const size = this.grid.cellSize - padding * 2;
      const cornerRadius = 4;

      if (index === 0) {
        // Draw head with gradient and shadow
        this.ctx.save();
        this.ctx.shadowColor = 'rgba(76, 175, 80, 0.5)';
        this.ctx.shadowBlur = 8;

        const gradient = this.ctx.createLinearGradient(x, y, x + size, y + size);
        gradient.addColorStop(0, '#66BB6A');
        gradient.addColorStop(1, '#4CAF50');

        this.ctx.fillStyle = gradient;
        this.drawRoundedRect(x + padding, y + padding, size, size, cornerRadius);
        this.ctx.fill();

        this.ctx.restore();

        // Draw eyes based on direction
        this.drawSnakeEyes(x + padding, y + padding, size, direction);
      } else {
        // Draw body segments with gradient
        const alpha = 1 - (index / body.length) * 0.3;
        const gradient = this.ctx.createLinearGradient(x, y, x + size, y + size);
        gradient.addColorStop(0, `rgba(129, 199, 132, ${alpha})`);
        gradient.addColorStop(1, `rgba(102, 187, 106, ${alpha})`);

        this.ctx.fillStyle = gradient;
        this.drawRoundedRect(x + padding, y + padding, size, size, cornerRadius);
        this.ctx.fill();
      }
    });
  }

  private drawRoundedRect(
    x: number,
    y: number,
    width: number,
    height: number,
    radius: number
  ): void {
    this.ctx.beginPath();
    this.ctx.moveTo(x + radius, y);
    this.ctx.lineTo(x + width - radius, y);
    this.ctx.arcTo(x + width, y, x + width, y + radius, radius);
    this.ctx.lineTo(x + width, y + height - radius);
    this.ctx.arcTo(x + width, y + height, x + width - radius, y + height, radius);
    this.ctx.lineTo(x + radius, y + height);
    this.ctx.arcTo(x, y + height, x, y + height - radius, radius);
    this.ctx.lineTo(x, y + radius);
    this.ctx.arcTo(x, y, x + radius, y, radius);
    this.ctx.closePath();
  }

  private drawSnakeEyes(x: number, y: number, size: number, direction: Direction): void {
    this.ctx.fillStyle = '#1A1A2E';
    const eyeSize = 2;
    const eyeOffset = size * 0.3;

    let leftEyeX = x + eyeOffset;
    let leftEyeY = y + eyeOffset;
    let rightEyeX = x + size - eyeOffset;
    let rightEyeY = y + eyeOffset;

    switch (direction) {
      case Direction.UP:
        leftEyeY = y + eyeOffset;
        rightEyeY = y + eyeOffset;
        break;
      case Direction.DOWN:
        leftEyeY = y + size - eyeOffset;
        rightEyeY = y + size - eyeOffset;
        break;
      case Direction.LEFT:
        leftEyeX = x + eyeOffset;
        rightEyeX = x + eyeOffset;
        leftEyeY = y + eyeOffset;
        rightEyeY = y + size - eyeOffset;
        break;
      case Direction.RIGHT:
        leftEyeX = x + size - eyeOffset;
        rightEyeX = x + size - eyeOffset;
        leftEyeY = y + eyeOffset;
        rightEyeY = y + size - eyeOffset;
        break;
    }

    this.ctx.beginPath();
    this.ctx.arc(leftEyeX, leftEyeY, eyeSize, 0, Math.PI * 2);
    this.ctx.fill();

    this.ctx.beginPath();
    this.ctx.arc(rightEyeX, rightEyeY, eyeSize, 0, Math.PI * 2);
    this.ctx.fill();
  }

  drawFood(food: Food): void {
    const { x, y } = this.grid.toPixel(food.getPosition());
    const centerX = x + this.grid.cellSize / 2;
    const centerY = y + this.grid.cellSize / 2;

    // Pulsing animation
    this.animationFrame = (this.animationFrame + 1) % (Math.PI * 200);
    const pulse = Math.sin(this.animationFrame * 0.1) * 0.15 + 1;
    const radius = (this.grid.cellSize / 2 - 3) * pulse;

    // Draw glow
    this.ctx.save();
    this.ctx.shadowColor = 'rgba(244, 67, 54, 0.8)';
    this.ctx.shadowBlur = 10;

    // Draw food with gradient
    const gradient = this.ctx.createRadialGradient(
      centerX,
      centerY,
      0,
      centerX,
      centerY,
      radius
    );
    gradient.addColorStop(0, '#FF5252');
    gradient.addColorStop(0.7, '#F44336');
    gradient.addColorStop(1, '#D32F2F');

    this.ctx.fillStyle = gradient;
    this.ctx.beginPath();
    this.ctx.arc(centerX, centerY, radius, 0, Math.PI * 2);
    this.ctx.fill();

    this.ctx.restore();
  }

  drawScore(score: number, highScore: number): void {
    this.ctx.fillStyle = COLORS.TEXT;
    this.ctx.font = '16px "Press Start 2P", monospace';
    this.ctx.fillText(`Score: ${score}`, 10, 25);
    this.ctx.fillText(`High: ${highScore}`, this.canvas.width - 150, 25);
  }

  drawGameOver(score: number): void {
    this.ctx.fillStyle = 'rgba(0, 0, 0, 0.8)';
    this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
    this.ctx.fillStyle = COLORS.TEXT;
    this.ctx.font = '32px "Press Start 2P", monospace';
    this.ctx.textAlign = 'center';
    this.ctx.fillText('GAME OVER', this.canvas.width / 2, this.canvas.height / 2 - 40);
    this.ctx.font = '16px "Press Start 2P", monospace';
    this.ctx.fillText(`Final Score: ${score}`, this.canvas.width / 2, this.canvas.height / 2);
    this.ctx.fillText(
      'Press SPACE to restart',
      this.canvas.width / 2,
      this.canvas.height / 2 + 60
    );
    this.ctx.textAlign = 'left';
  }

  drawStartScreen(): void {
    this.clear();
    this.ctx.fillStyle = COLORS.TEXT;
    this.ctx.font = '32px "Press Start 2P", monospace';
    this.ctx.textAlign = 'center';
    this.ctx.fillText('SNAKE', this.canvas.width / 2, this.canvas.height / 2 - 60);
    this.ctx.font = '12px "Press Start 2P", monospace';
    this.ctx.fillText(
      'Use arrow keys or WASD to move',
      this.canvas.width / 2,
      this.canvas.height / 2
    );
    this.ctx.fillText(
      'Press SPACE to start',
      this.canvas.width / 2,
      this.canvas.height / 2 + 40
    );
    this.ctx.textAlign = 'left';
  }

  drawPaused(): void {
    this.ctx.fillStyle = 'rgba(0, 0, 0, 0.8)';
    this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
    this.ctx.fillStyle = COLORS.TEXT;
    this.ctx.font = '32px "Press Start 2P", monospace';
    this.ctx.textAlign = 'center';
    this.ctx.fillText('PAUSED', this.canvas.width / 2, this.canvas.height / 2);
    this.ctx.font = '12px "Press Start 2P", monospace';
    this.ctx.fillText(
      'Press SPACE to resume',
      this.canvas.width / 2,
      this.canvas.height / 2 + 40
    );
    this.ctx.textAlign = 'left';
  }

  destroy(): void {
    this.animationFrame = 0;
  }
}

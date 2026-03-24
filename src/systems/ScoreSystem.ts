import { Storage } from '../utils/Storage';
import { STORAGE_KEYS } from '../utils/Constants';

export class ScoreSystem {
  private score: number = 0;
  private highScore: number;

  constructor(private readonly storage: Storage) {
    this.highScore = storage.get<number>(STORAGE_KEYS.HIGH_SCORE) ?? 0;
  }

  addPoints(points: number): void {
    this.score += points;
    if (this.score > this.highScore) {
      this.highScore = this.score;
      this.storage.set(STORAGE_KEYS.HIGH_SCORE, this.highScore);
    }
  }

  reset(): void {
    this.score = 0;
  }

  getScore(): number {
    return this.score;
  }

  getHighScore(): number {
    return this.highScore;
  }
}

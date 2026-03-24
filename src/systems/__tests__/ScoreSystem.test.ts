import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { ScoreSystem } from '../ScoreSystem';
import { Storage } from '../../utils/Storage';

describe('ScoreSystem', () => {
  let storage: Storage;
  let scoreSystem: ScoreSystem;

  beforeEach(() => {
    localStorage.clear();
    storage = new Storage();
    scoreSystem = new ScoreSystem(storage);
  });

  afterEach(() => {
    localStorage.clear();
  });

  describe('constructor', () => {
    it('should initialize with score of 0', () => {
      expect(scoreSystem.getScore()).toBe(0);
    });

    it('should load high score from storage if exists', () => {
      storage.set('snake_high_score', 500);
      const newScoreSystem = new ScoreSystem(storage);

      expect(newScoreSystem.getHighScore()).toBe(500);
    });

    it('should initialize high score to 0 if not in storage', () => {
      expect(scoreSystem.getHighScore()).toBe(0);
    });

    it('should handle null high score in storage', () => {
      storage.set('snake_high_score', null);
      const newScoreSystem = new ScoreSystem(storage);

      expect(newScoreSystem.getHighScore()).toBe(0);
    });

    it('should accept storage instance', () => {
      const customStorage = new Storage();
      const system = new ScoreSystem(customStorage);

      expect(system).toBeInstanceOf(ScoreSystem);
    });
  });

  describe('addPoints', () => {
    it('should add points to current score', () => {
      scoreSystem.addPoints(10);

      expect(scoreSystem.getScore()).toBe(10);
    });

    it('should accumulate points across multiple calls', () => {
      scoreSystem.addPoints(10);
      scoreSystem.addPoints(20);
      scoreSystem.addPoints(30);

      expect(scoreSystem.getScore()).toBe(60);
    });

    it('should handle zero points', () => {
      scoreSystem.addPoints(0);

      expect(scoreSystem.getScore()).toBe(0);
    });

    it('should handle large point values', () => {
      scoreSystem.addPoints(1000);

      expect(scoreSystem.getScore()).toBe(1000);
    });

    it('should update high score when current score exceeds it', () => {
      scoreSystem.addPoints(100);

      expect(scoreSystem.getHighScore()).toBe(100);
    });

    it('should not update high score when current score is lower', () => {
      storage.set('snake_high_score', 500);
      scoreSystem = new ScoreSystem(storage);

      scoreSystem.addPoints(100);

      expect(scoreSystem.getHighScore()).toBe(500);
      expect(scoreSystem.getScore()).toBe(100);
    });

    it('should save high score to storage when updated', () => {
      scoreSystem.addPoints(200);

      expect(storage.get<number>('snake_high_score')).toBe(200);
    });

    it('should not save to storage when high score not beaten', () => {
      storage.set('snake_high_score', 500);
      const getSpy = vi.spyOn(storage, 'get');
      const setSpy = vi.spyOn(storage, 'set');

      scoreSystem = new ScoreSystem(storage);
      getSpy.mockClear();
      setSpy.mockClear();

      scoreSystem.addPoints(100);

      expect(setSpy).not.toHaveBeenCalled();
    });

    it('should update high score incrementally', () => {
      scoreSystem.addPoints(50);
      expect(scoreSystem.getHighScore()).toBe(50);

      scoreSystem.addPoints(50);
      expect(scoreSystem.getHighScore()).toBe(100);

      scoreSystem.addPoints(50);
      expect(scoreSystem.getHighScore()).toBe(150);
    });

    it('should handle multiple games with different scores', () => {
      scoreSystem.addPoints(300);
      expect(scoreSystem.getHighScore()).toBe(300);

      scoreSystem.reset();
      scoreSystem.addPoints(200);
      expect(scoreSystem.getScore()).toBe(200);
      expect(scoreSystem.getHighScore()).toBe(300);
    });
  });

  describe('reset', () => {
    it('should reset score to 0', () => {
      scoreSystem.addPoints(100);
      scoreSystem.reset();

      expect(scoreSystem.getScore()).toBe(0);
    });

    it('should not affect high score', () => {
      scoreSystem.addPoints(100);
      const highScore = scoreSystem.getHighScore();

      scoreSystem.reset();

      expect(scoreSystem.getHighScore()).toBe(highScore);
    });

    it('should allow scoring after reset', () => {
      scoreSystem.addPoints(100);
      scoreSystem.reset();
      scoreSystem.addPoints(50);

      expect(scoreSystem.getScore()).toBe(50);
    });

    it('should handle multiple resets', () => {
      scoreSystem.addPoints(100);
      scoreSystem.reset();
      scoreSystem.reset();
      scoreSystem.reset();

      expect(scoreSystem.getScore()).toBe(0);
    });

    it('should work with no prior score', () => {
      scoreSystem.reset();

      expect(scoreSystem.getScore()).toBe(0);
    });
  });

  describe('getScore', () => {
    it('should return current score', () => {
      expect(scoreSystem.getScore()).toBe(0);
    });

    it('should return updated score after adding points', () => {
      scoreSystem.addPoints(100);

      expect(scoreSystem.getScore()).toBe(100);
    });

    it('should return 0 after reset', () => {
      scoreSystem.addPoints(100);
      scoreSystem.reset();

      expect(scoreSystem.getScore()).toBe(0);
    });

    it('should not mutate internal state', () => {
      scoreSystem.addPoints(100);
      const score1 = scoreSystem.getScore();
      const score2 = scoreSystem.getScore();

      expect(score1).toBe(score2);
      expect(scoreSystem.getScore()).toBe(100);
    });
  });

  describe('getHighScore', () => {
    it('should return current high score', () => {
      expect(scoreSystem.getHighScore()).toBe(0);
    });

    it('should return loaded high score from storage', () => {
      storage.set('snake_high_score', 750);
      const newScoreSystem = new ScoreSystem(storage);

      expect(newScoreSystem.getHighScore()).toBe(750);
    });

    it('should return updated high score after beating it', () => {
      scoreSystem.addPoints(200);

      expect(scoreSystem.getHighScore()).toBe(200);
    });

    it('should persist across resets', () => {
      scoreSystem.addPoints(200);
      scoreSystem.reset();

      expect(scoreSystem.getHighScore()).toBe(200);
    });

    it('should not mutate internal state', () => {
      scoreSystem.addPoints(100);
      const highScore1 = scoreSystem.getHighScore();
      const highScore2 = scoreSystem.getHighScore();

      expect(highScore1).toBe(highScore2);
    });
  });

  describe('integration scenarios', () => {
    it('should handle complete game cycle', () => {
      // First game
      scoreSystem.addPoints(50);
      scoreSystem.addPoints(50);
      scoreSystem.addPoints(50);
      expect(scoreSystem.getScore()).toBe(150);
      expect(scoreSystem.getHighScore()).toBe(150);

      // Reset for second game
      scoreSystem.reset();
      expect(scoreSystem.getScore()).toBe(0);
      expect(scoreSystem.getHighScore()).toBe(150);

      // Second game with lower score
      scoreSystem.addPoints(100);
      expect(scoreSystem.getScore()).toBe(100);
      expect(scoreSystem.getHighScore()).toBe(150);

      // Reset for third game
      scoreSystem.reset();

      // Third game with higher score
      scoreSystem.addPoints(200);
      expect(scoreSystem.getScore()).toBe(200);
      expect(scoreSystem.getHighScore()).toBe(200);
    });

    it('should persist high score across instances', () => {
      scoreSystem.addPoints(500);

      const newScoreSystem = new ScoreSystem(storage);
      expect(newScoreSystem.getHighScore()).toBe(500);
    });

    it('should handle incremental scoring realistically', () => {
      // Simulate eating food
      for (let i = 0; i < 10; i++) {
        scoreSystem.addPoints(10);
      }

      expect(scoreSystem.getScore()).toBe(100);
      expect(scoreSystem.getHighScore()).toBe(100);
    });

    it('should maintain high score through multiple game sessions', () => {
      // Session 1
      scoreSystem.addPoints(300);
      scoreSystem.reset();

      // Session 2
      scoreSystem.addPoints(250);
      scoreSystem.reset();

      // Session 3
      scoreSystem.addPoints(400);

      expect(scoreSystem.getScore()).toBe(400);
      expect(scoreSystem.getHighScore()).toBe(400);
    });

    it('should work with external storage modifications', () => {
      storage.set('snake_high_score', 1000);
      const newScoreSystem = new ScoreSystem(storage);

      expect(newScoreSystem.getHighScore()).toBe(1000);

      newScoreSystem.addPoints(500);
      expect(newScoreSystem.getScore()).toBe(500);
      expect(newScoreSystem.getHighScore()).toBe(1000);
    });

    it('should handle storage clearing between games', () => {
      scoreSystem.addPoints(300);
      expect(storage.get<number>('snake_high_score')).toBe(300);

      localStorage.clear();
      const newScoreSystem = new ScoreSystem(storage);

      expect(newScoreSystem.getHighScore()).toBe(0);
      expect(newScoreSystem.getScore()).toBe(0);
    });
  });
});

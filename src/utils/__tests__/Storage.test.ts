import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { Storage } from '../Storage';

describe('Storage', () => {
  let storage: Storage;

  beforeEach(() => {
    storage = new Storage();
    localStorage.clear();
  });

  afterEach(() => {
    localStorage.clear();
  });

  describe('get', () => {
    it('should return null for non-existent key', () => {
      expect(storage.get('non-existent')).toBeNull();
    });

    it('should retrieve stored string value', () => {
      localStorage.setItem('test-key', JSON.stringify('test-value'));

      expect(storage.get<string>('test-key')).toBe('test-value');
    });

    it('should retrieve stored number value', () => {
      localStorage.setItem('test-number', JSON.stringify(42));

      expect(storage.get<number>('test-number')).toBe(42);
    });

    it('should retrieve stored boolean value', () => {
      localStorage.setItem('test-bool', JSON.stringify(true));

      expect(storage.get<boolean>('test-bool')).toBe(true);
    });

    it('should retrieve stored object value', () => {
      const testObject = { name: 'test', score: 100 };
      localStorage.setItem('test-object', JSON.stringify(testObject));

      expect(storage.get<typeof testObject>('test-object')).toEqual(testObject);
    });

    it('should retrieve stored array value', () => {
      const testArray = [1, 2, 3, 4, 5];
      localStorage.setItem('test-array', JSON.stringify(testArray));

      expect(storage.get<number[]>('test-array')).toEqual(testArray);
    });

    it('should return null for invalid JSON', () => {
      localStorage.setItem('invalid-json', 'not valid json {]');

      expect(storage.get('invalid-json')).toBeNull();
    });

    it('should handle empty string', () => {
      localStorage.setItem('empty', JSON.stringify(''));

      expect(storage.get<string>('empty')).toBe('');
    });

    it('should handle zero value', () => {
      localStorage.setItem('zero', JSON.stringify(0));

      expect(storage.get<number>('zero')).toBe(0);
    });

    it('should handle null value', () => {
      localStorage.setItem('null-value', JSON.stringify(null));

      expect(storage.get('null-value')).toBeNull();
    });
  });

  describe('set', () => {
    it('should store string value', () => {
      storage.set('test-key', 'test-value');

      expect(localStorage.getItem('test-key')).toBe(JSON.stringify('test-value'));
    });

    it('should store number value', () => {
      storage.set('test-number', 42);

      expect(localStorage.getItem('test-number')).toBe(JSON.stringify(42));
    });

    it('should store boolean value', () => {
      storage.set('test-bool', true);

      expect(localStorage.getItem('test-bool')).toBe(JSON.stringify(true));
    });

    it('should store object value', () => {
      const testObject = { name: 'test', score: 100 };
      storage.set('test-object', testObject);

      expect(localStorage.getItem('test-object')).toBe(JSON.stringify(testObject));
    });

    it('should store array value', () => {
      const testArray = [1, 2, 3, 4, 5];
      storage.set('test-array', testArray);

      expect(localStorage.getItem('test-array')).toBe(JSON.stringify(testArray));
    });

    it('should overwrite existing value', () => {
      storage.set('test-key', 'old-value');
      storage.set('test-key', 'new-value');

      expect(storage.get<string>('test-key')).toBe('new-value');
    });

    it('should handle zero value', () => {
      storage.set('zero', 0);

      expect(storage.get<number>('zero')).toBe(0);
    });

    it('should handle empty string', () => {
      storage.set('empty', '');

      expect(storage.get<string>('empty')).toBe('');
    });

    it('should handle null value', () => {
      storage.set('null-value', null);

      expect(storage.get('null-value')).toBeNull();
    });

    it('should not throw on quota exceeded error', () => {
      const setItemSpy = vi.spyOn(localStorage, 'setItem');
      setItemSpy.mockImplementation(() => {
        throw new Error('QuotaExceededError');
      });

      expect(() => {
        storage.set('test-key', 'test-value');
      }).not.toThrow();

      setItemSpy.mockRestore();
    });
  });

  describe('remove', () => {
    it('should remove existing key', () => {
      storage.set('test-key', 'test-value');
      storage.remove('test-key');

      expect(storage.get('test-key')).toBeNull();
    });

    it('should not throw when removing non-existent key', () => {
      expect(() => {
        storage.remove('non-existent');
      }).not.toThrow();
    });

    it('should actually remove from localStorage', () => {
      storage.set('test-key', 'test-value');
      storage.remove('test-key');

      expect(localStorage.getItem('test-key')).toBeNull();
    });

    it('should handle multiple removals', () => {
      storage.set('key1', 'value1');
      storage.set('key2', 'value2');
      storage.set('key3', 'value3');

      storage.remove('key1');
      storage.remove('key2');
      storage.remove('key3');

      expect(storage.get('key1')).toBeNull();
      expect(storage.get('key2')).toBeNull();
      expect(storage.get('key3')).toBeNull();
    });
  });

  describe('integration scenarios', () => {
    it('should handle set and get cycle', () => {
      const testValue = { score: 1000, name: 'player' };

      storage.set('game-data', testValue);
      const retrieved = storage.get<typeof testValue>('game-data');

      expect(retrieved).toEqual(testValue);
    });

    it('should handle multiple keys independently', () => {
      storage.set('key1', 'value1');
      storage.set('key2', 42);
      storage.set('key3', true);

      expect(storage.get<string>('key1')).toBe('value1');
      expect(storage.get<number>('key2')).toBe(42);
      expect(storage.get<boolean>('key3')).toBe(true);
    });

    it('should maintain data across multiple instances', () => {
      const storage1 = new Storage();
      const storage2 = new Storage();

      storage1.set('shared-key', 'shared-value');

      expect(storage2.get<string>('shared-key')).toBe('shared-value');
    });

    it('should handle complex nested objects', () => {
      const complexObject = {
        player: { name: 'test', id: 1 },
        scores: [100, 200, 300],
        settings: { sound: true, music: false },
      };

      storage.set('complex', complexObject);
      const retrieved = storage.get<typeof complexObject>('complex');

      expect(retrieved).toEqual(complexObject);
    });

    it('should persist data after clear and set', () => {
      storage.set('key1', 'value1');
      localStorage.clear();
      storage.set('key2', 'value2');

      expect(storage.get('key1')).toBeNull();
      expect(storage.get<string>('key2')).toBe('value2');
    });
  });
});

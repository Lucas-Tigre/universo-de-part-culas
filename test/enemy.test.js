// test/enemy.test.js
import { spawnEnemy, updateEnemies } from '../js/enemy.js';

const mockConfig = {
  enemySystem: {
    types: {
      grunt: {
        health: 10,
        damage: 5,
        radius: 10,
        color: 'red',
        speed: 1,
        chance: 1
      }
    },
    baseHealth: 10,
    healthIncreasePerLevel: 2,
    baseDamage: 5,
    damageIncreasePerLevel: 1,
    baseSpeed: 1
  },
  wave: {
    number: 1
  }
};

describe('enemy logic', () => {
  it('should remove enemy on collision with player', () => {
    const player = { x: 10, y: 10, size: 10, health: 100 };
    const enemies = [
      spawnEnemy('grunt', mockConfig, player)
    ];
    enemies[0].x = 15;
    enemies[0].y = 15;

    const { newEnemies } = updateEnemies(enemies, player, 16.67, []);

    expect(newEnemies).toHaveLength(0);
  });
});

// ======================
// SISTEMA DE INIMIGOS v2.0
// ======================

// ✅ Pega dimensões da tela com segurança (sem travar fora do navegador)
const screenWidth = typeof window !== 'undefined' ? window.innerWidth : 800;
const screenHeight = typeof window !== 'undefined' ? window.innerHeight : 600;

// 🔹 Função utilitária para gerar números aleatórios de forma simples
function rand(min = 0, max = 1) {
  return Math.random() * (max - min) + min;
}

// ======================
// GERAR INIMIGOS
// ======================
export function spawnEnemy(typeKey, config, player) {
  const type = config.enemySystem.types[typeKey];
  if (!type) return null; // segurança extra

  // 🔹 Define o número da wave, mesmo que ainda não exista
  const waveNumber = config.wave?.number ?? 1;

  // 🔹 Define a vida base do inimigo
  let health = type.health || (config.enemySystem.baseHealth + (waveNumber * config.enemySystem.healthIncreasePerLevel));

  // 🔹 Define dano base
  let damage = type.damage || (config.enemySystem.baseDamage + (waveNumber * config.enemySystem.damageIncreasePerLevel));

  // 🔹 Define velocidade
  let baseSpeed = type.speed || config.enemySystem.baseSpeed;

  // 🔹 Define se é inimigo “elite”
  const isElite = typeKey === 'boss' || typeKey === 'finalBoss' || Math.random() < 0.02;

  if (isElite) {
    health *= 1.5; // elites têm mais vida
    damage *= 1.3; // e causam mais dano
    baseSpeed *= 1.1;
  }

  // 🔹 Posição aleatória fora da tela (pra parecer que vem “de longe”)
  const side = Math.floor(rand(0, 4)); // 0: esquerda, 1: direita, 2: cima, 3: baixo
  let x, y;

  if (side === 0) { // esquerda
    x = -50;
    y = rand(0, screenHeight);
  } else if (side === 1) { // direita
    x = screenWidth + 50;
    y = rand(0, screenHeight);
  } else if (side === 2) { // cima
    x = rand(0, screenWidth);
    y = -50;
  } else { // baixo
    x = rand(0, screenWidth);
    y = screenHeight + 50;
  }

  // 🔹 Cria o inimigo com todas as propriedades iniciais
  const enemy = {
    x,
    y,
    baseSpeed,
    speedX: 0,
    speedY: 0,
    health,
    maxHealth: health,
    damage,
    radius: type.radius || 15,
    color: isElite ? 'gold' : type.color || 'red',
    isElite,
    typeKey
  };

  return enemy;
}

import { createProjectile } from './projectile.js';

// ======================
// ATUALIZAÇÃO DOS INIMIGOS
// ======================
export function updateEnemies(enemies, player, deltaTime, projectiles = []) {
    const remainingEnemies = [];
    const newlyCreatedParticles = [];
    let xpFromDefeatedEnemies = 0;
    let newProjectiles = projectiles ? [...projectiles] : [];

    for (const enemy of enemies) {
        if (!enemy) continue;

        let enemyIsAlive = true;

        // Colisão com projéteis
        for (let i = newProjectiles.length - 1; i >= 0; i--) {
            const proj = newProjectiles[i];
            const dx = enemy.x - proj.x;
            const dy = enemy.y - proj.y;
            const dist = Math.sqrt(dx * dx + dy * dy);
            if (dist < enemy.radius + (proj.size || 3)) {
                enemy.health -= player.attractionDamage;
                newProjectiles.splice(i, 1);
                if (enemy.health <= 0) {
                    enemyIsAlive = false;
                    break;
                }
            }
        }

        // Colisão com o jogador
        const dxPlayer = player.x - enemy.x;
        const dyPlayer = player.y - enemy.y;
        const distToPlayer = Math.sqrt(dxPlayer * dxPlayer + dyPlayer * dyPlayer);
        if (distToPlayer < enemy.radius + player.size) {
            player.health -= enemy.damage;
            enemyIsAlive = false;
        }

        if (enemyIsAlive) {
            // Movimento
            const dist = Math.sqrt(dxPlayer * dxPlayer + dyPlayer * dyPlayer) || 1;
            enemy.speedX = (dxPlayer / dist) * enemy.baseSpeed;
            enemy.speedY = (dyPlayer / dist) * enemy.baseSpeed;
            enemy.x += enemy.speedX * (deltaTime / 16.67);
            enemy.y += enemy.speedY * (deltaTime / 16.67);
            remainingEnemies.push(enemy);
        } else {
            // Se morreu, gera XP e partículas
            xpFromDefeatedEnemies += enemy.maxHealth;
            for (let i = 0; i < (enemy.isElite ? 15 : 5); i++) {
                newlyCreatedParticles.push({
                    x: enemy.x, y: enemy.y,
                    vx: Math.random() * 4 - 2, vy: Math.random() * 4 - 2,
                    life: 150, type: 'xp'
                });
            }
        }
    }

    return {
        newEnemies: remainingEnemies,
        newProjectiles: newProjectiles,
        newlyCreatedParticles,
        xpFromDefeatedEnemies,
    };
}

// ======================
// DESENHAR INIMIGOS NA TELA
// ======================
export function renderEnemies(ctx, enemies) {
  enemies.forEach(enemy => {
    // 🔹 Corpo do inimigo
    ctx.beginPath();
    ctx.fillStyle = enemy.color;
    ctx.arc(enemy.x, enemy.y, enemy.radius, 0, Math.PI * 2);
    ctx.fill();
    ctx.closePath();

    // 🔹 Barra de vida
    const healthPercentage = Math.max(0, enemy.health / enemy.maxHealth);
    const barWidth = enemy.radius * 2;
    const barHeight = 4;
    const barX = enemy.x - enemy.radius;
    const barY = enemy.y - enemy.radius - 10;

    ctx.fillStyle = 'red';
    ctx.fillRect(barX, barY, barWidth, barHeight);
    ctx.fillStyle = 'lime';
    ctx.fillRect(barX, barY, barWidth * healthPercentage, barHeight);
  });
}

// ======================
// GERADOR DE INIMIGOS ALEATÓRIOS
// ======================
export function spawnRandomEnemy(config, player) {
  const enemyTypes = Object.keys(config.enemySystem.types);
  const totalChance = enemyTypes.reduce(
    (sum, key) => sum + (config.enemySystem.types[key].chance || 0),
    0
  );

  let random = Math.random() * totalChance;
  for (const key of enemyTypes) {
    const chance = config.enemySystem.types[key].chance || 0;
    if (random < chance) {
      return spawnEnemy(key, config, player);
    }
    random -= chance;
  }

  // fallback de segurança
  return spawnEnemy(enemyTypes[0], config, player);
}

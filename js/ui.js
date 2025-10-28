// js/ui.js

// =============================================
// FUNÇÕES DE UI
// =============================================

export function updateHealthBar(health, maxHealth) {
    const healthBar = document.getElementById('health-bar-fill');
    if (healthBar) {
        const percentage = (health / maxHealth) * 100;
        healthBar.style.width = `${percentage}%`;
    }
}

export function updateXPBar(xp, level) {
    const xpBar = document.getElementById('xp-bar-fill');
    if (xpBar) {
        const nextLevelXP = 100 * Math.pow(1.1, level - 1);
        const percentage = (xp / nextLevelXP) * 100;
        xpBar.style.width = `${percentage}%`;
    }
}

export function updateBigBangChargeBar(charge) {
    const chargeBar = document.getElementById('big-bang-charge-fill');
    if (chargeBar) {
        chargeBar.style.height = `${charge}%`;
    }
}

export function updateBigBangIndicator(charge) {
    const indicator = document.getElementById('big-bang-indicator');
    if (indicator) {
        indicator.style.display = charge >= 100 ? 'block' : 'none';
    }
}

export function updateStatsPanel(stats) {
    const statsPanel = document.getElementById('stats-panel');
    if (statsPanel) {
        statsPanel.innerHTML = `
            <p>Nível: ${stats.level}</p>
            <p>XP: ${stats.xp}</p>
            <p>Partículas: ${stats.particlesAbsorbed}</p>
            <p>Inimigos: ${stats.enemies}</p>
            <p>Onda: ${stats.wave}</p>
        `;
    }
}

export function updateQuestUI(quests) {
    const questList = document.getElementById('quest-list');
    if (questList) {
        questList.innerHTML = quests.map(q => `<li>${q.name} (${q.current}/${q.target})</li>`).join('');
    }
}

export function showGameOver(stats) {
    const gameOverScreen = document.getElementById('game-over-screen');
    const finalScore = document.getElementById('final-score');
    if (gameOverScreen && finalScore) {
        finalScore.textContent = `Nível: ${stats.level}, Onda: ${stats.wave}, Partículas: ${stats.particlesAbsorbed}`;
        gameOverScreen.style.display = 'block';
    }
}

export function toggleSoundUI(soundEnabled) {
    const soundIcon = document.getElementById('sound-icon');
    if (soundIcon) {
        soundIcon.textContent = soundEnabled ? '🔊' : '🔇';
    }
}

export function highlightActiveMode(mode) {
    const buttons = document.querySelectorAll('[data-mode]');
    buttons.forEach(btn => {
        if (btn.getAttribute('data-mode') === mode) {
            btn.classList.add('active');
        } else {
            btn.classList.remove('active');
        }
    });
}

export function updateFPS(fps) {
    const fpsCounter = document.getElementById('fps-counter');
    if (fpsCounter) {
        fpsCounter.textContent = `FPS: ${fps}`;
    }
}

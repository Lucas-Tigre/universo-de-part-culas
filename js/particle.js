// js/particle.js

// =============================================
// FUNÇÕES DE PARTÍCULAS
// =============================================

export function getParticle(player) {
    const type = Math.random() < 0.9 ? 'xp' : 'powerup';
    const x = Math.random() * window.innerWidth;
    const y = Math.random() * window.innerHeight;
    const size = type === 'xp' ? Math.random() * 2 + 1 : 5;
    const color = type === 'xp' ? 'rgba(142, 45, 226, 0.5)' : 'gold';
    return { x, y, size, color, type };
}

export function updateParticles(particles, player, deltaTime, lastUpdateIndex) {
    let absorbedXp = 0;
    let absorbedCount = 0;
    let powerupCollected = false;

    constendIndex = (lastUpdateIndex + 100) % particles.length;

    for (let i = 0; i < particles.length; i++) {
        const p = particles[i];
        const dx = player.x - p.x;
        const dy = player.y - p.y;
        const dist = Math.sqrt(dx * dx + dy * dy);

        if (dist < player.radius) {
            if (p.type === 'xp') {
                absorbedXp++;
                absorbedCount++;
            } else if (p.type === 'powerup') {
                powerupCollected = true;
            }
            particles.splice(i, 1);
            i--;
        }
    }

    return { newParticles: particles, absorbedXp, absorbedCount, powerupCollected, newLastUpdateIndex: endIndex };
}

export function renderParticles(ctx, particles) {
    particles.forEach(p => {
        ctx.fillStyle = p.color;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fill();
    });
}

export function autoRespawnParticles(particles, player) {
    const particlesToRespawn = 200 - particles.length;
    for (let i = 0; i < particlesToRespawn; i++) {
        particles.push(getParticle(player));
    }
    return particles;
}

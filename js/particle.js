// Simples módulo de partículas para efeitos visuais
export function createHealParticle(x,y) {
  return { type: 'heal', x, y, life: 60, vx: (Math.random()-0.5)*1, vy: -Math.random()*1.5 };
}
export function createParticleExplosion(x,y,opts=[]) {
  const particles = [];
  for (let i=0;i<12;i++) particles.push({ x, y, life: 30+Math.random()*30, vx:(Math.random()-0.5)*3, vy:(Math.random()-0.5)*3 });
  return particles;
}

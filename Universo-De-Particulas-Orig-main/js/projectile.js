// Módulo simples de projéteis
export function createProjectile(x,y,targetX,targetY,type='normal') {
  const dx = targetX - x; const dy = targetY - y;
  const dist = Math.sqrt(dx*dx+dy*dy)||1;
  const speed = (type==='fast')?6:3;
  return { x, y, vx: (dx/dist)*speed, vy: (dy/dist)*speed, life: 300, color: (type==='fast'?'#ff0':'#fff') };
}

export function updateProjectiles(projectiles, deltaTime, canvasW, canvasH) {
  const remaining = [];
  const explosions = [];
  for (let p of projectiles) {
    p.x += p.vx * (deltaTime/16.67);
    p.y += p.vy * (deltaTime/16.67);
    p.life -= (deltaTime/16.67);
    if (p.x< -50 || p.x>canvasW+50 || p.y< -50 || p.y>canvasH+50 || p.life<=0) continue;
    remaining.push(p);
  }
  return { remainingProjectiles: remaining, newExplosions: explosions };
}

export function renderProjectiles(ctx, projectiles) {
  if (!ctx) return;
  projectiles.forEach(p=>{
    ctx.fillStyle = p.color||'#fff';
    ctx.beginPath();
    ctx.arc(p.x,p.y,3,0,Math.PI*2);
    ctx.fill();
  });
}

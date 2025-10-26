import { getLeaderboard, submitScore } from './supabaseService.js';

const leaderboardBody = document.getElementById('leaderboardBody');
const authMsg = document.getElementById('authMsg');

export function showMsg(text, type='success') {
  if (!authMsg) return;
  authMsg.textContent = text;
  authMsg.className = 'msg ' + type;
}

export async function displayLeaderboard() {
  if (!leaderboardBody) return;
  leaderboardBody.innerHTML = '<tr><td colspan="3">Carregando...</td></tr>';
  try {
    const scores = await getLeaderboard(10);
    leaderboardBody.innerHTML = '';
    if (!scores || scores.length === 0) {
      leaderboardBody.innerHTML = '<tr><td colspan="3">Nenhuma pontuação registrada.</td></tr>';
      return;
    }
    scores.forEach((s, i) => {
      const tr = document.createElement('tr');
      tr.innerHTML = `<td>${i+1}</td><td>${s.username ?? s.user ?? 'Anônimo'}</td><td>${s.score}</td>`;
      leaderboardBody.appendChild(tr);
    });
  } catch (err) {
    console.error(err);
    leaderboardBody.innerHTML = '<tr><td colspan="3">Erro ao carregar.</td></tr>';
  }
}

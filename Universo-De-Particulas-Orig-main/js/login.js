import { supabase } from './supabaseService.js';
import { submitScore } from './supabaseService.js';

const loginForm = document.getElementById('loginForm');
const registerForm = document.getElementById('registerForm');
const googleLoginBtn = document.getElementById('googleLoginBtn');
const authMsg = document.getElementById('authMsg');

function showMsg(text, type='success') {
  if (!authMsg) return;
  authMsg.textContent = text;
  authMsg.className = 'msg ' + type;
}

async function signUp(email, password, nome, usuario) {
  if (!supabase) {
    showMsg('Modo offline: cadastro não disponível.', 'error');
    return;
  }
  const { error } = await supabase.auth.signUp({
    email, password, options: { data: { full_name: nome, username: usuario } }
  });
  if (error) showMsg('Erro ao cadastrar: ' + error.message, 'error');
  else showMsg('Conta criada! Verifique seu e-mail.', 'success');
}

async function signIn(email, password) {
  if (!supabase) {
    showMsg('Modo offline: login não disponível.', 'error');
    return null;
  }
  const { data, error } = await supabase.auth.signInWithPassword({ email, password });
  if (error) { showMsg('Erro ao entrar: '+error.message, 'error'); return null; }
  showMsg('Login bem-sucedido!', 'success');
  return data?.session ?? null;
}

async function signInWithGoogle() {
  if (!supabase) { showMsg('Modo offline: Google não disponível', 'error'); return; }
  const { error } = await supabase.auth.signInWithOAuth({ provider: 'google' });
  if (error) showMsg('Erro Google: ' + error.message, 'error');
}

async function resetPassword(email) {
  if (!supabase) { showMsg('Modo offline: não disponível', 'error'); return; }
  const { error } = await supabase.auth.resetPasswordForEmail(email, { redirectTo: window.location.origin });
  if (error) showMsg('Erro: '+error.message, 'error'); else showMsg('E-mail enviado!', 'success');
}

async function signOut() {
  if (!supabase) return;
  await supabase.auth.signOut();
  showMsg('Você saiu.', 'success');
  setTimeout(()=> location.href='index.html', 800);
}

// DOM handlers (if forms exist)
loginForm?.addEventListener('submit', async e => {
  e.preventDefault();
  const email = document.getElementById('loginUser').value.trim();
  const pass = document.getElementById('loginPass').value;
  await signIn(email, pass);
});

registerForm?.addEventListener('submit', async e => {
  e.preventDefault();
  const nome = document.getElementById('regNome').value.trim();
  const email = document.getElementById('regEmail').value.trim();
  const usuario = document.getElementById('regUsuario').value.trim();
  const senha = document.getElementById('regSenha').value;
  if (senha.length < 6) return showMsg('Senha deve ter ao menos 6 chars','error');
  await signUp(email, senha, nome, usuario);
});

googleLoginBtn?.addEventListener('click', async e => {
  e.preventDefault();
  await signInWithGoogle();
});

export { signUp, signIn, signInWithGoogle, resetPassword, signOut };

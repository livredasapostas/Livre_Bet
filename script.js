/* script.js
   Funções:
   - Toggle tema claro/escuro (persistente via localStorage)
   - Respire comigo: animação simples de respiração
   - Palavra de força: navegação entre versos/afirmações
   - Jogo de bolhas: spawn responsivo, contador crescente, touch-friendly, recorde (localStorage)
*/

/* ===== Helpers ===== */
const $ = (sel) => document.querySelector(sel);
const $$ = (sel) => Array.from(document.querySelectorAll(sel));

/* ===== THEME ===== */
const themeToggle = document.getElementById('theme-toggle');
const themeIcon = document.getElementById('theme-icon');
function applyTheme(t){
  document.documentElement.setAttribute('data-theme', t);
  themeIcon.textContent = (t === 'dark') ? 'light_mode' : 'dark_mode';
}
const savedTheme = localStorage.getItem('theme') || (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
applyTheme(savedTheme);
themeToggle.addEventListener('click', () => {
  const current = document.documentElement.getAttribute('data-theme');
  const next = current === 'dark' ? 'light' : 'dark';
  applyTheme(next);
  localStorage.setItem('theme', next);
});

/* ===== Respire comigo ===== */
const startBreathBtn = document.getElementById('start-breath');
const breathVisual = document.getElementById('breath-visual');

function createBreathDot(){
  breathVisual.innerHTML = '';
  const dot = document.createElement('div');
  dot.className = 'breath-dot';
  breathVisual.appendChild(dot);
  return dot;
}

let breathing = false;
startBreathBtn.addEventListener('click', () => {
  if (breathing) return;
  breathing = true;
  startBreathSequence(5).then(() => { breathing = false; });
});

async function startBreathSequence(reps = 5){
  const dot = createBreathDot();
  // cycle: inhale 4s - hold 4s - exhale 6s
  const inhale = 4000, hold = 4000, exhale = 6000;
  for(let i=0;i<reps;i++){
    // INHALE: scale up
    dot.style.transition = `transform ${inhale}ms ease-in-out`;
    dot.style.transform = 'scale(1.8)';
    await wait(inhale);
    // HOLD
    dot.style.transition = `transform ${hold}ms ease-in-out`;
    await wait(hold);
    // EXHALE: scale down
    dot.style.transition = `transform ${exhale}ms cubic-bezier(.2,.9,.2,.9)`;
    dot.style.transform = 'scale(0.8)';
    await wait(exhale);
    // normalize between reps
    dot.style.transform = 'scale(1)';
    await wait(400);
  }
  // pequeno fade out
  dot.style.opacity = '0';
  await wait(300);
  breathVisual.innerHTML = '';
}

function wait(ms){ return new Promise(res => setTimeout(res, ms)); }

/* ===== Palavra de força / Versículos =====
   Lista com textos e afirmações menos clichês.
*/
const versiculos = [
  {verso:"João 8:32", txt:"E conhecereis a verdade, e a verdade vos libertará.", afirm:"Um passo de cada vez."},
  {verso:"Filipenses 4:13", txt:"Tudo posso naquele que me fortalece.", afirm:"Você sobreviveu até aqui — respire."},
  {verso:"Isaías 41:10", txt:"Não temas, porque eu sou contigo.", afirm:"Respira. Hoje você não precisa ter todas as respostas."},
  {verso:"Salmo 46:1", txt:"Deus é nosso refúgio e fortaleza.", afirm:"Segure firme — você já começou."},
  {verso:"Mateus 11:28", txt:"Vinde a mim, todos os que estais cansados e sobrecarregados.", afirm:"Pausa. Um passo só, agora."}
];

let currentVerso = 0;
const versoEl = document.getElementById('verso-txt');
const afirmEl = document.getElementById('afirmacao');
const nextVersoBtn = document.getElementById('next-verso');

function renderVerso(i){
  const v = versiculos[i % versiculos.length];
  versoEl.textContent = `${v.verso} — ${v.txt}`;
  afirmEl.textContent = v.afirm;
}
renderVerso(currentVerso);
nextVersoBtn.addEventListener('click', () => {
  currentVerso = (currentVerso + 1) % versiculos.length;
  renderVerso(currentVerso);
});

/* ===== JOGO DAS BOLHAS ===== */
const gameArea = document.getElementById('game-area');
const startBtn = document.getElementById('start-game');
const stopBtn = document.getElementById('stop-game');
const bolhasCountEl = document.getElementById('bolhas-count');
const timerEl = document.getElementById('game-timer');
const bestScoreEl = document.getElementById('best-score');
const soundToggle = document.getElementById('sound-toggle');

let gameActive = false;
let spawnTimeout = null;
let gameTimerInterval = null;
let elapsed = 0;
let points = 0;
let bestScore = parseInt(localStorage.getItem('bestScore') || '0', 10);
bestScoreEl.textContent = bestScore;

startBtn.addEventListener('click', startGame);
stopBtn.addEventListener('click', stopGame);

function resetGameState(){
  // limpar bolhas
  gameArea.querySelectorAll('.bolha').forEach(b => b.remove());
  elapsed = 0;
  points = 0;
  bolhasCountEl.textContent = '0';
  timerEl.textContent = '0s';
}

function startGame(){
  if (gameActive) return;
  gameActive = true;
  startBtn.disabled = true;
  stopBtn.disabled = false;
  resetGameState();

  // timer crescente
  gameTimerInterval = setInterval(() => {
    elapsed++;
    timerEl.textContent = `${elapsed}s`;
  }, 1000);

  // iniciar spawn loop
  spawnLoop();
}

function stopGame(){
  gameActive = false;
  startBtn.disabled = false;
  stopBtn.disabled = true;
  clearInterval(gameTimerInterval);
  gameTimerInterval = null;
  if (spawnTimeout) { clearTimeout(spawnTimeout); spawnTimeout = null; }
  // avaliar recorde
  if (points > bestScore){
    bestScore = points;
    localStorage.setItem('bestScore', bestScore);
    bestScoreEl.textContent = bestScore;
  }
}

function spawnLoop(){
  if (!gameActive) return;
  criarBolha();
  // spawn mais orgânico: 700ms – 1600ms, adaptado ao tamanho da tela
  const base = (window.innerWidth < 600) ? 900 : 700;
  const delay = base + Math.random() * 900;
  spawnTimeout = setTimeout(spawnLoop, delay);
}

function criarBolha(){
  if (!gameActive) return;

  // limitar bolhas simultâneas para performance
  const MAX_BOLHAS = (window.innerWidth < 600) ? 6 : 12;
  if (gameArea.querySelectorAll('.bolha').length >= MAX_BOLHAS) return;

  const bolha = document.createElement('div');
  bolha.className = 'bolha';

  // tamanho responsivo
  const areaW = gameArea.clientWidth;
  const areaH = gameArea.clientHeight;
  const minSize = Math.round(Math.min(areaW, areaH) * 0.07);
  const maxSize = Math.round(Math.min(areaW, areaH) * 0.14);
  const size = Math.max(40, Math.floor(minSize + Math.random() * (maxSize - minSize)));
  bolha.style.width = `${size}px`;
  bolha.style.height = `${size}px`;

  // posição aleatória dentro da área
  const left = Math.random() * (Math.max(0, areaW - size));
  const top = Math.random() * (Math.max(0, areaH - size));
  bolha.style.left = `${left}px`;
  bolha.style.top = `${top}px`;

  // pequena variação de opacidade
  bolha.style.opacity = '0.98';

  // animação de entrada
  bolha.style.transform = 'scale(0.6)';
  requestAnimationFrame(() => {
    bolha.style.transition = 'transform 300ms cubic-bezier(.2,.9,.2,.9), opacity 350ms';
    bolha.style.transform = 'scale(1)';
  });

  // Evento: usar pointerdown para compatibilidade touch + mouse
  bolha.addEventListener('pointerdown', (e) => {
    e.stopPropagation();
    e.preventDefault();
    estourarBolha(bolha);
  }, {passive:false});

  gameArea.appendChild(bolha);

  // auto-despawn se não for estourada
  const life = 2500 + Math.random() * 1600;
  const despawn = setTimeout(() => {
    if (bolha.parentNode){
      bolha.style.opacity = '0';
      bolha.style.transform = 'scale(0.6)';
      setTimeout(() => bolha.remove(), 420);
    }
  }, life);

  // garantir que quando o jogo para, a bolha seja removida
  bolha._despawn = despawn;
}

function estourarBolha(bolha){
  // proteção
  if (!bolha || bolha._popped) return;
  bolha._popped = true;

  // contabiliza
  points++;
  bolhasCountEl.textContent = points;

  // micro-feedback visual
  bolha.style.transform = 'scale(1.5)';
  bolha.style.opacity = '0';
  bolha.style.transition = 'transform 160ms ease, opacity 300ms ease';
  // remover depois da animação
  setTimeout(() => {
    if (bolha.parentNode) bolha.remove();
  }, 260);

  // som opcional (simples click)
  if (soundToggle.checked) {
    playPopSound();
  }
}

/* Som pop simples via WebAudio (gera tom curto) */
let audioCtx = null;
function playPopSound(){
  try{
    if(!audioCtx) audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    const o = audioCtx.createOscillator();
    const g = audioCtx.createGain();
    o.type = 'sine';
    o.frequency.value = 700 + Math.random() * 300;
    g.gain.value = 0.05;
    o.connect(g);
    g.connect(audioCtx.destination);
    o.start();
    setTimeout(()=> {
      g.gain.exponentialRampToValueAtTime(0.0001, audioCtx.currentTime + 0.08);
      o.stop(audioCtx.currentTime + 0.09);
    }, 0);
  }catch(e){
    // se falhar, silenciar (ex.: bloqueio de autoplay)
  }
}

/* Ao redimensionar, remover bolhas que possam ficar fora e ajustar limites */
window.addEventListener('resize', () => {
  // remover bolhas que tenham posições inválidas (opcional)
  const areaW = gameArea.clientWidth;
  const areaH = gameArea.clientHeight;
  gameArea.querySelectorAll('.bolha').forEach(b => {
    const w = b.offsetWidth, h = b.offsetHeight;
    let left = parseFloat(b.style.left || 0);
    let top = parseFloat(b.style.top || 0);
    if (left + w > areaW) left = Math.max(0, areaW - w - 8);
    if (top + h > areaH) top = Math.max(0, areaH - h - 8);
    b.style.left = `${left}px`;
    b.style.top = `${top}px`;
  });
});

/* Antes da saída, salvar recorde se necessário */
window.addEventListener('beforeunload', () => {
  if (points > bestScore) localStorage.setItem('bestScore', points);
});

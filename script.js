/* --- CONFIGS --- */
const GOOGLE_URL = 'SUA_URL_AQUI';

/* --- TEMA --- */
const themeBtn = document.getElementById('theme-toggle');
themeBtn.onclick = () => {
    const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
    const newTheme = isDark ? 'light' : 'dark';
    document.documentElement.setAttribute('data-theme', newTheme);
    localStorage.setItem('theme', newTheme);
    themeBtn.innerText = newTheme === 'light' ? '🌙' : '☀️';
};

/* --- QUIZ --- */
let currentQ = 0, score = 0;
const questions = [
    { q: "Perdeu o controle sobre quanto aposta?", opt: ["Nunca", "Às vezes", "Sempre"], pts: [0, 5, 10] },
    { q: "O jogo afeta seu sono ou trabalho?", opt: ["Não", "Um pouco", "Muito"], pts: [0, 5, 10] },
    // Adicione as outras perguntas aqui...
];

function iniciarQuiz() {
    const name = document.getElementById('user-name').value;
    if(!name) return alert("Diga seu nome");
    document.getElementById('quiz-intro').classList.add('hidden');
    document.getElementById('quiz-questions').classList.remove('hidden');
    mostrarQuestao();
}

function mostrarQuestao() {
    if(currentQ >= questions.length) return finalizar();
    const q = questions[currentQ];
    document.getElementById('progress-fill').style.width = `${((currentQ+1)/questions.length)*100}%`;
    document.getElementById('question-text').innerText = q.q;
    const container = document.getElementById('options-container');
    container.innerHTML = '';
    q.opt.forEach((o, i) => {
        const btn = document.createElement('button');
        btn.className = 'btn-primary'; // Reutilizando estilo
        btn.style.marginBottom = '10px';
        btn.innerText = o;
        btn.onclick = () => { score += q.pts[i]; currentQ++; mostrarQuestao(); };
        container.appendChild(btn);
    });
}

function finalizar() {
    document.getElementById('modal-book').style.display = 'flex';
    document.getElementById('modal-title').innerText = "Análise Concluída";
    document.getElementById('result-content').innerText = score > 30 ? "Nível de risco alto. Use as ferramentas de bloqueio." : "Risco baixo, mas mantenha a vigilância.";
}

/* --- FERRAMENTAS --- */
function ativarFerramenta(id) {
    document.querySelectorAll('.hidden-tool-area').forEach(a => a.classList.remove('active'));
    document.getElementById(id).classList.add('active');
    document.getElementById(id).scrollIntoView({ behavior: 'smooth' });
}

// Jogo de Estourar
function startGame() {
    const board = document.getElementById('game-board');
    document.getElementById('start-screen-game').style.display = 'none';
    let pts = 0;
    const interval = setInterval(() => {
        if(!board.parentElement.classList.contains('active')) return clearInterval(interval);
        const b = document.createElement('div');
        b.innerHTML = '🎈'; b.style.position = 'absolute'; b.style.cursor = 'pointer';
        b.style.fontSize = '2rem';
        b.style.left = Math.random() * 80 + '%'; b.style.bottom = '0';
        b.onclick = () => { pts++; document.getElementById('score').innerText = pts; b.remove(); };
        board.appendChild(b);
        let pos = 0;
        const move = setInterval(() => {
            pos += 2; b.style.bottom = pos + 'px';
            if(pos > 400) { b.remove(); clearInterval(move); }
        }, 20);
    }, 1000);
}

/* --- UTILS --- */
function fecharModal(id) { 
    if(id === 'all') document.querySelectorAll('.modal').forEach(m => m.style.display='none');
    else document.getElementById(id).style.display = 'none'; 
}

function abrirModalData() { document.getElementById('modal-date').style.display = 'flex'; }

function salvarDataModal() {
    const d = document.getElementById('date-input-field').value;
    if(d) {
        localStorage.setItem('dataParada', d);
        atualizarContador();
        fecharModal('modal-date');
    }
}

function atualizarContador() {
    const s = localStorage.getItem('dataParada');
    if(!s) return;
    const diff = Math.floor((new Date() - new Date(s)) / (1000*60*60*24));
    document.getElementById('days-count').innerText = (diff >= 0 ? diff : 0) + 'd';
}

function toggleDonate(id) { document.getElementById(id).classList.toggle('hidden'); }

function copiarPix(id) {
    const el = document.getElementById(id);
    el.select();
    navigator.clipboard.writeText(el.value);
    alert("Copiado! ✅");
}

/* --- PWA --- */
let deferredPrompt;
window.addEventListener('beforeinstallprompt', (e) => {
    e.preventDefault(); deferredPrompt = e;
    document.getElementById('btn-install-head').classList.remove('hidden');
});
document.getElementById('btn-install-head').onclick = async () => {
    if(!deferredPrompt) return;
    deferredPrompt.prompt();
    deferredPrompt = null;
};

document.addEventListener('DOMContentLoaded', atualizarContador);

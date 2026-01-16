/* --- CONFIGURAÇÕES --- */
const GOOGLE_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbxp7-CcQb0tEzo3Ie1A9Pbgry-liQdjAI97_mCDTBHbAa419Ee_tHqq9lO93AlvFcHW/exec';

/* --- GERENCIAMENTO DE TEMA (DARK MODE PADRÃO) --- */
const toggleBtn = document.getElementById('theme-toggle');
const root = document.documentElement;
const userTheme = localStorage.getItem('theme');

// Se não houver tema salvo, definimos 'dark' como padrão
const themeToApply = userTheme || 'dark'; 

function applyTheme(theme) {
    root.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
    if (toggleBtn) {
        toggleBtn.innerText = theme === 'light' ? '🌙' : '☀️';
    }
}

// Aplica o tema imediatamente ao carregar
applyTheme(themeToApply);

toggleBtn.addEventListener('click', () => {
    const currentTheme = root.getAttribute('data-theme');
    const newTheme = currentTheme === 'light' ? 'dark' : 'light';
    applyTheme(newTheme);
});

/* --- QUIZ & LEAD --- */
const questions = [
    { q: "Você já apostou mais do que podia perder?", options: ["Nunca", "Às vezes", "Frequentemente"], scores: [0, 5, 10] },
    { q: "Tenta recuperar o prejuízo jogando de novo?", options: ["Nunca", "Raramente", "Sempre"], scores: [0, 5, 10] },
    { q: "Esconde que joga da família?", options: ["Não", "Às vezes", "Sim, sempre"], scores: [0, 5, 10] },
    { q: "O jogo afetou seu trabalho/estudo?", options: ["Não", "Talvez", "Sim"], scores: [0, 5, 10] },
    { q: "Sente ansiedade ao tentar parar?", options: ["Não", "Um pouco", "Muita"], scores: [0, 5, 10] },
    { q: "Joga para fugir de problemas?", options: ["Não", "Raramente", "Sim"], scores: [0, 5, 10] },
    { q: "Já mentiu sobre dinheiro?", options: ["Nunca", "Uma vez", "Várias vezes"], scores: [0, 5, 10] },
    { q: "Sente remorso depois de jogar?", options: ["Não", "Às vezes", "Sempre"], scores: [0, 5, 10] },
    { q: "Precisa apostar valores maiores para sentir emoção?", options: ["Não", "Sim"], scores: [0, 10] },
    { q: "Já pensou em atos ilegais para financiar o jogo?", options: ["Nunca", "Sim"], scores: [0, 10] }
];

let currentQuestion = 0;
let totalScore = 0;
let userData = { name: '', email: '' };

function iniciarQuiz() {
    const name = document.getElementById('user-name').value;
    const email = document.getElementById('user-email').value;
    
    if (!name || !email || !email.includes('@')) { 
        alert("Por favor, preencha seu nome e um e-mail válido."); 
        return; 
    }
    
    userData.name = name;
    userData.email = email;
    
    document.getElementById('quiz-intro').classList.add('hidden');
    document.getElementById('quiz-questions').classList.remove('hidden');
    mostrarPergunta();
}

function mostrarPergunta() {
    if (currentQuestion >= questions.length) { finalizarQuiz(); return; }
    
    const q = questions[currentQuestion];
    // Barra de progresso visual
    const progress = ((currentQuestion + 1) / questions.length) * 100;
    document.getElementById('progress-fill').style.width = `${progress}%`;
    document.getElementById('question-text').innerText = q.q;
    
    const container = document.getElementById('options-container');
    container.innerHTML = '';
    
    q.options.forEach((opt, index) => {
        const btn = document.createElement('button');
        btn.innerText = opt;
        btn.onclick = () => { 
            totalScore += q.scores[index]; 
            currentQuestion++; 
            mostrarPergunta(); 
        };
        container.appendChild(btn);
    });
}

function finalizarQuiz() {
    let risco, icone, msg;
    
    if (totalScore < 30) {
        risco = "Baixo"; icone = "🛡️";
        msg = "Você ainda tem controle, mas o sinal amarelo acendeu. O guia vai te ajudar a nunca cair na armadilha.";
    } else if (totalScore < 60) {
        risco = "Moderado"; icone = "⚠️";
        msg = "Cuidado. Você já apresenta sintomas de compulsão. É hora de usar as ferramentas de bloqueio agora.";
    } else {
        risco = "Alto"; icone = "🚨";
        msg = "Situação de Emergência. O vício está controlando suas decisões. Baixe o guia e faça a autoexclusão imediatamente.";
    }

    // Popula Modal
    document.getElementById('result-icon').innerText = icone;
    document.getElementById('modal-title').innerText = `Risco ${risco} Identificado`;
    document.getElementById('result-content').innerHTML = `<p>${userData.name}, ${msg}</p>`;

    // Salva e Envia
    localStorage.setItem('quizResult', JSON.stringify({ data: new Date(), score: totalScore, nivel: risco }));
    enviarParaPlanilha(risco);
    
    // Abre Modal
    document.getElementById('modal-book').style.display = 'flex';
}

function enviarParaPlanilha(nivel) {
    const dados = { name: userData.name, email: userData.email, score: totalScore, level: nivel };
    fetch(GOOGLE_SCRIPT_URL, {
        method: 'POST', mode: 'no-cors',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(dados)
    }).catch(e => console.error(e));
}

/* --- FERRAMENTAS (JOGO / RESPIRE / VERSO) --- */
// Jogo Anti-Ansiedade
let gameScore = 0, gameActive = false, spawnInterval;
function startGame() {
    document.getElementById('game-area').classList.add('active');
    document.getElementById('start-screen-game').style.display = 'none';
    gameScore = 0; document.getElementById('score').innerText = '0';
    gameActive = true;
    
    // Limpa bolhas antigas
    document.querySelectorAll('.bubble').forEach(b => b.remove());
    
    if(spawnInterval) clearInterval(spawnInterval);
    spawnInterval = setInterval(createBubble, 800);
}

function createBubble() {
    if(!gameActive) return;
    const board = document.getElementById('game-board');
    if(!board) return; // Segurança
    const b = document.createElement('div');
    b.className = 'bubble';
    const size = Math.floor(Math.random() * 40) + 40;
    b.style.width = `${size}px`; b.style.height = `${size}px`;
    b.style.left = `${Math.random() * (board.clientWidth - size)}px`;
    b.style.bottom = '-60px';
    
    // Eventos (Touch e Mouse)
    const pop = (e) => {
        if(e.cancelable) e.preventDefault();
        gameScore++;
        document.getElementById('score').innerText = gameScore;
        b.style.transform = "scale(1.5)"; b.style.opacity = 0;
        setTimeout(() => b.remove(), 200);
    };
    b.addEventListener('mousedown', pop);
    b.addEventListener('touchstart', pop);

    board.appendChild(b);
    
    // Animação manual via JS para garantir controle
    setTimeout(() => { b.style.transition = 'bottom 4s linear'; b.style.bottom = '120%'; }, 50);
    setTimeout(() => { if(b.parentNode) b.remove(); }, 4100);
}

// Respire
/* --- FERRAMENTA RESPIRAR (CORRIGIDA) --- */
let breathInterval;

function iniciarRespiracao() {
    const img = document.getElementById('breath-img');
    const text = document.getElementById('breath-text');
    let enchendo = true;

    // Reset inicial
    img.style.transform = "scale(1)";
    text.innerText = "Prepare-se...";

    breathInterval = setInterval(() => {
        if (enchendo) {
            img.style.transform = "scale(2)"; // Aumenta 2x
            text.innerText = "Inhale (Inspire)...";
        } else {
            img.style.transform = "scale(1)"; // Volta ao normal
            text.innerText = "Exhale (Expire)...";
        }
        enchendo = !enchendo;
    }, 4000); // 4 segundos é o tempo ideal para cada fase
}

function pararRespiracao() {
    clearInterval(breathInterval);
    const img = document.getElementById('breath-img');
    img.style.transform = "scale(1)";
    document.getElementById('breath-text').innerText = "Exercício parado.";
}

function pararRespiracao() {
    clearInterval(breathInterval);
    const img = document.getElementById('breath-img');
    if(img) img.style.transform = "scale(1)";
}

// Versículos
const verses = [
    { t: "Todas as coisas me são lícitas, mas nem todas me convêm.", r: "1 Coríntios 6:12", a: "Eu escolho ser livre." },
    { t: "Porque não nos deu Deus espírito de temor, mas de fortaleza.", r: "2 Timóteo 1:7", a: "Sou mais forte que o vício." },
    { t: "Vigiai e orai, para que não entreis em tentação.", r: "Mateus 26:41", a: "Estou atento aos gatilhos." },
    { t: "Não sobreveio a vocês tentação que não fosse comum aos homens.", r: "1 Coríntios 10:13", a: "Outros venceram, eu também vencerei." },
    { t: "Tudo posso naquele que me fortalece.", r: "Filipenses 4:13", a: "Minha força vem de algo maior." },
    { t: "Entrega o teu caminho ao Senhor; confia nele, e ele tudo fará.", r: "Salmos 37:5", a: "Não preciso carregar esse peso sozinho." },
    { t: "O que encobre as suas transgressões nunca prosperará.", r: "Provérbios 28:13", a: "Vou falar a verdade para me curar." },
    { t: "O Senhor é o meu pastor, nada me faltará.", r: "Salmos 23:1", a: "Tenho tudo o que preciso sem o jogo." },
    { t: "Conhecereis a verdade, e a verdade vos libertará.", r: "João 8:32", a: "A verdade é que o jogo é uma ilusão." },
    { t: "O fim de uma coisa é melhor do que o seu início.", r: "Eclesiastes 7:8", a: "Minha vida será melhor de agora em diante." },
    { t: "Sejam fortes e corajosos. Não tenham medo.", r: "Deuteronômio 31:6", a: "Enfrento este dia com coragem." },
    { t: "Lâmpada para os meus pés é tua palavra e luz para o meu caminho.", r: "Salmos 119:105", a: "Sigo o caminho da clareza, não do caos." },
    { t: "O coração ansioso deprime o homem, mas uma palavra bondosa o anima.", r: "Provérbios 12:25", a: "Falo palavras de vida para mim hoje." }
];

function novoVersiculo() {
    const v = verses[Math.floor(Math.random() * verses.length)];
    document.getElementById('verse-text').innerText = `"${v.t}"`;
    document.getElementById('verse-ref').innerText = v.r;
    document.getElementById('affirmation-text').innerText = v.a;
}

/* --- DIAS LIMPOS & MODAIS --- */
function abrirModalData() { document.getElementById('modal-date').style.display = 'flex'; }
function fecharModal(id) { document.getElementById(id).style.display = 'none'; }
function salvarDataModal() {
    const val = document.getElementById('date-input-field').value;
    if(val) {
        localStorage.setItem('dataParada', val);
        atualizarContador();
        fecharModal('modal-date');
    }
}
function atualizarContador() {
    const saved = localStorage.getItem('dataParada');
    if(!saved) return;
    const diff = new Date() - new Date(saved);
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const el = document.getElementById('days-count');
    if(days >= 0) el.innerText = `${days}d`;
}
document.addEventListener('DOMContentLoaded', atualizarContador);

/* --- LÓGICA DE INSTALAÇÃO (PWA) ATUALIZADA --- */
let deferredPrompt;
const btnInstallFloat = document.getElementById('btn-install-float');

window.addEventListener('beforeinstallprompt', (e) => {
    // Impede o Chrome de mostrar o prompt automático
    e.preventDefault();
    // Guarda o evento para ser usado depois
    deferredPrompt = e;
    // Mostra o botão flutuante que criamos
    if(btnInstallFloat) {
        btnInstallFloat.classList.remove('hidden');
    }
});

if(btnInstallFloat) {
    btnInstallFloat.addEventListener('click', async () => {
        if (!deferredPrompt) return;
        
        // Mostra o prompt de instalação
        deferredPrompt.prompt();
        
        // Aguarda a resposta do usuário
        const { outcome } = await deferredPrompt.userChoice;
        
        if (outcome === 'accepted') {
            console.log('Usuário aceitou a instalação');
            btnInstallFloat.classList.add('hidden');
        }
        deferredPrompt = null;
    });
}

// Esconde o botão se o app já estiver instalado
window.addEventListener('appinstalled', () => {
    console.log('App instalado com sucesso!');
    if(btnInstallFloat) btnInstallFloat.classList.add('hidden');
});

// Verifica se o usuário veio pelo link de doação e abre o card automaticamente
document.addEventListener('DOMContentLoaded', () => {
    if (window.location.hash === '#apoie') {
        const donateBody = document.getElementById('main-donate-body');
        if (donateBody) {
            donateBody.classList.remove('hidden');
            // Opcional: Adiciona um efeito de destaque momentâneo
            donateBody.parentElement.style.boxShadow = "0 0 20px var(--primary)";
        }
    }
});

document.querySelector('.btn-apoie-header').addEventListener('click', () => {
    const donateBody = document.getElementById('main-donate-body');
    if (donateBody) {
        donateBody.classList.remove('hidden');
        donateBody.style.display = 'block'; // Garante a visibilidade
    }
});

/* --- CONFIGURAÇÃO DA PLANILHA (GOOGLE SHEETS) --- */
const GOOGLE_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbxp7-CcQb0tEzo3Ie1A9Pbgry-liQdjAI97_mCDTBHbAa419Ee_tHqq9lO93AlvFcHW/exec';

/* --- GERENCIAMENTO DE TEMA (DARK MODE) --- */
const toggleBtn = document.getElementById('theme-toggle');
const root = document.documentElement;
const userTheme = localStorage.getItem('theme');
const systemTheme = window.matchMedia('(prefers-color-scheme: dark)').matches;

if (userTheme === 'dark' || (!userTheme && systemTheme)) {
    root.setAttribute('data-theme', 'dark');
    toggleBtn.innerText = '☀️';
} else {
    root.setAttribute('data-theme', 'light');
    toggleBtn.innerText = '🌙';
}

toggleBtn.addEventListener('click', () => {
    const currentTheme = root.getAttribute('data-theme');
    const newTheme = currentTheme === 'light' ? 'dark' : 'light';
    root.setAttribute('data-theme', newTheme);
    localStorage.setItem('theme', newTheme);
    toggleBtn.innerText = newTheme === 'light' ? '🌙' : '☀️';
});

/* --- CONTADOR DE DIAS E MODAL DE DATA --- */
document.addEventListener('DOMContentLoaded', () => {
    atualizarContador();
    atualizarDepoimento();
    
    const hoje = new Date().toISOString().split('T')[0];
    const dateInput = document.getElementById('date-input-field');
    if(dateInput) dateInput.value = hoje;
});

function abrirModalData() {
    document.getElementById('modal-date').style.display = 'block';
}

function salvarDataModal() {
    const inputDate = document.getElementById('date-input-field').value;
    if (inputDate) {
        localStorage.setItem('dataParada', inputDate);
        atualizarContador();
        fecharModal('modal-date');
    } else {
        alert("Por favor, selecione uma data válida.");
    }
}

function atualizarContador() {
    const dataSalva = localStorage.getItem('dataParada');
    const display = document.getElementById('days-count');
    if (!dataSalva) { display.innerText = "0d limpo"; return; }
    
    const inicio = new Date(dataSalva);
    const hoje = new Date();
    inicio.setHours(0,0,0,0);
    hoje.setHours(0,0,0,0);
    
    const diffTime = hoje - inicio;
    if (diffTime < 0) { display.innerText = "0d limpo"; return; }
    
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)); 
    display.innerText = `${diffDays}d limpo`;
}

/* --- FUNÇÕES MODAL GENÉRICAS --- */
function fecharModal(idModal) {
    const id = idModal || 'modal-book';
    const el = document.getElementById(id);
    if(el) el.style.display = "none";
}
window.onclick = function(event) {
    if (event.target.classList.contains('modal')) {
        event.target.style.display = "none";
    }
}

/* --- QUIZ --- */
const questions = [
    { q: "Você já apostou mais do que podia perder?", options: ["Nunca", "Às vezes", "Frequentemente"], scores: [0, 5, 10] },
    { q: "Você já tentou recuperar o prejuízo jogando novamente?", options: ["Nunca", "Raramente", "Sempre"], scores: [0, 5, 10] },
    { q: "Você esconde seu hábito de apostar de familiares?", options: ["Não", "Às vezes", "Sim, sempre"], scores: [0, 5, 10] },
    { q: "Apostas já afetaram seu trabalho ou estudos?", options: ["Não", "Talvez", "Sim, fui prejudicado"], scores: [0, 5, 10] },
    { q: "Você sente ansiedade ou irritação quando tenta parar?", options: ["Não", "Um pouco", "Muita"], scores: [0, 5, 10] },
    { q: "Você aposta para fugir de problemas ou sentimentos ruins?", options: ["Não", "Raramente", "Sim"], scores: [0, 5, 10] },
    { q: "Você já mentiu sobre onde conseguiu dinheiro para jogar?", options: ["Nunca", "Uma vez", "Várias vezes"], scores: [0, 5, 10] },
    { q: "Você sente remorso profundo logo após apostar?", options: ["Não", "Às vezes", "Sempre"], scores: [0, 5, 10] },
    { q: "Você aumentou o valor das apostas para sentir a mesma emoção?", options: ["Não", "Sim"], scores: [0, 10] },
    { q: "Você já considerou cometer atos ilegais para financiar o jogo?", options: ["Nunca", "Sim"], scores: [0, 10] }
];

let currentQuestion = 0;
let totalScore = 0;
let userData = { name: '', email: '' };

function iniciarQuiz() {
    const name = document.getElementById('user-name').value;
    const email = document.getElementById('user-email').value;
    if (!name || !email) { alert("Por favor, preencha seus dados."); return; }
    userData.name = name;
    userData.email = email; // Salvando email no objeto global
    
    document.getElementById('quiz-intro').classList.add('hidden');
    document.getElementById('quiz-questions').classList.remove('hidden');
    mostrarPergunta();
}

function mostrarPergunta() {
    if (currentQuestion >= questions.length) { finalizarQuiz(); return; }
    const q = questions[currentQuestion];
    document.getElementById('q-number').innerText = currentQuestion + 1;
    document.getElementById('question-text').innerText = q.q;
    const container = document.getElementById('options-container');
    container.innerHTML = '';
    q.options.forEach((opt, index) => {
        const btn = document.createElement('button');
        btn.className = 'quiz-option';
        btn.innerText = opt;
        btn.onclick = () => { totalScore += q.scores[index]; currentQuestion++; mostrarPergunta(); };
        container.appendChild(btn);
    });
}

function finalizarQuiz() {
    document.getElementById('quiz-questions').classList.add('hidden');
    document.getElementById('quiz-result').classList.remove('hidden');

    const resultDiv = document.getElementById('result-content');
    let risco = "";
    let textoAnalise = "";
    let classeCor = "";
    const modalTitle = document.getElementById('modal-title');
    const modalDesc = document.getElementById('modal-desc');

    // Lógica de Resultado
    if (totalScore < 30) {
        risco = "Baixo Risco";
        classeCor = "analysis-low";
        textoAnalise = `<span class="analysis-title">Situação: Controle</span>Parabéns, ${userData.name}. Suas respostas indicam controle. Mantenha-se vigilante.`;
        modalTitle.innerText = "Você está seguro, mas conhecimento é poder.";
        modalDesc.innerText = "Sua pontuação indica baixo risco. Parabéns! Para se blindar para o futuro, meu material é um excelente estudo.";
    } else if (totalScore < 60) {
        risco = "Risco Moderado";
        classeCor = "analysis-mod";
        textoAnalise = `<span class="analysis-title">Situação: Alerta Ligado</span>Cuidado, ${userData.name}. Você apresenta comportamentos de risco. É hora de parar.`;
        modalTitle.innerText = "Sinal de Alerta Identificado";
        modalDesc.innerText = "Parece que identificamos um padrão de risco moderado. Isso pode ser tratado. Conheça nosso guia completo.";
    } else {
        risco = "Alto Risco";
        classeCor = "analysis-high";
        textoAnalise = `<span class="analysis-title">Situação: Urgência</span>${userData.name}, os sinais de compulsão são claros. Busque ajuda.`;
        modalTitle.innerText = "Não ignore este resultado.";
        modalDesc.innerText = "Identificamos um padrão severo. Respire fundo: isso tem tratamento. Meu guia une ciência e fé para te tirar desse ciclo.";
    }

    // Exibir na tela
    resultDiv.innerHTML = textoAnalise;
    resultDiv.className = `analysis-box ${classeCor}`;

    // 1. Salvar no Navegador (LocalStorage)
    const resultadoSalvo = {
        data: new Date().toISOString(),
        score: totalScore,
        nivel: risco,
        nome: userData.name
    };
    localStorage.setItem('quizResult', JSON.stringify(resultadoSalvo));

    // 2. ENVIAR PARA GOOGLE SHEETS (NOVO!)
    enviarParaPlanilha(risco);

    // Abrir Modal de Vendas após delay
    setTimeout(() => { document.getElementById('modal-book').style.display = "block"; }, 1500);
}

// Função que conversa com seu Script do Google
function enviarParaPlanilha(nivelRisco) {
    const dadosParaEnvio = {
        name: userData.name,
        email: userData.email,
        score: totalScore,
        level: nivelRisco
    };

    fetch(GOOGLE_SCRIPT_URL, {
        method: 'POST',
        mode: 'no-cors', // Necessário para enviar dados para Google Apps Script
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(dadosParaEnvio)
    })
    .then(() => console.log("Lead salvo na planilha com sucesso!"))
    .catch(err => console.error("Erro ao salvar lead:", err));
}

/* --- JOGO ANTI-ANSIEDADE --- */
let gameScore = 0;
let gameActive = false;
let spawnInterval;
let timerInterval;
let gameSeconds = 0;

function startGame() {
    const board = document.getElementById('game-board');
    const startScreen = document.getElementById('start-screen-game');
    
    startScreen.style.display = 'none';
    const oldBubbles = document.querySelectorAll('.bubble');
    oldBubbles.forEach(b => b.remove());

    gameScore = 0;
    gameSeconds = 0;
    document.getElementById('score').innerText = gameScore;
    document.getElementById('timer').innerText = "00:00";
    gameActive = true;
    
    if(timerInterval) clearInterval(timerInterval);
    if(spawnInterval) clearInterval(spawnInterval);

    spawnInterval = setInterval(createBubble, 800);
    timerInterval = setInterval(updateTimer, 1000);
}

function updateTimer() {
    if(!gameActive) return;
    gameSeconds++;
    const minutes = Math.floor(gameSeconds / 60);
    const seconds = gameSeconds % 60;
    const strMin = minutes < 10 ? `0${minutes}` : minutes;
    const strSec = seconds < 10 ? `0${seconds}` : seconds;
    document.getElementById('timer').innerText = `${strMin}:${strSec}`;
}

function createBubble() {
    if (!gameActive) return;
    const board = document.getElementById('game-board');
    const bubble = document.createElement('div');
    bubble.className = 'bubble';
    
    const size = Math.floor(Math.random() * 30) + 40; 
    bubble.style.width = `${size}px`;
    bubble.style.height = `${size}px`;
    
    const maxX = board.clientWidth - size;
    const randomX = Math.random() * maxX;
    
    bubble.style.left = `${randomX}px`;
    bubble.style.bottom = '-80px'; 
    
    const speed = Math.random() * 3 + 2; 
    bubble.style.transition = `bottom ${speed}s linear, transform 0.2s, opacity 0.2s`; 
    
    bubble.onmousedown = popBubble; 
    bubble.ontouchstart = popBubble; 
    board.appendChild(bubble);

    setTimeout(() => { bubble.style.bottom = `${board.clientHeight + 100}px`; }, 50);
    setTimeout(() => { if (bubble.parentNode) bubble.remove(); }, speed * 1000);
}

function popBubble(e) {
    if(e.cancelable) e.preventDefault(); 
    if(!this.parentNode) return;
    gameScore++;
    document.getElementById('score').innerText = gameScore;
    this.style.transform = "scale(1.5)";
    this.style.opacity = "0";
    setTimeout(() => { if (this.parentNode) this.remove(); }, 200);
}

function toggleFullScreen() {
    const elem = document.getElementById("game-board");
    if (!document.fullscreenElement) {
        if (elem.requestFullscreen) elem.requestFullscreen();
        else if (elem.webkitRequestFullscreen) elem.webkitRequestFullscreen();
        else if (elem.msRequestFullscreen) elem.msRequestFullscreen();
    } else {
        if (document.exitFullscreen) document.exitFullscreen();
    }
}

/* --- RESPIRE COMIGO --- */
let cycles = 0;
const maxCycles = 5;
const textDisplay = document.getElementById('breath-text');
const img = document.getElementById('breath-img');
const btnBreath = document.getElementById('btn-breath');

function iniciarRespiracao() {
    btnBreath.style.display = 'none';
    cycles = 0;
    executarCiclo();
}

function executarCiclo() {
    if (cycles >= maxCycles) {
        textDisplay.innerText = "Ciclo concluído. Sinta a calma.";
        btnBreath.innerText = "Repetir Exercício";
        btnBreath.style.display = 'inline-block';
        img.className = ''; 
        return;
    }
    textDisplay.innerText = "Inspire pelo nariz...";
    img.className = 'breath-grow';
    setTimeout(() => {
        textDisplay.innerText = "Segure o ar...";
        img.className = 'breath-hold'; 
        setTimeout(() => {
            textDisplay.innerText = "Solte pela boca devagar...";
            img.className = 'breath-shrink';
            setTimeout(() => { cycles++; executarCiclo(); }, 6000); 
        }, 4000); 
    }, 4000); 
}

/* --- VERSÍCULOS --- */
const verses = [
    { t: "Todas as coisas me são lícitas, mas nem todas me convêm...", r: "1 Coríntios 6:12", a: "Eu escolho ser livre." },
    { t: "Porque não nos deu Deus espírito de temor...", r: "2 Timóteo 1:7", a: "Tenho força para mudar." },
    { t: "Vigiai e orai...", r: "Mateus 26:41", a: "Reconhecer minha fraqueza é o primeiro passo." }
];
function novoVersiculo() {
    const v = verses[Math.floor(Math.random() * verses.length)];
    document.getElementById('verse-text').innerText = `"${v.t}"`;
    document.getElementById('verse-ref').innerText = v.r;
    document.getElementById('affirmation-text').innerText = v.a;
}

/* --- DEPOIMENTOS --- */
const testimonials = [
    { t: "Parar foi a única saída.", a: "- Roberto D." },
    { t: "Recuperei a confiança da minha esposa.", a: "- Marcos S." },
    { t: "O livro mudou minha visão.", a: "- Juliana P." }
];
let testIndex = 0;
function mudarDepoimento(dir) {
    testIndex += dir;
    if (testIndex < 0) testIndex = testimonials.length - 1;
    if (testIndex >= testimonials.length) testIndex = 0;
    const div = document.getElementById('testimonial-content');
    div.style.opacity = 0;
    setTimeout(() => {
        div.innerHTML = `<p class="quote">"${testimonials[testIndex].t}"</p><p class="author">${testimonials[testIndex].a}</p>`;
        div.style.opacity = 1;
    }, 200);
}

/* --- PWA --- */
let deferredPrompt;
const installBtn = document.getElementById('btn-install');
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => navigator.serviceWorker.register('./sw.js').catch(err => console.log('Erro SW:', err)));
}
window.addEventListener('beforeinstallprompt', (e) => {
    e.preventDefault();
    deferredPrompt = e;
    if(installBtn) { installBtn.classList.remove('hidden'); installBtn.style.display = 'block'; }
});
if(installBtn) {
    installBtn.addEventListener('click', async () => {
        if (!deferredPrompt) return;
        deferredPrompt.prompt();
        const { outcome } = await deferredPrompt.userChoice;
        deferredPrompt = null;
        if(outcome === 'accepted') installBtn.style.display = 'none';
    });
}
window.addEventListener('appinstalled', () => { if(installBtn) installBtn.style.display = 'none'; });

/* --- CONSENTIMENTO DE COOKIES (LGPD) --- */
const cookieBanner = document.getElementById('cookie-banner');
const acceptCookiesBtn = document.getElementById('btn-accept-cookies');

// Verifica se o usuário já aceitou antes
if (!localStorage.getItem('livrebet_consent')) {
    // Se não aceitou, mostra o banner (remove a classe hidden)
    // Pequeno delay para animação ficar suave
    setTimeout(() => {
        cookieBanner.classList.remove('hidden');
        cookieBanner.style.display = 'block';
    }, 1000);
}

acceptCookiesBtn.addEventListener('click', () => {
    // Salva a decisão no navegador
    localStorage.setItem('livrebet_consent', 'true');
    
    // Esconde o banner
    cookieBanner.style.display = 'none';
});

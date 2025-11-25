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

/* --- CONTADOR DE DIAS --- */
document.addEventListener('DOMContentLoaded', () => {
    atualizarContador();
    atualizarDepoimento();
    
    // Verifica se já fez o quiz antes
    const savedResult = localStorage.getItem('quizResult');
    if(savedResult) {
        // Opcional: Você pode mostrar uma mensagem de "Bem vindo de volta" baseada no risco
    }
});

function configurarData() {
    const data = prompt("Qual foi o último dia que você apostou? (AAAA-MM-DD)", "2024-01-01");
    if (data) {
        localStorage.setItem('dataParada', data);
        atualizarContador();
    }
}

function atualizarContador() {
    const dataSalva = localStorage.getItem('dataParada');
    const display = document.getElementById('days-count');
    if (!dataSalva) { display.innerText = "0d limpo"; return; }
    
    const inicio = new Date(dataSalva);
    const hoje = new Date();
    const diffTime = Math.abs(hoje - inicio);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)); 
    display.innerText = `${diffDays}d limpo`;
}

/* --- QUIZ DE 10 PERGUNTAS E LÓGICA DE POPUP --- */
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
    
    document.getElementById('quiz-intro').classList.add('hidden');
    document.getElementById('quiz-questions').classList.remove('hidden');
    mostrarPergunta();
}

function mostrarPergunta() {
    if (currentQuestion >= questions.length) {
        finalizarQuiz();
        return;
    }

    const q = questions[currentQuestion];
    document.getElementById('q-number').innerText = currentQuestion + 1;
    document.getElementById('question-text').innerText = q.q;
    const container = document.getElementById('options-container');
    container.innerHTML = '';

    q.options.forEach((opt, index) => {
        const btn = document.createElement('button');
        btn.className = 'quiz-option';
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
    document.getElementById('quiz-questions').classList.add('hidden');
    document.getElementById('quiz-result').classList.remove('hidden');

    const resultDiv = document.getElementById('result-content');
    let risco = "";
    let textoAnalise = "";
    let classeCor = "";
    
    // Textos do Modal
    const modalTitle = document.getElementById('modal-title');
    const modalDesc = document.getElementById('modal-desc');

    if (totalScore < 30) {
        // BAIXO RISCO
        risco = "Baixo Risco";
        classeCor = "analysis-low";
        textoAnalise = `<span class="analysis-title">Situação: Controle</span>Parabéns, ${userData.name}. Suas respostas indicam que você tem controle sobre seus impulsos. No entanto, o vício é silencioso. Mantenha-se vigilante.`;
        
        // Modal Texto - Baixo Risco
        modalTitle.innerText = "Você está seguro, mas conhecimento é poder.";
        modalDesc.innerText = "Sua pontuação indica que você não corre riscos imediatos. Parabéns! Se deseja entender profundamente o mecanismo do vício para ajudar um amigo ou se blindar para o futuro, meu material é um excelente estudo. Fique à vontade para baixar a amostra grátis abaixo.";
    
    } else if (totalScore < 60) {
        // MODERADO
        risco = "Risco Moderado";
        classeCor = "analysis-mod";
        textoAnalise = `<span class="analysis-title">Situação: Alerta Ligado</span>Cuidado, ${userData.name}. Você apresenta comportamentos que precedem o vício compulsivo. Você já usa o jogo como escape emocional. É hora de parar antes que piore.`;
        
        // Modal Texto - Moderado/Alto
        modalTitle.innerText = "Sinal de Alerta Identificado";
        modalDesc.innerText = "Parece que identificamos um padrão que sugere o início de uma compulsão. Mas calma: isso pode ser tratado e quanto antes você fizer isso, melhor. Abaixo segue o nosso material completo: 8 capítulos com embasamento neurocientífico, psicológico e cristão. Se não puder investir agora, te dou o 1º capítulo de presente.";
    
    } else {
        // ALTO RISCO
        risco = "Alto Risco";
        classeCor = "analysis-high";
        textoAnalise = `<span class="analysis-title">Situação: Urgência</span>${userData.name}, os sinais de compulsão são claros. O jogo está afetando suas finanças e emoções. Não lute sozinho. Buscar ajuda não é vergonha, é coragem.`;
        
        // Modal Texto - Alto
        modalTitle.innerText = "Não ignore este resultado.";
        modalDesc.innerText = "Identificamos um padrão severo que sugere compulsão. Respire fundo: isso tem tratamento. Meu guia une ciência e fé para te tirar desse ciclo. Aproveite o desconto para começar a mudança hoje, ou baixe o capítulo gratuito se não puder comprar agora. O importante é começar.";
    }

    // Exibir análise na página
    resultDiv.innerHTML = textoAnalise;
    resultDiv.className = `analysis-box ${classeCor}`;

    // Salvar no LocalStorage
    const resultadoSalvo = {
        data: new Date().toISOString(),
        score: totalScore,
        nivel: risco,
        nome: userData.name
    };
    localStorage.setItem('quizResult', JSON.stringify(resultadoSalvo));

    // Abrir Modal após 1.5 segundos
    setTimeout(abrirModal, 1500);
}

/* --- FUNÇÕES MODAL --- */
function abrirModal() {
    document.getElementById('modal-book').style.display = "block";
}
function fecharModal() {
    document.getElementById('modal-book').style.display = "none";
}
window.onclick = function(event) {
    const modal = document.getElementById('modal-book');
    if (event.target == modal) {
        modal.style.display = "none";
    }
}

/* --- JOGO ANTI-ANSIEDADE (ZEN) --- */
let gameScore = 0;
let gameActive = false;
let spawnInterval;

function startGame() {
    const board = document.getElementById('game-board');
    document.getElementById('start-screen-game').style.display = 'none';
    board.innerHTML = ''; 
    gameScore = 0;
    document.getElementById('score').innerText = gameScore;
    gameActive = true;
    spawnInterval = setInterval(createBubble, 800);
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
    bubble.style.transition = `bottom ${speed}s linear`;
    
    bubble.onmousedown = popBubble; 
    bubble.ontouchstart = popBubble; 

    board.appendChild(bubble);

    setTimeout(() => { bubble.style.bottom = `${board.clientHeight + 50}px`; }, 50);
    setTimeout(() => { if (bubble.parentNode) bubble.remove(); }, speed * 1000);
}

function popBubble(e) {
    e.preventDefault(); 
    if(!this.parentNode) return;
    gameScore++;
    document.getElementById('score').innerText = gameScore;
    this.style.transform = "scale(1.5)";
    this.style.opacity = "0";
    setTimeout(() => { if (this.parentNode) this.remove(); }, 200);
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
            setTimeout(() => {
                cycles++;
                executarCiclo();
            }, 6000); 
        }, 4000); 
    }, 4000); 
}

/* --- VERSÍCULOS --- */
const verses = [
    { t: "Todas as coisas me são lícitas, mas nem todas me convêm. Todas as coisas me são lícitas, mas eu não me deixarei dominar por nenhuma.", r: "1 Coríntios 6:12", a: "Eu escolho ser livre, não escravo de um impulso." },
    { t: "Porque não nos deu Deus espírito de temor, mas de fortaleza, e de amor, e de moderação.", r: "2 Timóteo 1:7", a: "O medo de parar é uma mentira. Eu tenho força para mudar." },
    { t: "Vigiai e orai, para que não entreis em tentação; na verdade, o espírito está pronto, mas a carne é fraca.", r: "Mateus 26:41", a: "Reconhecer minha fraqueza é o primeiro passo para não cair." },
    { t: "O ladrão não vem senão a roubar, a matar, e a destruir; eu vim para que tenham vida, e a tenham com abundância.", r: "João 10:10", a: "O vício rouba meu tempo e dinheiro. A vida real me devolve a dignidade." }
];

function novoVersiculo() {
    const v = verses[Math.floor(Math.random() * verses.length)];
    document.getElementById('verse-text').innerText = `"${v.t}"`;
    document.getElementById('verse-ref').innerText = v.r;
    document.getElementById('affirmation-text').innerText = v.a;
}

/* --- DEPOIMENTOS --- */
const testimonials = [
    { t: "Eu achava que 'só mais uma vez' resolveria meus problemas. Só aumentava o buraco. Parar foi a única saída.", a: "- Roberto D." },
    { t: "Recuperei a confiança da minha esposa. Não tem prêmio em dinheiro que pague isso.", a: "- Marcos S." },
    { t: "O livro me ensinou que o problema não era o dinheiro, era o vazio que eu tentava preencher.", a: "- Juliana P." }
];
let testIndex = 0;

function mudarDepoimento(dir) {
    testIndex += dir;
    if (testIndex < 0) testIndex = testimonials.length - 1;
    if (testIndex >= testimonials.length) testIndex = 0;
    atualizarDepoimento();
}

function atualizarDepoimento() {
    const div = document.getElementById('testimonial-content');
    div.style.opacity = 0;
    setTimeout(() => {
        div.innerHTML = `<p class="quote">"${testimonials[testIndex].t}"</p><p class="author">${testimonials[testIndex].a}</p>`;
        div.style.opacity = 1;
    }, 200);
}

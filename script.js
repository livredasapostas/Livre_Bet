/* --- GERENCIAMENTO DE TEMA (DARK MODE) --- */
const toggleBtn = document.getElementById('theme-toggle');
const root = document.documentElement;

// Verifica preferência salva ou do sistema
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
    if (currentTheme === 'light') {
        root.setAttribute('data-theme', 'dark');
        localStorage.setItem('theme', 'dark');
        toggleBtn.innerText = '☀️';
    } else {
        root.setAttribute('data-theme', 'light');
        localStorage.setItem('theme', 'light');
        toggleBtn.innerText = '🌙';
    }
});

/* --- CONTADOR DE DIAS --- */
document.addEventListener('DOMContentLoaded', () => {
    atualizarContador();
    atualizarDepoimento();
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

/* --- JOGO ANTI-ANSIEDADE (VERSÃO ZEN) --- */
let gameScore = 0;
let gameActive = false;
let spawnInterval;

function startGame() {
    const board = document.getElementById('game-board');
    // Limpa tela inicial
    document.getElementById('start-screen-game').style.display = 'none';
    board.innerHTML = ''; 
    
    gameScore = 0;
    document.getElementById('score').innerText = gameScore;
    gameActive = true;

    // Criar bolhas infinitamente
    spawnInterval = setInterval(createBubble, 800);
}

function createBubble() {
    if (!gameActive) return;
    
    const board = document.getElementById('game-board');
    const bubble = document.createElement('div');
    bubble.className = 'bubble';
    
    // Tamanho aleatório entre 40px e 70px
    const size = Math.floor(Math.random() * 30) + 40;
    bubble.style.width = `${size}px`;
    bubble.style.height = `${size}px`;
    
    // Posição horizontal aleatória (garantindo que não saia da borda)
    const maxX = board.clientWidth - size;
    const randomX = Math.random() * maxX;
    bubble.style.left = `${randomX}px`;
    
    // Começa abaixo do board
    bubble.style.bottom = '-80px'; 
    
    // Velocidade de subida aleatória
    const speed = Math.random() * 3 + 2; // entre 2 e 5 segundos
    bubble.style.transition = `bottom ${speed}s linear`;
    
    bubble.onmousedown = popBubble; // PC
    bubble.ontouchstart = popBubble; // Mobile

    board.appendChild(bubble);

    // Forçar reflow para ativar transição CSS
    setTimeout(() => {
        bubble.style.bottom = `${board.clientHeight + 50}px`;
    }, 50);

    // Remove do DOM quando sair da tela
    setTimeout(() => {
        if (bubble.parentNode) bubble.remove();
    }, speed * 1000);
}

function popBubble(e) {
    // Evita double click/touch
    e.preventDefault(); 
    if(!this.parentNode) return;

    gameScore++;
    document.getElementById('score').innerText = gameScore;
    
    // Efeito visual simples de "pop"
    this.style.transform = "scale(1.5)";
    this.style.opacity = "0";
    
    setTimeout(() => {
        if (this.parentNode) this.remove();
    }, 200);
}


/* --- RESPIRE COMIGO (LÓGICA LIMPA) --- */
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
        img.className = ''; // Remove animações
        return;
    }

    // Inspire (4s)
    textDisplay.innerText = "Inspire pelo nariz...";
    img.className = 'breath-grow';

    setTimeout(() => {
        // Segure (4s)
        textDisplay.innerText = "Segure o ar...";
        img.className = 'breath-hold'; // Mantém grande

        setTimeout(() => {
            // Expire (6s)
            textDisplay.innerText = "Solte pela boca devagar...";
            img.className = 'breath-shrink';

            setTimeout(() => {
                cycles++;
                executarCiclo();
            }, 6000); // Fim da expiração

        }, 4000); // Fim do segurar

    }, 4000); // Fim da inspiração
}

/* --- VERSÍCULOS & VERDADE (VISCERAL) --- */
const verses = [
    { 
        t: "Todas as coisas me são lícitas, mas nem todas me convêm. Todas as coisas me são lícitas, mas eu não me deixarei dominar por nenhuma.", 
        r: "1 Coríntios 6:12", 
        a: "Eu escolho ser livre, não escravo de um impulso." 
    },
    { 
        t: "Porque não nos deu Deus espírito de temor, mas de fortaleza, e de amor, e de moderação.", 
        r: "2 Timóteo 1:7", 
        a: "O medo de parar é uma mentira. Eu tenho força para mudar." 
    },
    { 
        t: "Vigiai e orai, para que não entreis em tentação; na verdade, o espírito está pronto, mas a carne é fraca.", 
        r: "Mateus 26:41", 
        a: "Reconhecer minha fraqueza é o primeiro passo para não cair." 
    },
    { 
        t: "O ladrão não vem senão a roubar, a matar, e a destruir; eu vim para que tenham vida, e a tenham com abundância.", 
        r: "João 10:10", 
        a: "O vício rouba meu tempo e dinheiro. A vida real me devolve a dignidade." 
    }
];

function novoVersiculo() {
    const v = verses[Math.floor(Math.random() * verses.length)];
    document.getElementById('verse-text').innerText = `"${v.t}"`;
    document.getElementById('verse-ref').innerText = v.r;
    document.getElementById('affirmation-text').innerText = v.a;
}

/* --- QUIZ (MANTIDO) --- */
// (A lógica do quiz permanece a mesma da versão anterior, 
// apenas certifique-se de que as IDs no HTML batam, o que já fiz acima)
// ... Adicione aqui o código do Quiz e PDF da resposta anterior se necessário,
// ou mantenha o arquivo script.js antigo e só substitua as partes novas acima.

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
        div.innerHTML = `
            <p class="quote">"${testimonials[testIndex].t}"</p>
            <p class="author">${testimonials[testIndex].a}</p>
        `;
        div.style.opacity = 1;
    }, 200);
}

// Funções do Modal e PDF continuam iguais à versão anterior.
function abrirModal() { document.getElementById('modal-book').style.display = "block"; }
function fecharModal() { document.getElementById('modal-book').style.display = "none"; }
window.onclick = function(e) { if (e.target == document.getElementById('modal-book')) fecharModal(); }

// JS PDF - Mantido da versão anterior
let totalScore = 0;
let userData = { name: '', email: '' };
const questions = [
    { q: "Você já apostou mais do que podia perder?", options: ["Nunca", "Às vezes", "Frequentemente"], scores: [0, 5, 10] },
    { q: "Você já tentou recuperar o prejuízo jogando novamente?", options: ["Nunca", "Raramente", "Sempre"], scores: [0, 5, 10] },
    { q: "Apostas já afetaram seu trabalho ou estudos?", options: ["Não", "Talvez", "Sim"], scores: [0, 5, 10] },
    { q: "Você sente culpa após apostar?", options: ["Não", "Às vezes", "Sempre"], scores: [0, 5, 10] }
]; 
// (Se quiser o quiz completo, copie o array da resposta anterior)
let currentQuestion = 0;

function iniciarQuiz() {
    userData.name = document.getElementById('user-name').value;
    userData.email = document.getElementById('user-email').value;
    if(!userData.name || !userData.email) { alert("Preencha os dados"); return; }
    
    document.getElementById('quiz-intro').classList.add('hidden');
    document.getElementById('quiz-questions').classList.remove('hidden');
    mostrarPergunta();
}

function mostrarPergunta() {
    if (currentQuestion >= questions.length) { finalizarQuiz(); return; }
    const q = questions[currentQuestion];
    document.getElementById('question-text').innerText = q.q;
    const container = document.getElementById('options-container');
    container.innerHTML = '';
    q.options.forEach((opt, i) => {
        const btn = document.createElement('button');
        btn.className = 'quiz-option';
        btn.innerText = opt;
        btn.onclick = () => { totalScore += q.scores[i]; currentQuestion++; mostrarPergunta(); };
        container.appendChild(btn);
    });
}

function finalizarQuiz() {
    document.getElementById('quiz-questions').classList.add('hidden');
    document.getElementById('quiz-result').classList.remove('hidden');
    let msg = totalScore < 15 ? "Baixo Risco" : "Risco Elevado";
    document.getElementById('result-content').innerHTML = `Pontos: ${totalScore} - ${msg}`;
    if(totalScore >= 15) setTimeout(abrirModal, 2000);
}

function baixarPDF() {
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();
    doc.text(`Relatório LivreBet - ${userData.name}`, 20, 20);
    doc.text(`Resultado: ${totalScore} pontos`, 20, 30);
    doc.save("LivreBet-Relatorio.pdf");
}

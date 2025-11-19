/* --- CONTADOR DE DIAS (LOCALSTORAGE) --- */
document.addEventListener('DOMContentLoaded', () => {
    atualizarContador();
    atualizarDepoimento();
    
    // Checa se precisa mostrar contador de respiração
    const ciclos = localStorage.getItem('ciclosRespiracao') || 0;
    // Opcional: mostrar quantos ciclos já fez
});

function configurarData() {
    const data = prompt("Quando foi seu último dia de aposta? (Formato: AAAA-MM-DD)", "2024-01-01");
    if (data) {
        localStorage.setItem('dataParada', data);
        atualizarContador();
    }
}

function atualizarContador() {
    const dataSalva = localStorage.getItem('dataParada');
    const display = document.getElementById('days-count');
    
    if (!dataSalva) {
        display.innerText = "0 dias livre";
        return;
    }

    const inicio = new Date(dataSalva);
    const hoje = new Date();
    const diffTime = Math.abs(hoje - inicio);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)); 
    
    display.innerText = `${diffDays} dias livre!`;
}

/* --- QUIZ --- */
const questions = [
    { q: "Você já apostou mais do que podia perder?", options: ["Nunca", "Às vezes", "Frequentemente"], scores: [0, 5, 10] },
    { q: "Você já tentou recuperar o prejuízo jogando novamente?", options: ["Nunca", "Raramente", "Sempre"], scores: [0, 5, 10] },
    { q: "Você esconde seu hábito de apostar de familiares?", options: ["Não", "As vezes", "Sim, sempre"], scores: [0, 5, 10] },
    { q: "Você sente ansiedade ou irritação quando não pode apostar?", options: ["Não", "Um pouco", "Muita"], scores: [0, 5, 10] },
    { q: "Apostas já afetaram seu trabalho ou estudos?", options: ["Não", "Talvez", "Sim, fui prejudicado"], scores: [0, 5, 10] },
    { q: "Você já pediu dinheiro emprestado para apostar?", options: ["Nunca", "Uma vez", "Várias vezes"], scores: [0, 5, 10] },
    { q: "Você sente culpa após apostar?", options: ["Não", "Às vezes", "Sempre"], scores: [0, 5, 10] },
    { q: "Você aposta para fugir de problemas ou sentimentos ruins?", options: ["Não", "Raramente", "Sim"], scores: [0, 5, 10] },
    { q: "Você aumentou o valor das apostas para sentir a mesma emoção?", options: ["Não", "Sim"], scores: [0, 10] },
    { q: "Você já vendeu algo pessoal para financiar apostas?", options: ["Nunca", "Sim"], scores: [0, 10] }
];

let currentQuestion = 0;
let totalScore = 0;
let userData = { name: '', email: '' };

function iniciarQuiz() {
    const name = document.getElementById('user-name').value;
    const email = document.getElementById('user-email').value;

    if (!name || !email) {
        alert("Por favor, preencha nome e e-mail.");
        return;
    }

    userData.name = name;
    userData.email = email;

    // Gerar JSON para download
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(userData));
    const downloadAnchorNode = document.createElement('a');
    downloadAnchorNode.setAttribute("href", dataStr);
    downloadAnchorNode.setAttribute("download", "meus_dados_livrebet.json");
    document.body.appendChild(downloadAnchorNode);
    downloadAnchorNode.click();
    downloadAnchorNode.remove();

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
    document.getElementById('question-text').innerText = `${currentQuestion + 1}. ${q.q}`;
    const container = document.getElementById('options-container');
    container.innerHTML = '';

    q.options.forEach((opt, index) => {
        const btn = document.createElement('button');
        btn.className = 'quiz-option';
        btn.innerText = opt;
        btn.onclick = () => responder(q.scores[index]);
        container.appendChild(btn);
    });
}

function responder(points) {
    totalScore += points;
    currentQuestion++;
    mostrarPergunta();
}

function finalizarQuiz() {
    document.getElementById('quiz-questions').classList.add('hidden');
    document.getElementById('quiz-result').classList.remove('hidden');

    const resultDiv = document.getElementById('result-content');
    const msgBiblica = document.getElementById('biblical-msg');
    let categoria = '';
    let corClass = '';

    if (totalScore < 20) {
        categoria = "Baixo Risco";
        corClass = "result-baixo";
        msgBiblica.innerText = "Continue vigilante. 'Sede sóbrios; vigiai.' - 1 Pedro 5:8";
    } else if (totalScore < 50) {
        categoria = "Risco Moderado";
        corClass = "result-moderado";
        msgBiblica.innerText = "Atenção aos sinais. 'Não nos deixes cair em tentação.' - Mateus 6:13";
        setTimeout(abrirModal, 2000); // Abre oferta do livro
    } else {
        categoria = "Alto Risco";
        corClass = "result-alto";
        msgBiblica.innerText = "Procure ajuda urgente. 'O Senhor é refúgio para os oprimidos.' - Salmo 9:9";
        setTimeout(abrirModal, 1500); // Abre oferta do livro
    }

    resultDiv.innerHTML = `<p>Pontuação: ${totalScore}</p><p class="${corClass}" style="padding:10px;">Categoria: ${categoria}</p>`;
}

// Função JS PDF usando a biblioteca importada no HTML
function baixarPDF() {
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();

    doc.setFontSize(20);
    doc.text("Relatório LivreBet", 20, 20);
    
    doc.setFontSize(12);
    doc.text(`Nome: ${userData.name}`, 20, 40);
    doc.text(`Data: ${new Date().toLocaleDateString()}`, 20, 50);
    doc.text(`Pontuação no Quiz: ${totalScore}`, 20, 60);
    
    let status = totalScore < 20 ? "Baixo Risco" : (totalScore < 50 ? "Risco Moderado" : "Alto Risco");
    doc.text(`Status Identificado: ${status}`, 20, 70);
    
    doc.text("Lembre-se: O primeiro passo para a mudança é reconhecer.", 20, 90);
    
    doc.save("LivreBet-Relatorio.pdf");
}

/* --- MODAL POPUP --- */
function abrirModal() {
    document.getElementById('modal-book').style.display = "block";
}
function fecharModal() {
    document.getElementById('modal-book').style.display = "none";
}
// Fechar se clicar fora
window.onclick = function(event) {
    const modal = document.getElementById('modal-book');
    if (event.target == modal) {
        modal.style.display = "none";
    }
}

/* --- JOGO ANTI-ANSIEDADE --- */
let gameScore = 0;
let timeLeft = 30;
let gameInterval;
let spawnInterval;

function startGame() {
    document.getElementById('start-screen-game').style.display = 'none';
    gameScore = 0;
    timeLeft = 30;
    document.getElementById('score').innerText = gameScore;
    document.getElementById('time').innerText = timeLeft;
    document.getElementById('game-board').innerHTML = ''; // Limpa tabuleiro

    // Timer
    gameInterval = setInterval(() => {
        timeLeft--;
        document.getElementById('time').innerText = timeLeft;
        if (timeLeft <= 0) endGame();
    }, 1000);

    // Spawn Bolhas
    spawnInterval = setInterval(createBubble, 600);
}

function createBubble() {
    const board = document.getElementById('game-board');
    const bubble = document.createElement('div');
    bubble.className = 'bubble';
    
    // Posição aleatória
    const x = Math.random() * (board.clientWidth - 50);
    const y = Math.random() * (board.clientHeight - 50);
    
    bubble.style.left = `${x}px`;
    bubble.style.top = `${y}px`;
    
    bubble.onclick = function() {
        gameScore++;
        document.getElementById('score').innerText = gameScore;
        this.remove();
    };

    board.appendChild(bubble);

    // Remove bolha após um tempo se não clicar
    setTimeout(() => {
        if (bubble.parentNode) bubble.remove();
    }, 2000);
}

function endGame() {
    clearInterval(gameInterval);
    clearInterval(spawnInterval);
    const board = document.getElementById('game-board');
    board.innerHTML = `
        <div id="start-screen-game" style="flex-direction:column;">
            <h3>Fim de jogo!</h3>
            <p>Você estourou ${gameScore} ansiedades.</p>
            <p>Respire fundo e continue firme.</p>
            <button class="btn-primary" onclick="startGame()">Jogar Novamente</button>
        </div>
    `;
}

/* --- RESPIRE COMIGO --- */
let cycles = 0;
const maxCycles = 5;
const textDisplay = document.getElementById('breath-text');
const circle = document.getElementById('breath-circle');

function iniciarRespiracao() {
    document.getElementById('btn-breath').style.display = 'none';
    cycles = 0;
    executarCiclo();
}

function executarCiclo() {
    if (cycles >= maxCycles) {
        textDisplay.innerText = "Muito bem. Sinta a paz.";
        document.getElementById('btn-breath').style.display = 'inline-block';
        
        // Salvar no localStorage
        let totalCiclos = parseInt(localStorage.getItem('ciclosRespiracao') || '0');
        localStorage.setItem('ciclosRespiracao', totalCiclos + 1);
        return;
    }

    // Inspire (4s)
    textDisplay.innerText = "Inspire...";
    circle.className = 'circle grow';

    setTimeout(() => {
        // Segure (4s)
        textDisplay.innerText = "Segure...";
        circle.className = 'circle hold';

        setTimeout(() => {
            // Expire (6s)
            textDisplay.innerText = "Expire...";
            circle.className = 'circle shrink';

            setTimeout(() => {
                cycles++;
                executarCiclo();
            }, 6000); // Tempo da expiração

        }, 4000); // Tempo do segurar

    }, 4000); // Tempo da inspiração
}

/* --- VERSÍCULOS --- */
const verses = [
    { t: "E conhecereis a verdade, e a verdade vos libertará.", r: "João 8:32", a: "A verdade ilumina o caminho." },
    { t: "Tudo posso naquele que me fortalece.", r: "Filipenses 4:13", a: "Minha força vem do alto." },
    { t: "Não temas, porque eu sou contigo.", r: "Isaías 41:10", a: "Nunca estou sozinho." },
    { t: "Deus é o nosso refúgio e fortaleza.", r: "Salmo 46:1", a: "Estou seguro nas mãos de Deus." },
    { t: "Vinde a mim, todos os que estais cansados.", r: "Mateus 11:28", a: "O descanso da minha alma está Nele." }
];

function novoVersiculo() {
    const randomIndex = Math.floor(Math.random() * verses.length);
    const v = verses[randomIndex];
    document.getElementById('verse-text').innerText = `"${v.t}"`;
    document.getElementById('verse-ref').innerText = v.r;
    document.getElementById('affirmation-text').innerText = v.a;
}

/* --- DEPOIMENTOS --- */
const testimonials = [
    { t: "Achei que nunca ia sair dessa, mas com fé e as ferramentas certas, estou limpo há 6 meses.", a: "- João M." },
    { t: "O livro mudou minha visão sobre o dinheiro e sobre Deus. Recomendo.", a: "- Carlos S." },
    { t: "Foi difícil no início, mas usar o exercício de respiração me ajudou nas crises.", a: "- Ana P." }
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
// LivreBet - JS Principal
// ---------------------------------------------------
// Código modularizado e comentado para facilitar ajustes

// 1. HEADER e Contador de Dias
const diasContador = document.getElementById('dias-contador');
const btnJornada = document.getElementById('btn-jornada');

// Atualiza contador de dias
function atualizarDias() {
    const dataParada = localStorage.getItem('dataParada');
    if (dataParada) {
        const hoje = new Date();
        const parada = new Date(dataParada);
        const diff = Math.floor((hoje - parada)/(1000*60*60*24));
        diasContador.textContent = diff >= 0 ? diff : 0;
    } else {
        diasContador.textContent = '0';
    }
}
atualizarDias();

// Iniciar jornada
btnJornada.onclick = function() {
    let parada = prompt("Quando você parou de apostar? (Informe no formato YYYY-MM-DD)");
    if (parada && /^\d{4}-\d{2}-\d{2}$/.test(parada)) {
        localStorage.setItem('dataParada', parada);
        atualizarDias();
        alert('Parabéns por dar este passo! Seu progresso será acompanhado.');
    } else if(parada){
        alert('Data inválida! Tente no formato YYYY-MM-DD.');
    }
};

// 2. QUIZ
const quizInfos = document.getElementById('quiz-infos');
const quizForm = document.getElementById('quiz-form');
const quizResult = document.getElementById('quiz-result');

const perguntasQuiz = [
    {
        texto: "Com que frequência você aposta?",
        opcoes: ["Raramente", "Algumas vezes por semana", "Diariamente"],
        pontuacao: [0, 1, 2]
    },
    {
        texto: "Sente vontade de apostar mesmo sem ter dinheiro?",
        opcoes: ["Nunca", "Às vezes", "Quase sempre"],
        pontuacao: [0, 1, 2]
    },
    {
        texto: "Já teve problemas financeiros por causa das apostas?",
        opcoes: ["Não", "Poucos problemas", "Muitos problemas"],
        pontuacao: [0, 1, 2]
    },
    {
        texto: "A aposta já afetou sua relação com alguém?",
        opcoes: ["Não", "Pouco", "Muito"],
        pontuacao: [0, 1, 2]
    },
    {
        texto: "Você já mentiu sobre apostas?",
        opcoes: ["Nunca", "Poucas vezes", "Muitas vezes"],
        pontuacao: [0, 1, 2]
    },
    {
        texto: "Sente ansiedade ou culpa após apostar?",
        opcoes: ["Não", "Algumas vezes", "Sempre"],
        pontuacao: [0, 1, 2]
    },
    {
        texto: "Tenta parar mas não consegue?",
        opcoes: ["Consigo controlar", "Dificuldade", "Não consigo"],
        pontuacao: [0, 1, 2]
    },
    {
        texto: "Aposta para aliviar sentimentos ruins?",
        opcoes: ["Não", "Às vezes", "Com frequência"],
        pontuacao: [0, 1, 2]
    },
    {
        texto: "Perde a noção do tempo quando aposta?",
        opcoes: ["Não", "Às vezes", "Sim"],
        pontuacao: [0, 1, 2]
    },
    {
        texto: "Já tentou recuperar o dinheiro perdido?",
        opcoes: ["Não", "Poucas vezes", "Sempre faço isso"],
        pontuacao: [0, 1, 2]
    },
    {
        texto: "Já pensou que não tem jeito para o vício?",
        opcoes: ["Nunca", "Às vezes", "Constantemente"],
        pontuacao: [0, 1, 2]
    }
];

function downloadJSON(obj, nome){
    const blob = new Blob([JSON.stringify(obj, null, 2)], {type:"application/json"});
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = nome;
    document.body.appendChild(a);
    a.click();
    setTimeout(()=>{a.remove();},800);
}

function downloadQuizPDF(relatorio, dados){
    // Criação básica de PDF usando html2pdf (ou portável via window.print)
    // Aqui criamos um PDF simples nativo usando Blob/Text e print
    const win = window.open("", "_blank");
    win.document.write(`<html><head><title>Relatório Quiz LivreBet</title></head>
        <body>${relatorio}</body></html>`);
    setTimeout(()=>win.print(),400);
}

let quizDados = {};

// Início do Quiz
quizInfos.onsubmit = function(e){
    e.preventDefault();
    const nome = document.getElementById("nome").value.trim();
    const email = document.getElementById("email").value.trim();
    if(!nome || !email){
        alert("Por favor, preencha o nome e e-mail.");
        return;
    }
    quizDados = {nome, email, date: new Date().toISOString()};
    downloadJSON(quizDados, "livrebet_dados.json");
    quizInfos.classList.add("hidden");
    quizForm.classList.remove("hidden");
    montarQuiz();
};

let quizRespostas = [];
function montarQuiz(){
    quizForm.innerHTML = "";
    let qNum = 0;
    function mostrarPergunta(n){
        const p = perguntasQuiz[n];
        const div = document.createElement("div");
        div.className = "quiz-question";
        div.innerHTML = `<h3>${n+1}. ${p.texto}</h3>`;
        const opcDiv = document.createElement("div");
        opcDiv.className = "quiz-options";
        p.opcoes.forEach((op,idx)=>{
            const id = `quiz_${n}_opt_${idx}`;
            opcDiv.innerHTML += `<label><input type="radio" name="quiz_q${n}" value="${idx}" id="${id}">${op}</label>`;
        });
        div.appendChild(opcDiv);
        quizForm.appendChild(div);
        const btnNext = document.createElement("button");
        btnNext.textContent = n === perguntasQuiz.length-1 ? "Ver Resultado" : "Próxima";
        quizForm.appendChild(btnNext);

        btnNext.onclick = function(e){
            e.preventDefault();
            const sel = document.querySelector('input[name="quiz_q'+n+'"]:checked');
            if(!sel){
                alert("Selecione uma opção!");
                return;
            }
            quizRespostas[n] = Number(sel.value);
            if(n < perguntasQuiz.length-1){
                quizForm.innerHTML = "";
                mostrarPergunta(n+1);
            } else {
                quizForm.classList.add("hidden");
                mostrarResultadoQuiz();
            }
        };
    }
    mostrarPergunta(0);
}

function mostrarResultadoQuiz(){
    const total = quizRespostas.reduce((a,b,i)=>a+perguntasQuiz[i].pontuacao[b],0);
    let categoria = "", corClasse = "", recomendacao = "";
    if(total <= 6){categoria="Baixo risco"; corClasse="quiz-result-low"; recomendacao="Continue atento e busque manter hábitos saudáveis.";}
    else if(total <= 15){categoria="Risco moderado"; corClasse="quiz-result-medium"; recomendacao="Procure apoio e utilize nossas ferramentas para controle.";}
    else{categoria="Alto risco"; corClasse="quiz-result-high"; recomendacao="Busque ajuda profissional e apoio emocional urgente.";}

    const versiculos = [
        {txt:"\"E conhecereis a verdade, e a verdade vos libertará.\" (João 8:32)", ref:"João 8:32"},
        {txt:"\"Tudo posso naquele que me fortalece.\" (Filipenses 4:13)", ref:"Filipenses 4:13"},
        {txt:"\"Não temas, porque eu sou contigo.\" (Isaías 41:10)", ref:"Isaías 41:10"},
        {txt:"\"Deus é nosso refúgio e fortaleza.\" (Salmo 46:1)", ref:"Salmo 46:1"},
        {txt:"\"Clamam os justos, e o Senhor os ouve.\" (Salmo 34:17)", ref:"Salmo 34:17"},
        {txt:"\"Vinde a mim, todos os que estais cansados.\" (Mateus 11:28)", ref:"Mateus 11:28"}
    ];
    const vers = versiculos[Math.floor(Math.random()*versiculos.length)];

    let relatorioHTML = `
      <div class="quiz-result-box">
        <h3>Seu nível de risco: <span class="${corClasse}">${categoria}</span></h3>
        <p>Somatório dos pontos: <strong>${total}</strong></p>
        <p>${recomendacao}</p>
        <div class="quiz-result-verse">${vers.txt}</div>
        <button id="btn-quiz-pdf" class="cta-btn secundario">Baixar PDF do Resultado</button>
      </div>
    `;
    quizResult.innerHTML = relatorioHTML;
    quizResult.classList.remove("hidden");

    document.getElementById("btn-quiz-pdf").onclick = function(){
        downloadQuizPDF(relatorioHTML, quizDados);
    };

    // POP-UP do ebook se risco moderado ou alto
    if(categoria==="Risco moderado"||categoria==="Alto risco"){
        mostrarPopupEbook();
    }
}

// 3. POP-UP OFERTA DO LIVRO
function mostrarPopupEbook(){
    const popupBg = document.getElementById("ebook-popup");
    popupBg.innerHTML = `
        <div class="ebook-popup-bg">
            <div class="ebook-popup">
                <button class="ebook-popup-close" title="Fechar">&times;</button>
                <div class="ebook-popup-content">
                    <img src="assets/capa-ebook.jpg" class="ebook-popup-img" alt="Capa eBook">
                    <h3>Livro: Livre das Apostas – Uma História de Redenção</h3>
                    <div>
                        <span class="ebook-popup-preco-riscado">R$ 39,90</span>
                        <span class="ebook-popup-preco">R$ 19,90</span>
                    </div>
                    <div class="ebook-popup-desc">
                        Um guia direto, espiritual e prático para vencer o vício em apostas. Em 8 capítulos, você entenderá o mecanismo do vício, aprenderá a lidar com os gatilhos e encontrará força para recomeçar.
                    </div>
                    <div class="ebook-popup-btns">
                        <a href="https://pay.hotmart.com/K99480183N?off=1pvjm7kd" target="_blank" class="cta-btn">Comprar Agora</a>
                        <a href="assets/amostra.pdf" target="_blank" class="cta-btn secundario">Baixar Primeiro Capítulo</a>
                    </div>
                </div>
            </div>
        </div>`;
    popupBg.classList.remove("popup-hidden");
    popupBg.querySelector(".ebook-popup-close").onclick = function(){
        popupBg.classList.add("popup-hidden");
    };
}

// 4. JOGO ANTI-ANSIEDADE
const gameArea = document.getElementById("game-area");
const bolhasCount = document.getElementById("bolhas-count");
const gameTimerEl = document.getElementById("game-timer");
const gameFinal = document.getElementById("game-final");
const btnJogarNovamente = document.getElementById("btn-jogar-novamente");

let gameTimer, gameTempo, gameAtivo=false, bolhasEstouradas=0;

function startGame(){
    gameArea.innerHTML = "";
    bolhasEstouradas = 0;
    gameTempo = 30;
    bolhasCount.textContent = bolhasEstouradas;
    gameTimerEl.textContent = gameTempo;
    gameAtivo = true;
    gameFinal.classList.add("hidden");
    btnJogarNovamente.classList.add("hidden");

    // Criação de bolhas
    let bolhaInterval = setInterval(()=>{
        if(!gameAtivo) return;
        const bolha = document.createElement("div");
        bolha.className = "bolha";
        let left = Math.random() * (gameArea.offsetWidth-44);
        let top = Math.random() * (gameArea.offsetHeight-44);
        bolha.style.left=left+"px"; bolha.style.top=top+"px";
        bolha.onclick=function(){
            if(gameAtivo){
                bolha.remove();
                bolhasEstouradas++;
                bolhasCount.textContent = bolhasEstouradas;
            }
        };
        gameArea.appendChild(bolha);
        setTimeout(()=>{bolha.remove();},500+Math.random()*900); // Bolha some em tempo aleatório
    },350+Math.random()*250);

    // Timer principal
    gameTimer = setInterval(()=>{
        gameTempo--;
        gameTimerEl.textContent = gameTempo;
        if(gameTempo<=0){
            clearInterval(bolhaInterval);
            clearInterval(gameTimer);
            encerrarGame();
        }
    },1000);
}

function encerrarGame(){
    gameAtivo=false;
    gameArea.innerHTML="";
    let mensagem = bolhasEstouradas>12 ?
        "Parabéns! Sua atenção está voltada para o presente. Lembre-se: Você tem controle sobre sua ansiedade."
        :"Continue praticando! O exercício ajuda a acalmar e manter o foco.";
    gameFinal.innerHTML = `<div>${mensagem}</div>`;
    gameFinal.classList.remove("hidden");
    btnJogarNovamente.classList.remove("hidden");
}

btnJogarNovamente.onclick = startGame;

// Inicia jogo automaticamente ao entrar na seção ou clicando no game
gameArea.onclick = function(){
    if(!gameAtivo) startGame();
};
document.getElementById("antiansiedade").onmouseenter=startGame;

// 5. RESPIRE COMIGO
const bolhaRespire = document.getElementById("bolha-respire"), respireTexto = document.getElementById("respire-texto");
const btnRespire = document.getElementById("btn-respire");
const respireCiclosEl = document.getElementById("respire-ciclos");
const respireMensagem = document.getElementById("respire-mensagem");

let ciclosRealizados = Number(localStorage.getItem("ciclosRespire")||0);
respireCiclosEl.textContent = ciclosRealizados;

// Flow ciclo respiratório
const ciclosFlow = [
    {txt:"Inspire...", tempo:4000, size:120},
    {txt:"Segure...", tempo:4000, size:88},
    {txt:"Expire...", tempo:6000, size:65}
];

function cicloRespiratorio(ciclo, totCiclos=5){
    let atual = 0;
    function next(){
        if(atual>=totCiclos) {
            respireTexto.textContent = "Muito bem! Você concluiu os ciclos.";
            respireMensagem.textContent = "Continue praticando sempre que sentir ansiedade.";
            ciclosRealizados++;
            localStorage.setItem("ciclosRespire",ciclosRealizados);
            respireCiclosEl.textContent = ciclosRealizados;
            btnRespire.disabled=false;
            return;
        }
        ciclosFlow.forEach((step,i)=>{
            setTimeout(()=>{
                bolhaRespire.style.width = step.size+"px";
                bolhaRespire.style.height = step.size+"px";
                respireTexto.textContent = step.txt;
                if(i===ciclosFlow.length-1 && atual<totCiclos) {
                    setTimeout(()=>{
                        atual++;
                        next();
                    },step.tempo);
                }
            }, i>0 ? ciclosFlow.slice(0,i).reduce((a,b)=>a+b.tempo,0) : 0);
        });
    }
    next();
}

btnRespire.onclick = ()=>{
    btnRespire.disabled=true;
    respireMensagem.textContent = "";
    cicloRespiratorio(0,5);
};

// 6. SEÇÃO BÍBLICA
const versiculos = [
    {verso:"João 8:32", txt:"E conhecereis a verdade, e a verdade vos libertará.", afirm:"Você é livre!"},
    {verso:"Filipenses 4:13", txt:"Tudo posso naquele que me fortalece.", afirm:"Você pode recomeçar."},
    {verso:"Isaías 41:10", txt:"Não temas, porque eu sou contigo.", afirm:"Você não está sozinho."},
    {verso:"Salmo 46:1", txt:"Deus é nosso refúgio e fortaleza.", afirm:"Busque forças na fé."},
    {verso:"Salmo 34:17", txt:"Clamam os justos, e o Senhor os ouve.", afirm:"Deus escuta o seu coração."},
    {verso:"Mateus 11:28", txt:"Vinde a mim, todos os que estais cansados.", afirm:"Deixe Jesus aliviar seu peso."}
];

const versiculoTexto = document.getElementById("versiculo-texto");
const versiculoAfirmacao = document.getElementById("versiculo-afirmacao");
const btnNovoVersiculo = document.getElementById("btn-novo-versiculo");

function mostrarVersiculo(){
    let idx = Math.floor(Math.random()*versiculos.length);
    let v = versiculos[idx];
    versiculoTexto.innerHTML = `<span>${v.txt}<br><strong>(${v.verso})</strong></span>`;
    versiculoAfirmacao.textContent = v.afirm;
}
mostrarVersiculo();
btnNovoVersiculo.onclick = mostrarVersiculo;

// 7. DEPOIMENTOS CARROSSEL
const depoimentos = [
    "Recuperei minha paz e voltei a ter alegria. Obrigado LivreBet! – Carolina, 38",
    "Comecei o quiz achando que era bobagem, mas percebi que precisava mudar. – Leandro, 24",
    "O jogo anti-ansiedade virou meu exercício diário, recomendo! – Gabriel, 32",
    "Os versículos me trouxeram força pra recomeçar. – Ana, 29",
    "Nunca imaginei que um site pudesse ajudar tanto, muito obrigado! – José, 41",
    "Agora sei que pedir ajuda faz toda diferença. – Silvana, 34"
];
let depoIdx = 0;
const depoAtual = document.getElementById("depoimento-atual");
function mostrarDepoimento(){
    depoAtual.textContent = depoimentos[depoIdx];
}
mostrarDepoimento();
document.getElementById("depo-proximo").onclick = ()=>{ depoIdx=(depoIdx+1)%depoimentos.length; mostrarDepoimento(); };
document.getElementById("depo-anterior").onclick = ()=>{ depoIdx=(depoIdx-1+depoimentos.length)%depoimentos.length; mostrarDepoimento(); };


/*
    Todas as seções, botões e recursos são compatíveis com GitHub Pages
    Nenhum dado é armazenado externamente.
    Animado e modular para facilitar manutenção futura!
*/

// Scroll suave para âncoras
document.querySelectorAll('a[href^="#"]').forEach(a=>{
    a.addEventListener('click',function(e){
        let destino = document.querySelector(this.getAttribute('href'));
        if(destino){
            e.preventDefault();
            destino.scrollIntoView({behavior:'smooth', block:'start'});
        }
    });
});
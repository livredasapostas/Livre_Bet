// ========== Menu Mobile ==========
const mobileBtn = document.getElementById('mobile-menu-toggle');
const mobileNav = document.getElementById('mobile-nav');
const closeMobileBtn = document.getElementById('close-mobile-nav');

if(mobileBtn && mobileNav){
  mobileBtn.onclick = () => mobileNav.classList.remove('mobile-nav-closed');
  if(closeMobileBtn) closeMobileBtn.onclick = () => mobileNav.classList.add('mobile-nav-closed');
}

// ========== Dias longe das apostas ==========
const diasContador = document.getElementById('dias-contador');
const btnJornada = document.getElementById('btn-jornada');
function atualizarDias() {
  const dataParada = localStorage.getItem('dataParada');
  if (dataParada) {
    const hoje = new Date();
    const parada = new Date(dataParada);
    const diff = Math.floor((hoje - parada)/(1000*60*60*24));
    diasContador.textContent = diff >= 0 ? diff : 0;
  } else diasContador.textContent = '0';
}
atualizarDias();
if(btnJornada) {
  btnJornada.onclick = function() {
    let parada = prompt("Quando foi seu último dia de aposta? (Formato: YYYY-MM-DD, ex: 2024-07-19)");
    if (parada && /^\d{4}-\d{2}-\d{2}$/.test(parada)) {
      localStorage.setItem('dataParada', parada);
      atualizarDias();
      alert('Data salva. Um dia de cada vez!');
    } else if(parada){alert('Data inválida! Use o formato ano-mês-dia (2024-05-20)');}
  };
}

// ========== Quiz & Popup Empático ==========
const quizInfos = document.getElementById('quiz-infos');
const quizForm = document.getElementById('quiz-form');
const quizResult = document.getElementById('quiz-result');
const quizBar = document.querySelector('.quiz-progress-bar');
const perguntasQuiz = [
  {texto:"Com que frequência você aposta?", opcoes:["Raramente","Semanalmente","Diariamente"]},
  {texto:"Aposta mesmo sem ter dinheiro sobrando?", opcoes:["Nunca","Às vezes","Quase sempre"]},
  {texto:"Já teve problemas financeiros por causa do jogo?", opcoes:["Não","Leves","Graves"]},
  {texto:"Isso afeta seus relacionamentos?", opcoes:["Não","Um pouco","Muito"]},
  {texto:"Sente ansiedade ou culpa após jogar?", opcoes:["Não","Às vezes","Sempre"]}
];

// Dados do usuário
let userData = { nome: "", email: "" };

if(quizInfos) {
  quizInfos.onsubmit = function(e){
    e.preventDefault();
    const nomeInput = document.getElementById("nome");
    const emailInput = document.getElementById("email");
    if(nomeInput) userData.nome = nomeInput.value.trim();
    if(emailInput) userData.email = emailInput.value.trim();
    
    quizInfos.style.display="none";
    mostrarQuiz(0,[]);
  };
}

function mostrarQuiz(n, respostas){
  quizForm.innerHTML = "";
  quizBar.style.width = ((n/perguntasQuiz.length)*100)+"%";
  
  if(n >= perguntasQuiz.length) {
    quizBar.style.width="100%";
    mostrarResultadoQuiz(respostas);
    return;
  }

  let q = perguntasQuiz[n];
  let qDiv = document.createElement("div");
  qDiv.className="quiz-question-card fadein";
  qDiv.innerHTML = `<h3>${n+1}/${perguntasQuiz.length}: ${q.texto}</h3><div class="quiz-options"></div>`;
  
  q.opcoes.forEach((opt,i)=>{
    let label=document.createElement('label');
    label.innerHTML=`<input type="radio" name="quiz_${n}" value="${i}"> ${opt}`;
    label.onclick = function() {
      // Pequeno delay para dar feedback visual do clique
      setTimeout(() => {
        respostas[n]=i;
        mostrarQuiz(n+1,respostas);
      }, 250);
    };
    qDiv.querySelector('.quiz-options').appendChild(label);
  });
  
  quizForm.appendChild(qDiv);
}

function mostrarResultadoQuiz(respostas){
  const pontuacoes = [0,1,2]; // Pesos das respostas
  let total = respostas.reduce((s,v)=>s+pontuacoes[v],0);
  let nivel = "", corClass = "", msg = "";
  
  // Lógica de Risco
  if(total <= 3){
    nivel="Baixo risco"; corClass="quiz-result-low";
    msg = "Você parece ter controle, mas mantenha-se vigilante.";
  } else if(total <= 7){
    nivel="Risco Moderado"; corClass="quiz-result-medium";
    msg = "Cuidado. Você apresenta sinais de alerta que podem evoluir.";
  } else {
    nivel="Alto Risco"; corClass="quiz-result-high";
    msg = "Busque ajuda. O vício está afetando sua qualidade de vida.";
  }

  // Mostra resultado na tela (Discreto)
  quizResult.innerHTML=`
    <div class="quiz-result-box fadein">
      <h3>Resultado: <span class="${corClass}">${nivel}</span></h3>
      <p>${msg}</p>
      <button onclick="mostrarPopupEbook('${nivel}', '${userData.nome}')" class="cta-btn primary full-width">Ver meu plano de ação</button>
    </div>`;

  // Abre o Popup automaticamente se for risco moderado/alto
  if(total > 3) {
    setTimeout(() => mostrarPopupEbook(nivel, userData.nome), 1500);
  }
}

// ===== POP-UP EBOOK (Com mensagem personalizada) =====
function mostrarPopupEbook(nivel, nome) {
  const popupBg = document.getElementById("ebook-popup");
  let titulo = "Livre das Apostas";
  let textoIntro = "Um guia prático para vencer o vício.";
  
  // Personalização da mensagem baseada no risco
  if(nivel === "Alto Risco" || nivel === "Risco Moderado") {
    titulo = `Calma, ${nome || 'amigo'}. Existe saída.`;
    textoIntro = `Identificamos um padrão de vulnerabilidade no seu teste. <br><br>
    Eu sei que dá medo e a ansiedade aperta, <b>mas você não precisa resolver tudo hoje.</b><br>
    Eu preparei um material para te segurar pela mão nesse início.`;
  }

  popupBg.innerHTML = `
    <div class="ebook-popup-bg fadein">
    <div class="ebook-popup">
      <button class="ebook-popup-close" title="Fechar">&times;</button>
      <div class="ebook-popup-content">
        <h3 style="color:var(--primary); margin-bottom:10px;">${titulo}</h3>
        <div class="ebook-popup-desc" style="font-size:1rem; line-height:1.5;">${textoIntro}</div>
        
        <div style="margin: 20px 0; background:#f8fafc; padding:15px; border-radius:10px;">
            <div style="display:flex; justify-content:center; gap:15px; align-items:center;">
                <img src="assets/capa-ebook.jpg" style="width:60px; border-radius:4px; box-shadow:0 4px 10px rgba(0,0,0,0.1);">
                <div style="text-align:left;">
                    <div style="font-weight:bold; color:#334155;">O Guia Definitivo</div>
                    <div style="color:#059669; font-weight:bold;">R$ 19,90 <span style="font-size:0.8em; text-decoration:line-through; color:#94a3b8;">R$ 39,90</span></div>
                </div>
            </div>
        </div>

        <div class="ebook-popup-btns">
          <a href="https://pay.hotmart.com/K99480183N?off=1pvjm7kd" target="_blank" class="cta-btn primary">Quero mudar minha vida</a>
          <a href="assets/amostra.pdf" target="_blank" class="cta-btn outline" style="border:none; font-size:0.9rem;">Ler capítulo gratuito sem compromisso</a>
        </div>
      </div>
    </div></div>`;
  
  popupBg.classList.remove("popup-hidden");
  popupBg.querySelector(".ebook-popup-close").onclick = ()=>popupBg.classList.add("popup-hidden");
}


// ========== JOGO ANTI-ANSIEDADE (Ajustado) ==========
const gameArea = document.getElementById("game-area");
const bolhasCount = document.getElementById("bolhas-count");
const gameTimerEl = document.getElementById("game-timer");
const gameFinal = document.getElementById("game-final");
const btnJogarNovamente = document.getElementById("btn-jogar-novamente");
let gameTimer, gameTempo, gameAtivo=false, bolhasEstouradas=0;
let bolhaInterval;

function startGame(){
  // Reset
  gameArea.innerHTML = ""; 
  bolhasEstouradas = 0; 
  gameTempo = 30;
  bolhasCount.textContent = bolhasEstouradas;
  gameTimerEl.textContent = gameTempo; 
  gameAtivo = true;
  gameFinal.innerHTML="";
  btnJogarNovamente.style.display="none";

  // Remover overlay de start se existir
  const overlay = gameArea.querySelector('.start-overlay');
  if(overlay) overlay.remove();

  // Criação de bolhas (Mais lento e calmo)
  // Intervalo maior: entre 800ms e 1500ms para dar tempo
  bolhaInterval = setInterval(()=>{
    if(!gameAtivo) return;
    criarBolha();
  }, 800); 

  // Timer do jogo
  gameTimer = setInterval(()=>{
    gameTempo--;
    gameTimerEl.textContent = gameTempo;
    if(gameTempo<=0){
      encerrarGame();
    }
  },1000);
}

function criarBolha() {
    const bolha = document.createElement("div");
    bolha.className = "bolha";
    
    // Tamanho variável para ficar dinâmico
    const size = Math.floor(Math.random() * 20) + 50; // entre 50px e 70px
    bolha.style.width = size + "px";
    bolha.style.height = size + "px";
    
    // Posição aleatória respeitando limites (evita sair da div)
    const areaW = gameArea.offsetWidth - size;
    const areaH = gameArea.offsetHeight - size;
    bolha.style.left = Math.random() * areaW + "px";
    bolha.style.top = Math.random() * areaH + "px";

    bolha.onclick = function(e){
        e.stopPropagation(); // Evita clicar no fundo
        bolhasEstouradas++; 
        bolhasCount.textContent = bolhasEstouradas;
        
        // Efeito de estouro
        bolha.style.transform = "scale(1.4)";
        bolha.style.opacity = "0";
        setTimeout(() => bolha.remove(), 200);
    };

    gameArea.appendChild(bolha);

    // Bolha desaparece sozinha se não clicar (tempo maior: 3s)
    setTimeout(()=>{
        if(bolha.parentNode) {
            bolha.style.opacity = "0";
            setTimeout(() => bolha.remove(), 500);
        }
    }, 2500 + Math.random() * 1000);
}

function encerrarGame(){
  gameAtivo=false;
  clearInterval(bolhaInterval);
  clearInterval(gameTimer);
  gameArea.innerHTML=""; // Limpa tudo
  
  let msg = bolhasEstouradas > 15 ? 
    "Ótimo foco! Você conseguiu se manter presente." : 
    "O importante foi tentar. Respire fundo.";
    
  gameFinal.innerHTML = `<div style="margin-top:15px; font-weight:bold; color:var(--primary)">${msg}</div>`;
  btnJogarNovamente.style.display="inline-block";
  
  // Recoloca o overlay de start
  const overlay = document.createElement('div');
  overlay.className = 'start-overlay';
  overlay.innerHTML = '<span>Toque para jogar novamente</span>';
  overlay.onclick = startGame;
  gameArea.appendChild(overlay);
}

// Botão Fullscreen (Opcional, se você adicionar no HTML)
function toggleFullScreen() {
  if (!document.fullscreenElement) {
      gameArea.requestFullscreen().catch(err => {
        alert(`Erro ao entrar em tela cheia: ${err.message}`);
      });
  } else {
    document.exitFullscreen();
  }
}

btnJogarNovamente.onclick = startGame;


// ========== RESPIRAR COMIGO (Animação Real) ==========
const bolhaRespire = document.getElementById("bolha-respire");
const respireTexto = document.getElementById("respire-texto");
const btnRespire = document.getElementById("btn-respire");
const respireCiclosEl = document.getElementById("respire-ciclos");
const respireMensagem = document.getElementById("respire-mensagem");

let ciclosRealizados = Number(localStorage.getItem("ciclosRespire")||0);
if(respireCiclosEl) respireCiclosEl.textContent = ciclosRealizados;

function iniciarRespiracao() {
    btnRespire.disabled = true;
    btnRespire.style.opacity = "0.5";
    respireMensagem.textContent = "Concentre-se na bolha...";
    
    let totalCiclos = 3; // Faremos 3 ciclos completos
    let cicloAtual = 0;

    function ciclo() {
        if(cicloAtual >= totalCiclos) {
            // Fim
            respireTexto.textContent = "Muito bem!";
            bolhaRespire.className = "respire-bolha"; // Reset classe
            btnRespire.disabled = false;
            btnRespire.style.opacity = "1";
            btnRespire.textContent = "Fazer novamente";
            respireMensagem.textContent = "Sinta seu corpo mais leve.";
            
            ciclosRealizados++;
            localStorage.setItem("ciclosRespire", ciclosRealizados);
            respireCiclosEl.textContent = ciclosRealizados;
            return;
        }

        // 1. Inspire (4s)
        respireTexto.textContent = "Inspire...";
        bolhaRespire.className = "respire-bolha inspire";
        
        setTimeout(() => {
            // 2. Segure (4s)
            respireTexto.textContent = "Segure...";
            bolhaRespire.className = "respire-bolha segure";
            
            setTimeout(() => {
                // 3. Expire (6s)
                respireTexto.textContent = "Expire...";
                bolhaRespire.className = "respire-bolha expire";
                
                setTimeout(() => {
                    cicloAtual++;
                    ciclo(); // Próximo ciclo
                }, 6000); // Tempo expirar
            }, 4000); // Tempo segurar
        }, 4000); // Tempo inspirar
    }

    ciclo();
}

if(btnRespire) btnRespire.onclick = iniciarRespiracao;


// ========== OUTROS (Versículos e Depoimentos) ==========
// Versículos
const versiculos = [
  {verso:"João 8:32",txt:"E conhecereis a verdade, e a verdade vos libertará.",afirm:"A verdade liberta."},
  {verso:"Filipenses 4:13",txt:"Tudo posso naquele que me fortalece.",afirm:"Você tem força."},
  {verso:"Isaías 41:10",txt:"Não temas, porque eu sou contigo.",afirm:"Você não está só."},
  {verso:"Salmo 46:1",txt:"Deus é nosso refúgio e fortaleza.",afirm:"Busque seu refúgio."}
];
const vTexto = document.getElementById("versiculo-texto");
const vAfirm = document.getElementById("versiculo-afirmacao");
const btnNovoV = document.getElementById("btn-novo-versiculo");

function mostrarVersiculo(){
  let idx=Math.floor(Math.random()*versiculos.length);
  let v=versiculos[idx];
  if(vTexto) vTexto.innerHTML=`"${v.txt}" <br><small style="color:var(--accent)">${v.verso}</small>`;
  if(vAfirm) vAfirm.textContent = v.afirm;
}
mostrarVersiculo();
if(btnNovoV) btnNovoV.onclick = mostrarVersiculo;

// Depoimentos
const depoimentos = [
  "Recuperei minha paz e voltei a sorrir. Gratidão! – Carolina, 38",
  "O quiz abriu minha mente, decidi buscar ajuda. – Leandro, 24",
  "Faço o jogo antiansiedade todo dia. Ajuda muito. – Gabriel, 32",
  "Achei que não tinha saída, mas encontrei apoio aqui. – José, 41"
];
let depoIdx=0;
const depoAtual = document.getElementById("depoimento-atual");
function mostrarDepoimento(){
  if(depoAtual) {
    depoAtual.style.opacity = 0;
    setTimeout(()=>{
        depoAtual.textContent = depoimentos[depoIdx];
        depoAtual.style.opacity = 1;
    },300);
  }
}
mostrarDepoimento();
const btnDepoProx = document.getElementById("depo-proximo");
const btnDepoAnt = document.getElementById("depo-anterior");
if(btnDepoProx) btnDepoProx.onclick = ()=>{depoIdx=(depoIdx+1)%depoimentos.length;mostrarDepoimento();}
if(btnDepoAnt) btnDepoAnt.onclick = ()=>{depoIdx=(depoIdx-1+depoimentos.length)%depoimentos.length;mostrarDepoimento();}

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
btnJornada.onclick = function() {
  let parada = prompt("Quando você parou de apostar? (ex: 2024-07-19)");
  if (parada && /^\d{4}-\d{2}-\d{2}$/.test(parada)) {
    localStorage.setItem('dataParada', parada);
    atualizarDias();
    diasContador.style.background='#ffd95a';setTimeout(()=>diasContador.style.background='',900);
    alert('Parabéns por iniciar sua jornada!');
  } else if(parada){alert('Data inválida! formato: YYYY-MM-DD');}
};

// ========== Quiz ==========
const quizInfos = document.getElementById('quiz-infos');
const quizForm = document.getElementById('quiz-form');
const quizResult = document.getElementById('quiz-result');
const quizBar = document.querySelector('.quiz-progress-bar');
const perguntasQuiz = [
  {texto:"Com que frequência você aposta?", opcoes:["Raramente","Algumas vezes/semana","Diariamente"]},
  {texto:"Sente vontade de apostar mesmo sem dinheiro?", opcoes:["Nunca","Às vezes","Quase sempre"]},
  {texto:"Já teve problemas financeiros por causa das apostas?", opcoes:["Não","Poucos problemas","Muitos problemas"]},
  {texto:"Aposta afeta a relação com alguém?", opcoes:["Não","Pouco","Muito"]},
  {texto:"Já mentiu sobre apostas?", opcoes:["Nunca","Poucas vezes","Muitas vezes"]},
  {texto:"Sente ansiedade/culpa após apostar?", opcoes:["Não","Algumas vezes","Sempre"]},
  {texto:"Tenta parar e não consegue?", opcoes:["Consigo controlar","Dificuldade","Não consigo"]},
  {texto:"Aposta para aliviar sentimentos ruins?", opcoes:["Não","Às vezes","Com frequência"]},
  {texto:"Perde a noção do tempo apostando?", opcoes:["Não","Às vezes","Sim"]},
  {texto:"Já tentou recuperar dinheiro perdido?", opcoes:["Não","Pouco","Sempre faço isso"]},
  {texto:"Acredita que não tem saída para o vício?", opcoes:["Nunca","Às vezes","Constantemente"]}
];
function downloadJSON(obj, nome){
  const blob = new Blob([JSON.stringify(obj,null,2)], {type:"application/json"});
  const a = document.createElement("a");
  a.href = URL.createObjectURL(blob);
  a.download = nome;
  document.body.appendChild(a);
  a.click();setTimeout(()=>{a.remove();},900);
}
quizInfos.onsubmit = function(e){
  e.preventDefault();
  const nome = document.getElementById("nome").value.trim();
  const email = document.getElementById("email").value.trim();
  if(!nome || !email){alert("Preencha nome e e-mail");return;}
  let dados = {nome,email,date:new Date().toISOString()};
  downloadJSON(dados,"livrebet_dados.json");
  quizInfos.style.display="none";
  mostrarQuiz(0,[]);
};
function mostrarQuiz(n, respostas){
  quizForm.innerHTML = "";
  quizBar.style.width = ((n/perguntasQuiz.length)*100)+"%";
  let q = perguntasQuiz[n];
  let qDiv = document.createElement("div");
  qDiv.className="quiz-question-card";
  qDiv.innerHTML = `<h3>${n+1}/${perguntasQuiz.length}: ${q.texto}</h3><div class="quiz-options"></div>`;
  q.opcoes.forEach((opt,i)=>{
    let label=document.createElement('label');
    label.innerHTML=`<input type="radio" name="quiz_${n}" value="${i}" style="margin-right:7px;">${opt}`;
    qDiv.querySelector('.quiz-options').appendChild(label);
  });
  let btnNext=document.createElement("button");
  btnNext.className="cta-btn sec"; btnNext.textContent = n==perguntasQuiz.length-1 ? "Ver Resultado" : "Próxima";
  qDiv.appendChild(btnNext); quizForm.appendChild(qDiv);
  btnNext.onclick = function(e){
    e.preventDefault();
    let sel = qDiv.querySelector('input[type="radio"]:checked');
    if(!sel){labelShake(qDiv); return;}
    respostas[n]=Number(sel.value);
    if(n < perguntasQuiz.length-1){
      mostrarQuiz(n+1,respostas);
    }else{
      quizForm.innerHTML="";quizBar.style.width="100%"; mostrarResultadoQuiz(respostas);
    }
  };
}
// animação shake
function labelShake(div){div.style.animation="shake .31s";setTimeout(()=>div.style.animation="",350);}
quizBar.style.width="0%";
function mostrarResultadoQuiz(respostas){
  const pontuacoes = [0,1,2];
  let total = respostas.reduce((s,v)=>s+pontuacoes[v],0);
  let cat="",c="",rec="";
  if(total <= 6){cat="Baixo risco";c="quiz-result-low";rec="Continue atento, mantenha hábitos saudáveis.";}
  else if(total <= 15){cat="Risco moderado";c="quiz-result-medium";rec="Use as ferramentas de apoio e busque conversar.";}
  else{cat="Alto risco";c="quiz-result-high";rec="Busque ajuda profissional e emocional imediatamente.";}
  // versículo motivacional
  const versiculos = [
    "\"E conhecereis a verdade, e a verdade vos libertará.\" (João 8:32)",
    "\"Tudo posso naquele que me fortalece.\" (Filipenses 4:13)",
    "\"Não temas, porque eu sou contigo.\" (Isaías 41:10)",
    "\"Deus é nosso refúgio e fortaleza.\" (Salmo 46:1)",
    "\"Clamam os justos, e o Senhor os ouve.\" (Salmo 34:17)",
    "\"Vinde a mim, todos os que estais cansados.\" (Mateus 11:28)"
  ];
  let vers = versiculos[Math.floor(Math.random()*versiculos.length)];
  quizResult.innerHTML=`
    <div class="quiz-result-box fadein">
      <h3>Nível: <span class="${c}">${cat}</span></h3>
      <p>Pontos: <strong>${total}</strong></p>
      <p>${rec}</p>
      <div class="quiz-result-verse">${vers}</div>
      <button id="btn-quiz-pdf" class="cta-btn secundario">Baixar PDF</button>
    </div>`;
  document.getElementById("btn-quiz-pdf").onclick = ()=>baixarQuizPdf(cat,total,rec,vers);
  // pop-up se risco moderado/alto
  if(cat!=="Baixo risco"){mostrarPopupEbook();}
}

function baixarQuizPdf(cat,total,rec,vers){
  let txt = `Relatório LivreBet\nNível: ${cat}\nPontos: ${total}\nRecomendação: ${rec}\nVersículo: ${vers}`;
  let blob = new Blob([txt],{type:"application/pdf"});
  let url = URL.createObjectURL(blob);
  let a = document.createElement("a");
  a.href = url; a.download = "livrebet_relatorio.pdf"; document.body.appendChild(a);
  a.click(); setTimeout(()=>a.remove(),700);
}

// ===== POP-UP EBOOK =====
function mostrarPopupEbook() {
  const popupBg = document.getElementById("ebook-popup");
  popupBg.innerHTML = `
    <div class="ebook-popup-bg">
    <div class="ebook-popup">
      <button class="ebook-popup-close" title="Fechar">&times;</button>
      <div class="ebook-popup-content">
        <img src="assets/capa-ebook.jpg" class="ebook-popup-img" alt="Capa eBook">
        <h3 style="color:#5a64ff">Livro: Livre das Apostas – Uma História de Redenção</h3>
        <div>
          <span class="ebook-popup-preco-riscado">R$ 39,90</span>
          <span class="ebook-popup-preco">R$ 19,90</span>
        </div>
        <div class="ebook-popup-desc">Um guia direto, espiritual e prático para vencer o vício em apostas.<br>Em 8 capítulos, você entende o mecanismo do vício, aprende a lidar com gatilhos e encontra força para recomeçar.</div>
        <div class="ebook-popup-btns">
          <a href="https://pay.hotmart.com/K99480183N?off=1pvjm7kd" target="_blank" class="cta-btn">Comprar Agora</a>
          <a href="assets/amostra.pdf" target="_blank" class="cta-btn secundario">Baixar Capítulo Amostra</a>
        </div>
      </div>
    </div></div>`;
  popupBg.classList.remove("popup-hidden");
  popupBg.querySelector(".ebook-popup-close").onclick = ()=>popupBg.classList.add("popup-hidden");
}

// ========== JOGO ANTI-ANSIEDADE ==========
const gameArea = document.getElementById("game-area");
const bolhasCount = document.getElementById("bolhas-count");
const gameTimerEl = document.getElementById("game-timer");
const gameFinal = document.getElementById("game-final");
const btnJogarNovamente = document.getElementById("btn-jogar-novamente");
let gameTimer, gameTempo, gameAtivo=false, bolhasEstouradas=0;

function startGame(){
  gameArea.innerHTML = ""; bolhasEstouradas = 0; gameTempo = 30;
  bolhasCount.textContent = bolhasEstouradas;
  gameTimerEl.textContent = gameTempo; gameAtivo = true;
  gameFinal.innerHTML="";btnJogarNovamente.style.display="none";
  let bolhaInterval = setInterval(()=>{
    if(!gameAtivo) return;
    const bolha = document.createElement("div");
    bolha.className = "bolha";
    bolha.style.left = Math.random() * (gameArea.offsetWidth-44) + "px";
    bolha.style.top = Math.random() * (gameArea.offsetHeight-44) + "px";
    bolha.onclick=function(){
      bolha.remove(); bolhasEstouradas++; bolhasCount.textContent = bolhasEstouradas;
      bolha.style.transform="scale(.7)"; bolha.style.boxShadow="0 0 15px var(--gold)";
    };
    gameArea.appendChild(bolha);
    setTimeout(()=>{bolha.remove();},700+Math.random()*1100);
  },310+Math.random()*230);
  gameTimer = setInterval(()=>{
    gameTempo--;
    gameTimerEl.textContent = gameTempo;
    if(gameTempo<=0){clearInterval(bolhaInterval);clearInterval(gameTimer);encerrarGame();}
  },1000);
}
function encerrarGame(){
  gameAtivo=false;
  gameArea.innerHTML="";
  let msg = bolhasEstouradas>12 ? "Você focou no presente. Controle a ansiedade! 👏" :"Continue praticando para mais foco e calma!";
  gameFinal.innerHTML = `<div style="color:#FFD95A;font-size:1.09em">${msg}</div>`;
  btnJogarNovamente.style.display="block";
}
btnJogarNovamente.onclick = startGame;
gameArea.onclick = function(){if(!gameAtivo)startGame();};

// ========== RESPIRAR COMIGO ==========
const bolhaRespire = document.getElementById("bolha-respire"),
      respireTexto = document.getElementById("respire-texto"),
      btnRespire = document.getElementById("btn-respire"),
      respireCiclosEl = document.getElementById("respire-ciclos"),
      respireMensagem = document.getElementById("respire-mensagem");
let ciclosRealizados = Number(localStorage.getItem("ciclosRespire")||0);
respireCiclosEl.textContent = ciclosRealizados;
const flow = [
  {label:"Inspire", t:4000, size:160},
  {label:"Segure", t:4000, size:90},
  {label:"Expire", t:6000, size:60}
];
function cicloRespire(n=5){
  let ciclo=0;
  function next(){
    if(ciclo>=n){
      respireTexto.textContent="Muito bem!";
      respireMensagem.textContent="Continue praticando para seu bem-estar.";
      ciclosRealizados++; localStorage.setItem("ciclosRespire",ciclosRealizados); respireCiclosEl.textContent=ciclosRealizados;
      btnRespire.disabled=false;
      bolhaRespire.style.width="90px";bolhaRespire.style.height="90px";
      return;
    }
    flow.forEach((step,i)=>{
      setTimeout(()=>{
        bolhaRespire.style.width = step.size+"px";
        bolhaRespire.style.height = step.size+"px";
        bolhaRespire.style.background=i==0?"radial-gradient(circle,#2976D9 50%,#5A64FF 90%)":(i==1?"radial-gradient(circle,#FFD95A 60%,#2976D9 90%)":"radial-gradient(circle,#FFF95A 42%,#2976D9 90%)");
        respireTexto.textContent = step.label+"...";
      if(i===flow.length-1){setTimeout(()=>{ciclo++;next();},step.t);}
      }, i>0?flow.slice(0,i).reduce((a,b)=>a+b.t,0):0);
    });
  }
  next();
}
btnRespire.onclick = ()=>{
  btnRespire.disabled=true; respireMensagem.textContent="";
  cicloRespire(5);
}

// ========== VERSÍCULOS ==========
const versiculos = [
  {verso:"João 8:32",txt:"E conhecereis a verdade, e a verdade vos libertará.",afirm:"Você é livre!"},
  {verso:"Filipenses 4:13",txt:"Tudo posso naquele que me fortalece.",afirm:"Você pode recomeçar."},
  {verso:"Isaías 41:10",txt:"Não temas, porque eu sou contigo.",afirm:"Você não está sozinho."},
  {verso:"Salmo 46:1",txt:"Deus é nosso refúgio e fortaleza.",afirm:"Busque força na fé."},
  {verso:"Salmo 34:17",txt:"Clamam os justos, e o Senhor os ouve.",afirm:"Deus escuta o seu coração."},
  {verso:"Mateus 11:28",txt:"Vinde a mim, todos os que estais cansados.",afirm:"Deixe Jesus aliviar seu peso."}
];
const versiculoTexto = document.getElementById("versiculo-texto"),
      versiculoAfirmacao = document.getElementById("versiculo-afirmacao"),
      btnNovoVersiculo = document.getElementById("btn-novo-versiculo");
function mostrarVersiculo(){
  let idx=Math.floor(Math.random()*versiculos.length);
  let v=versiculos[idx];
  versiculoTexto.innerHTML=`<span>${v.txt}<br><strong style="font-size:.98em;color:#5A64FF">${v.verso}</strong></span>`;
  versiculoAfirmacao.textContent = v.afirm;
}
mostrarVersiculo();
btnNovoVersiculo.onclick = mostrarVersiculo;

// ========== DEPOIMENTOS ==========
const depoimentos = [
  "Recuperei minha paz e voltei a sorrir. Gratidão, LivreBet! – Carolina, 38",
  "O quiz abriu minha mente, e decidi buscar ajuda. – Leandro, 24",
  "Faço o jogo antiansiedade todo dia. Recomendo! – Gabriel, 32",
  "Os versículos me deram força pra recomeçar. – Ana, 29",
  "Nunca imaginei que um site pudesse ajudar tanto, obrigado! – José, 41",
  "Aprendi a pedir ajuda, faz toda diferença. – Silvana, 34"
];
let depoIdx=0;
const depoAtual = document.getElementById("depoimento-atual");
function mostrarDepoimento(){
  depoAtual.textContent = depoimentos[depoIdx];
}
mostrarDepoimento();
document.getElementById("depo-proximo").onclick = ()=>{depoIdx=(depoIdx+1)%depoimentos.length;mostrarDepoimento();}
document.getElementById("depo-anterior").onclick = ()=>{depoIdx=(depoIdx-1+depoimentos.length)%depoimentos.length;mostrarDepoimento();}

// ===== Scroll suave âncoras
document.querySelectorAll('a[href^="#"]').forEach(a=>{
  a.addEventListener('click',function(e){
    let destino=document.querySelector(this.getAttribute('href'));
    if(destino){ e.preventDefault();
      destino.scrollIntoView({behavior:'smooth',block:'start'});
    }
  });
});


// ====== Animação shake =====
const styleAnim = document.createElement('style');
styleAnim.innerHTML = `
@keyframes shake { 0%{transform:translateX(0);}10%,30%,50%,70%,90%{transform:translateX(-7px);}20%,40%,60%,80%{transform:translateX(7px);}100%{transform:translateX(0);} }`;
document.head.appendChild(styleAnim);


// Adicione ao final do script.js para o novo Menu Mobile
const mobileBtn = document.getElementById('mobile-menu-toggle');
const mobileNav = document.getElementById('mobile-nav');
if(mobileBtn && mobileNav){
  mobileBtn.onclick = function(){
    mobileNav.classList.remove('mobile-nav-closed');
  };
}

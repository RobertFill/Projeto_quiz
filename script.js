let questList = []; //criação de lista de perguntas
let indice = 0; // começa sempre em 0
let respondido = false;

let pontuacao = 0;
let nomeJogador = "";

const telaInicio = document.getElementById("tela-inicio");
const telaJogo = document.getElementById("tela-jogo");
const telaFinal = document.getElementById("tela-final");
const formInicio = document.getElementById("form-inicio");
const inputNome = document.getElementById("input-nome");

// 1. Carrega o ficheiro JSON
fetch("perguntas.json")
  .then((res) => res.json())
  .then((dados) => {
    questList = dados;
  })
  .catch((erro) => console.error("Erro ao carregar o JSON:", erro));

// Evento para capturar o nome e iniciar o jogo
formInicio.addEventListener("submit", (e) => {
  e.preventDefault();
  const nomeDigitado = inputNome.value.trim();
  if (nomeDigitado) {
    nomeJogador = nomeDigitado;
    iniciarQuiz();
  }
});

/* Alterna a exibição das telas controlando o estilo display diretamente */
function alternarTela(telaAtiva) {
  [telaInicio, telaJogo, telaFinal].forEach((t) => {
    t.classList.add("d-none");// ira adicidionar uma classe dentro de outra
    t.style.display = "none";//desativado por padrão
  });

  telaAtiva.classList.remove("d-none");//remove classe criada
  telaAtiva.style.display = "flex";//ativa
}

function iniciarQuiz() {//iniciar quiz
  indice = 0;
  pontuacao = 0;
  alternarTela(telaJogo);
  showQuestion();
}

function showQuestion() {//mostrar questões
  respondido = false;

  let feedbackEl = document.getElementById("correct");
  feedbackEl.style.display = "none";//destiva apos passar para proxima

  let q = questList[indice];

  document.getElementById("questions_numberId").innerText =
    `Pergunta ${indice + 1} de ${questList.length}`;//adiciona uma nova pergunta

  document.getElementById("question").innerText = q.pergunta;

  let botoes = document.querySelectorAll("#options-grid button");
  botoes.forEach((btn, i) => {
    btn.innerText = q.alternativas[i];
    btn.disabled = false;
    btn.classList.remove("correct-option");
    btn.classList.remove("incorret-option");
  });

  if (botoes.length > 0) botoes[0].focus();
}

function check_question(selected_option) {
  if (respondido) return;
  respondido = true;

  let q = questList[indice];
  let feedbackEl = document.getElementById("correct");
  let botoes = document.querySelectorAll("#options-grid button");

  botoes.forEach((b) => (b.disabled = true));

  let fonteHTML = q.fonte ? `<br><br><small><b>Fonte:</b> <a href="${q.fonte}" target="_blank" style="color: #63b3ed; text-decoration: underline;">${q.fonte}</a></small>` : '';
  let explicacaoText = q.explicacao ? `<br><em>${q.explicacao}</em>` : '';

  let respostaCerta = q.resposta !== undefined ? q.resposta : q.respostaCorreta;

  if (selected_option === respostaCerta) {
    pontuacao += 10;
    feedbackEl.innerHTML = `✓ Resposta correta! ${explicacaoText}${fonteHTML}`;
    feedbackEl.style.color = "#48bb78";
    botoes[selected_option].classList.add("correct-option");
  } else {
    feedbackEl.innerHTML = `✕ Resposta incorreta! A opção certa era a letra ${String.fromCharCode(65 + respostaCerta)}. ${explicacaoText}${fonteHTML}`;
    feedbackEl.style.color = "#f56565";
    botoes[selected_option].classList.add("incorret-option");
    botoes[respostaCerta].classList.add("correct-option");
  }

  feedbackEl.style.display = "block";
  document.getElementById("btn-next").focus();
}

function next_question() {
  if (!respondido) {
    alert("Por favor, selecione uma resposta antes de avançar!");
    return;
  }

  if (indice < questList.length - 1) {
    indice++;
    showQuestion();
  } else {
    finalizarQuiz();
  }
}

function finalizarQuiz() {
  salvarRanking(nomeJogador, pontuacao);
  renderizarRanking();

  document.getElementById("resultado-final").innerText =
    `Parabéns, ${nomeJogador}! Você concluiu todas as perguntas e fez ${pontuacao} pontos.`;

  alternarTela(telaFinal);
  document.getElementById("btn-restart").focus();
}

function salvarRanking(nome, pontos) {
  let ranking = JSON.parse(sessionStorage.getItem("ranking")) || [];
  ranking.push({ nome, pontos, data: new Date().toLocaleTimeString() });
  ranking.sort((a, b) => b.pontos - a.pontos);
  sessionStorage.setItem("ranking", JSON.stringify(ranking));
}

function renderizarRanking() {
  let ranking = JSON.parse(sessionStorage.getItem("ranking")) || [];
  let listaEl = document.getElementById("lista-ranking");
  listaEl.innerHTML = "";

  ranking.forEach((pos, i) => {
    let li = document.createElement("li");//cria uma lista
    li.textContent = `${i + 1}º Lugar: ${pos.nome} — ${pos.pontos} pts`;
    listaEl.appendChild(li);
  });
}

function restart_quiz() {// ativa botão para reiniciar quiz
  alternarTela(telaInicio);
  inputNome.value = nomeJogador;
  inputNome.focus();
}
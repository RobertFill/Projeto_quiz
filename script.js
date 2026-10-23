let questList = [];
let indice = 0; // Começa na primeira pergunta (posição 0)
let respondido = false;

// 1. Carrega o ficheiro JSON
fetch("perguntas.json")
  .then((res) => res.json())
  .then((dados) => {
    questList = dados;
    showQuestion();
  })
  .catch((erro) => console.error("Erro ao carregar o JSON:", erro));

function showQuestion() {
  respondido = false; // Libera a resposta para a nova pergunta
  
  let feedbackEl = document.getElementById("correct");
  feedbackEl.style.display = "none";

  let q = questList[indice];

  // Atualiza o contador de perguntas (ex: Pergunta 1 de 10)
  document.getElementById("questions_numberId").innerText =
    `Pergunta ${indice + 1} de ${questList.length}`;
    
  // Atualiza o texto da pergunta
  document.getElementById("question").innerText = q.pergunta;

  // Atualiza o texto dos botões e reativa os cliques
  let botoes = document.querySelectorAll("#options-grid button");
  botoes.forEach((btn, i) => {
    btn.innerText = q.opcoes[i];
    btn.disabled = false;
    btn.classList.remove("correct-option"); // Limpa o destaque verde anterior
  });
}

function check_question(selected_option) {
  if (respondido) return; // Impede alterar a resposta após responder
  respondido = true;

  let q = questList[indice];
  let feedbackEl = document.getElementById("correct");
  let botoes = document.querySelectorAll("#options-grid button");

  // Desabilita as opções após a escolha
  botoes.forEach((b) => (b.disabled = true));

  if (selected_option === q.respostaCorreta) {
    feedbackEl.innerText = "✓ Resposta correta!";
    feedbackEl.style.color = "#48bb78";
    botoes[selected_option].classList.add("correct-option");
  } else {
    feedbackEl.innerText = `✕ Resposta incorreta! A opção certa era ${String.fromCharCode(65 + q.respostaCorreta)}.`;
    feedbackEl.style.color = "#f56565";
    // Destaca a resposta correta em verde mesmo se errar
    botoes[q.respostaCorreta].classList.add("correct-option");
  }
  
  feedbackEl.style.display = "block";
}

function next_question() {
  // Evita avançar sem responder
  if (!respondido) {
    alert("Por favor, selecione uma resposta antes de avançar!");
    return;
  }

  // Avança o índice e atualiza a tela
  if (indice < questList.length - 1) {
    indice++;
    showQuestion();
  } else {
    // Tela de encerramento do Quiz
    document.getElementById("questions_numberId").innerText = "Fim do Quiz!";
    document.getElementById("question").innerText = "Parabéns! Você concluiu todas as perguntas.";
    document.getElementById("options-grid").style.display = "none";
    document.getElementById("correct").style.display = "none";
    document.getElementById("btn-next").style.display = "none";
    
    // Exibe o botão de reiniciar no fim do quiz
    document.getElementById("btn-restart").style.display = "inline-block";
  }
}

function restart_quiz() {
  indice = 0; // Reinicia o contador para a primeira pergunta
  
  // Exibe novamente a grelha de opções e o botão de próxima
  document.getElementById("options-grid").style.display = "grid";
  document.getElementById("btn-next").style.display = "inline-block";
  
  // Esconde o botão de reiniciar
  document.getElementById("btn-restart").style.display = "none";
  
  // Recarrega a interface com a primeira pergunta
  showQuestion();
}
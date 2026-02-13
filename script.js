let agendamentos = JSON.parse(localStorage.getItem("agendamentos")) || [];
let indexExcluir = null;

// MARCAR HORÁRIO
function marcarHorario() {
  const nome = document.getElementById("nome").value.trim();
  const data = document.getElementById("data").value;
  const hora = document.getElementById("hora").value;
  const servico = document.querySelector('input[name="servico"]:checked');
  const mensagem = document.getElementById("mensagem");

  if (!nome || !data || !hora || !servico) {
    mensagem.style.color = "red";
    mensagem.innerText = "Preencha todos os campos!";
    return;
  }

  const conflito = agendamentos.find(a => a.data === data && a.hora === hora);
  if (conflito) {
    mensagem.style.color = "red";
    mensagem.innerText = "Esse horário já está marcado!";
    return;
  }

  agendamentos.push({
    nome,
    data,
    hora,
    servico: servico.value
  });

  localStorage.setItem("agendamentos", JSON.stringify(agendamentos));

  mensagem.style.color = "green";
  mensagem.innerText = "Horário marcado com sucesso!";

  document.getElementById("nome").value = "";
  document.getElementById("data").value = "";
  document.getElementById("hora").value = "";
  servico.checked = false;
}

// ABRIR AGENDA
function abrirAgenda() {
  document.getElementById("formulario").style.display = "none";
  document.getElementById("agenda").style.display = "block";
  gerarCalendario();
}

// VOLTAR
function voltar() {
  document.getElementById("agenda").style.display = "none";
  document.getElementById("formulario").style.display = "block";
  document.getElementById("mensagem").innerText = "";
}

// GERAR CALENDÁRIO
function gerarCalendario() {
  const calendario = document.getElementById("calendario");
  calendario.innerHTML = "";

  const hoje = new Date();
  const ano = hoje.getFullYear();
  const mes = hoje.getMonth();

  const primeiroDia = new Date(ano, mes, 1).getDay();
  const totalDias = new Date(ano, mes + 1, 0).getDate();
  const nomeMes = hoje.toLocaleString("pt-BR", { month: "long" });

  const titulo = document.createElement("h3");
  titulo.innerText = `${nomeMes} ${ano}`;
  calendario.appendChild(titulo);

  const grid = document.createElement("div");
  grid.style.display = "grid";
  grid.style.gridTemplateColumns = "repeat(7, 1fr)";
  grid.style.gap = "6px";

// DIAS DA SEMANA
const diasSemana = ["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sab"];

diasSemana.forEach(dia => {
  const d = document.createElement("div");
  d.innerText = dia;
  d.style.textAlign = "center";
  d.style.fontWeight = "bold";
  d.style.color = "#9b6aa8";
  d.style.fontSize = "13px";
  grid.appendChild(d);
});


  for (let i = 0; i < primeiroDia; i++) {
    grid.appendChild(document.createElement("div"));
  }

  for (let dia = 1; dia <= totalDias; dia++) {
    const botao = document.createElement("button");
    botao.innerText = dia;

    const dataCompleta = `${ano}-${String(mes + 1).padStart(2, "0")}-${String(dia).padStart(2, "0")}`;

    if (agendamentos.some(a => a.data === dataCompleta)) {
      botao.style.background = "#e6b7d6";
    }

    botao.onclick = () => mostrarDia(dataCompleta);
    grid.appendChild(botao);
  }

  calendario.appendChild(grid);
}

// MOSTRAR DIA
function mostrarDia(data) {
  const lista = document.getElementById("listaDia");
  lista.innerHTML = `<h3>${data.split("-").reverse().join("/")}</h3>`;

  const doDia = agendamentos
    .filter(a => a.data === data)
    .sort((a, b) => a.hora.localeCompare(b.hora));

  if (doDia.length === 0) {
    lista.innerHTML += "<p>Nenhum horário marcado.</p>";
    return;
  }

  doDia.forEach((a, index) => {
    const div = document.createElement("div");
    div.className = "agendamento";

    const info = document.createElement("span");
    info.innerText = `${a.hora} - ${a.nome} (${a.servico})`;

    const btn = document.createElement("button");
    btn.className = "excluir";
    btn.innerText = "🗑️";
    btn.onclick = () => abrirModal(index);

    div.appendChild(info);
    div.appendChild(btn);
    lista.appendChild(div);
  });
}
function abrirModal(index) {
  indexExcluir = index;
  document.getElementById("modalExcluir").style.display = "flex";
}

function fecharModal() {
  indexExcluir = null;
  document.getElementById("modalExcluir").style.display = "none";
}

function confirmarExclusao() {
  if (indexExcluir !== null) {
    const agendamento = agendamentos[indexExcluir];
    excluirHorario(agendamento);
  }
  fecharModal();
}

// EXCLUIR 
function excluirHorario(agendamento) {
  agendamentos = agendamentos.filter(a =>
    !(a.data === agendamento.data && a.hora === agendamento.hora)
  );

  localStorage.setItem("agendamentos", JSON.stringify(agendamentos));
  gerarCalendario();
  mostrarDia(agendamento.data);
}
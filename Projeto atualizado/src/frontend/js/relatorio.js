
const dadosMockados = [
  { tema: 'E-commerce', microtema: 'Produto não entregue', acessos: 15, data: '2025-05-18' },
  { tema: 'Cartão', microtema: 'Solicitar novo cartão', acessos: 14, data: '2025-05-05' },
  { tema: 'SAC/Chamados', microtema: 'Abrir chamado', acessos: 12, data: '2025-05-11' },
  { tema: 'E-commerce', microtema: 'Troca ou devolução', acessos: 11, data: '2025-05-21' },
  { tema: 'Cartão', microtema: 'Bloqueio por segurança', acessos: 10, data: '2025-05-02' },
  { tema: 'SAC/Chamados', microtema: 'Reclamação pendente', acessos: 9, data: '2025-05-14' },
  { tema: 'E-commerce', microtema: 'Rastreamento de pedido', acessos: 7, data: '2025-05-24' },
  { tema: 'Cartão', microtema: 'Alterar limite de crédito', acessos: 8, data: '2025-05-09' },
  { tema: 'SAC/Chamados', microtema: 'Falar com atendente', acessos: 6, data: '2025-05-16' },

  { tema: 'E-commerce', microtema: 'Reembolso em atraso', acessos: 14, data: '2025-06-15' },
  { tema: 'Cartão', microtema: '2ª via do cartão', acessos: 13, data: '2025-06-01' },
  { tema: 'SAC/Chamados', microtema: 'Fechar chamado', acessos: 11, data: '2025-06-08' },
  { tema: 'Cartão', microtema: 'Ativação de cartão', acessos: 10, data: '2025-06-03' },
  { tema: 'SAC/Chamados', microtema: 'Acompanhar atendimento', acessos: 9, data: '2025-06-10' },
  { tema: 'E-commerce', microtema: 'Cupom não aplicado', acessos: 8, data: '2025-06-17' },
  { tema: 'Cartão', microtema: 'Aumento emergencial de limite', acessos: 7, data: '2025-06-06' },
  { tema: 'E-commerce', microtema: 'Carrinho esvaziado', acessos: 6, data: '2025-06-20' },
  { tema: 'SAC/Chamados', microtema: 'Tempo de espera alto', acessos: 5, data: '2025-06-12' }
];

const painelTableBody = document.querySelector("#painel-table tbody");
const selectPeriodo = document.getElementById("periodo");
const ctx = document.getElementById('graficoTemas').getContext('2d');

let graficoTemas;

function filtrarPorPeriodo(periodo) {
  return dadosMockados.filter(d => d.data.startsWith(periodo));
}

function preencherPainel(dados) {
  painelTableBody.innerHTML = "";
  dados.forEach(item => {
    const tr = document.createElement("tr");
    tr.innerHTML = `
      <td>${item.tema}</td>
      <td>${item.microtema}</td>
      <td>${item.acessos}</td>
      <td>${item.data}</td>
    `;
    painelTableBody.appendChild(tr);
  });
}

function atualizarGrafico(dados) {
  // Agrupa acessos por tema e ordena decrescente
  const agrupado = {};
  dados.forEach(item => {
    agrupado[item.tema] = (agrupado[item.tema] || 0) + item.acessos;
  });
  const ordenado = Object.entries(agrupado).sort((a, b) => b[1] - a[1]);

  const labels = ordenado.map(item => item[0]);
  const data = ordenado.map(item => item[1]);

  // Se já existe gráfico, destrói para recriar
  if (graficoTemas) graficoTemas.destroy();

  graficoTemas = new Chart(ctx, {
    type: 'bar',
    data: {
      labels: labels,
      datasets: [{
        label: 'Quantidade de Pesquisas',
        data: data,
        backgroundColor: ['#0a9396', '#94d2bd', '#005f73'],
        borderRadius: 4, // opcional, para barras mais suaves
      barThickness: 45, // controla a grossura da barra
      maxBarThickness: 50, // define um máximo se desejar
      categoryPercentage: 0.6, // espaçamento entre categorias (0 a 1)
      barPercentage: 0.8 
      }]
    },
    options: {
      responsive: true,
      plugins: {
        legend: { display: false },
        title: { display: false }
      },
      scales: {
        y: { beginAtZero: true }
      }
    }
  });
}

function atualizar() {
  const periodoSelecionado = selectPeriodo.value;
  const dadosFiltrados = filtrarPorPeriodo(periodoSelecionado);
  preencherPainel(dadosFiltrados);
  atualizarGrafico(dadosFiltrados);
}

selectPeriodo.addEventListener("change", atualizar);

atualizar(); // Carrega na primeira vez
 const menuToggle = document.getElementById("menu-toggle");
  const container = document.querySelector(".container");
  const sideBar = document.querySelector(".side-bar");

  if (!menuToggle || !sideBar || !container) {
    console.error("Erro: Elementos não encontrados.");
  
  }

  menuToggle.addEventListener("click", () => {
    sideBar.classList.toggle("aberto");
    container.classList.toggle("sidebar-aberto");
  });
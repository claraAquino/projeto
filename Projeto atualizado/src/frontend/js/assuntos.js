document.addEventListener('DOMContentLoaded', async () => {
  await verificarSessao();
  configurarMenuLateral();
  configurarLogout();
  await validarSessaoToken();
  await carregarAssuntosNaoCadastrados();
});

// 🔒 Verifica se o token existe e é válido no /users/me
async function verificarSessao() {
  const token = sessionStorage.getItem("token");

  if (!token) {
    window.location.href = "login.html";
    return;
  }

  try {
    const resp = await fetch("http://localhost:3000/users/me", {
      method: "GET",
      headers: { Authorization: "Bearer " + token }
    });

    if (resp.status === 401) {
      sessionStorage.clear();
      window.location.href = "login.html";
    }
  } catch (error) {
    console.error("Erro ao verificar sessão:", error);
    sessionStorage.clear();
    window.location.href = "login.html";
  }
}

// 🧠 Verifica se a sessão ainda é válida via /auth/validar
async function validarSessaoToken() {
  const token = sessionStorage.getItem("token");
  const modalWrapper = document.getElementById("modal-sessao-expirada-wrapper");
  const btnOk = document.getElementById("btn-sessao-expirada-ok");

  if (!token || !modalWrapper || !btnOk) return;

  try {
    const resp = await fetch("http://localhost:3000/auth/validar", {
      method: "GET",
      headers: { Authorization: "Bearer " + token }
    });

    if (!resp.ok) mostrarModalSessaoExpirada();
  } catch (error) {
    mostrarModalSessaoExpirada();
  }

  function mostrarModalSessaoExpirada() {
    modalWrapper.style.display = "flex";
    btnOk.addEventListener("click", () => {
      sessionStorage.clear();
      window.location.href = "login.html";
    });
  }
}

// 📂 Lógica do menu lateral
function configurarMenuLateral() {
  const menuToggle = document.getElementById("menu-toggle");
  const container = document.querySelector(".container");
  const sideBar = document.querySelector(".side-bar");

  if (!menuToggle || !sideBar || !container) return;

  menuToggle.addEventListener("click", () => {
    sideBar.classList.toggle("aberto");
    container.classList.toggle("sidebar-aberto");
  });
}

// 🚪 Logout
function configurarLogout() {
  const btnLogout = document.getElementById("btn-logout");

  if (btnLogout) {
    btnLogout.addEventListener("click", async function (e) {
      e.preventDefault();

      const token = sessionStorage.getItem("token");

      try {
        await fetch("http://localhost:3000/sessoes/logout", {
          method: "POST",
          headers: {
            "Authorization": "Bearer " + token,
            "Content-Type": "application/json"
          }
        });
      } catch (error) {
        console.warn("Erro ao encerrar sessão:", error);
      }

      sessionStorage.clear();
      window.location.href = "login.html";
    });
  }
}

// 📋 Botão "Ver mais"
function configurarBotoesVerMais() {
  const botoesVerMais = document.querySelectorAll('.ver-mais');

  botoesVerMais.forEach(botao => {
    botao.addEventListener('click', () => {
      const detalhes = botao.nextElementSibling;
      const estaAberto = detalhes.style.display === 'block';
      detalhes.style.display = estaAberto ? 'none' : 'block';
      botao.textContent = estaAberto ? 'Ver mais' : 'Ver menos';
    });
  });
}

// ➕ Botão "Adicionar à Biblioteca"
function configurarBotoesAdicionar() {
  const botoesAdicionar = document.querySelectorAll('.adicionar');

  botoesAdicionar.forEach(botao => {
    botao.addEventListener('click', async () => {
      const id = botao.getAttribute("data-id");
      const token = sessionStorage.getItem("token");

      if (!id || !token) return;

      try {
        const resp = await fetch(`http://localhost:3000/solucao-nao-encontrada/${id}/autorizar`, {
          method: "POST",
          headers: {
            "Authorization": "Bearer " + token,
            "Content-Type": "application/json"
          }
        });

        if (!resp.ok) throw new Error("Erro ao autorizar.");

        alert("Assunto adicionado à biblioteca com sucesso!");
        await carregarAssuntosNaoCadastrados(); // recarrega a lista
      } catch (erro) {
        console.error("Erro ao adicionar à biblioteca:", erro);
        alert("Erro ao adicionar à biblioteca.");
      }
    });
  });
}

// 🧾 Buscar assuntos não cadastrados no backend e gerar os cards
async function carregarAssuntosNaoCadastrados() {
  const token = sessionStorage.getItem("token");
  const container = document.getElementById("cards-container");

  if (!container) return;

  try {
    const resp = await fetch("http://localhost:3000/solucao-nao-encontrada", {
      method: "GET",
      headers: {
        "Authorization": "Bearer " + token
      }
    });

    if (!resp.ok) throw new Error("Erro ao buscar assuntos.");

    const assuntos = await resp.json();
    container.innerHTML = "";

    if (assuntos.length === 0) {
      container.innerHTML = "<p>Nenhum assunto pendente.</p>";
      return;
    }

    assuntos.forEach(assunto => {
      const card = document.createElement("div");
      card.className = "card";

      card.innerHTML = `
        <h2>${assunto.input}</h2>
        <p class="card-preview">Solicitado em ${new Date(assunto.data_criacao).toLocaleDateString()}</p>
        <button class="ver-mais">Ver mais</button>
        <div class="card-detalhes" style="display: none;">
          <p><strong>Descrição:</strong> Este assunto foi identificado como não registrado.</p>
          <button class="adicionar" data-id="${assunto.id}">Adicionar à Biblioteca</button>
        </div>
      `;

      container.appendChild(card);
    });

    configurarBotoesVerMais();
    configurarBotoesAdicionar();
  } catch (erro) {
    console.error("Erro ao carregar assuntos:", erro);
    container.innerHTML = "<p>Erro ao carregar assuntos.</p>";
  }
}

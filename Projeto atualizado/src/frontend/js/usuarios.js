document.addEventListener("DOMContentLoaded", () => {
  const modalUsuario = new bootstrap.Modal(document.getElementById("modalUsuario"));
  const form = document.getElementById("formUsuario");
  const tabela = document.getElementById("tabelaUsuarios");
  const btnNovoUsuario = document.getElementById("btnNovoUsuario");
  const filtroNome = document.getElementById("filtro-nome");


  document.getElementById("btnPerfis").addEventListener("click", () => {
  const modalPerfis = new bootstrap.Modal(document.getElementById("modalPerfis"));
  modalPerfis.show();
});

function adicionarPerfil() {
  const nome = document.getElementById("nomePerfil").value;
  console.log("Adicionar:", nome);
  // Chamada API ou lógica local
}

function editarPerfil() {
  const nome = document.getElementById("nomePerfil").value;
  console.log("Editar:", nome);
  // Chamada API ou lógica local
}

function excluirPerfil() {
  const nome = document.getElementById("nomePerfil").value;
  console.log("Excluir:", nome);
  // Chamada API ou lógica local
}

  let usuarios = [];

  const perfisMap = { 1: "Administrador", 2: "Operador" };

  async function carregarUsuarios() {
    try {
      const resp = await fetch("http://localhost:3000/users");
      if (!resp.ok) throw new Error("Erro ao carregar usuários");
      usuarios = await resp.json();
      renderTabela();
    } catch (e) {
      alert(e.message);
    }
  }

  function renderTabela() {
  tabela.innerHTML = "";
  usuarios.forEach((user, index) => {
    const status = user.status
      ? '<span class="badge bg-success">Aprovado</span>'
      : '<span class="badge bg-warning text-dark">Pendente</span>';

    const perfilNome = user.perfis && user.perfis.length
      ? user.perfis.map(p => perfisMap[p.id_perfil] || "Desconhecido").join(", ")
      : "N/A";

    const botaoAprovar = !user.status
      ? `<button class="btn-acao btn-editar" data-index="${index}">Aprovar</button>`
      : "";

    const linha = document.createElement("div");
    linha.className = "linha-dado";
    linha.innerHTML = `
      <div>${user.nome}</div>
      <div>${user.email}</div>
      <div>${perfilNome}</div>
      <div>${status}</div>
      <div>
        ${botaoAprovar}
        <button class="btn-acao btn-editar" data-index="${index}">Editar</button>
        <button class="btn-acao btn-excluir" data-index="${index}">Excluir</button>
      </div>
    `;
    tabela.appendChild(linha);
  });

  attachEvents(); // reaplica eventos aos novos botões
}


  function attachEvents() {
    document.querySelectorAll(".btn-aprovar").forEach(btn => {
  btn.onclick = async () => {
    const index = btn.dataset.index;
    const user = usuarios[index];
    try {
      const resp = await fetch(`http://localhost:3000/users/usuarios/${user.id_usuario}/ativar`, {
        method: "PATCH"
      });
      if (!resp.ok) throw new Error("Falha ao aprovar");
      usuarios[index].status = true;
      renderTabela();
    } catch (e) {
      alert(e.message);
    }
  };
});

    document.querySelectorAll(".btn-editar").forEach(btn => {
      btn.onclick = () => {
        const index = btn.dataset.index;
        abrirModal(index);
      };
    });

    document.querySelectorAll(".btn-excluir").forEach(btn => {
      btn.onclick = async () => {
        const index = btn.dataset.index;
        if (confirm("Confirma exclusão?")) {
          const user = usuarios[index];
          try {
            const resp = await fetch(`http://localhost:3000/users/${user.id_usuario}`, { method: "DELETE" });
            if (!resp.ok) throw new Error("Erro ao excluir");
            await carregarUsuarios();
          } catch (e) {
            alert(e.message);
          }
        }
      };
    });
  }

  function abrirModal(index = null) {
    form.reset();
    if (index !== null) {
      const u = usuarios[index];
      document.getElementById("idUsuario").value = index;
      document.getElementById("nome").value = u.nome;
      document.getElementById("email").value = u.email;
      document.getElementById("perfil").value = u.perfis?.[0]?.id_perfil || "";
      document.getElementById("senha").value = "";
    } else {
      document.getElementById("idUsuario").value = "";
    }
    modalUsuario.show();
  }

  form.onsubmit = async e => {
  e.preventDefault();
  const id = document.getElementById("idUsuario").value;
  const nome = document.getElementById("nome").value.trim();
  const email = document.getElementById("email").value.trim();
  const perfil = parseInt(document.getElementById("perfil").value);
  const senha = document.getElementById("senha").value || "1234";

  const payload = { nome, email, senha, perfil };

  try {
    let resp;
    if (!id) {
      // Criação via admin
      resp = await fetch("http://localhost:3000/users/admin", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
    } else {
      const userId = usuarios[parseInt(id)].id_usuario;
      resp = await fetch(`http://localhost:3000/users/${userId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
    }
    if (!resp.ok) {
      const err = await resp.json();
      throw new Error(err.message || "Erro ao salvar");
    }
    modalUsuario.hide();
    await carregarUsuarios();
  } catch (e) {
    alert(e.message);
  }
};

  filtroNome.oninput = () => {
    const filtro = filtroNome.value.toLowerCase();
    document.querySelectorAll("tbody tr").forEach(row => {
      const nome = row.cells[0].textContent.toLowerCase();
      row.style.display = nome.includes(filtro) ? "" : "none";
    });
  };

  btnNovoUsuario.onclick = () => abrirModal();

  carregarUsuarios();
});

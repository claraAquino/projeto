document.addEventListener("DOMContentLoaded", function () {
  const erroDiv = document.getElementById("erro-perfil");
  const token = localStorage.getItem("token");
  const emailUsuarioLogado = localStorage.getItem("emailUsuarioLogado");

  if (!token || !emailUsuarioLogado) {
    alert("Usuário não logado.");
    window.location.href = "login.html";
    return;
  }
async function carregarPerfil() {
  const erroDiv = document.getElementById("erro-perfil");
  erroDiv.style.display = "none";
  erroDiv.textContent = "";

  try {
    const token = localStorage.getItem("token");
    const emailUsuarioLogado = localStorage.getItem("emailUsuarioLogado");

    if (!token || !emailUsuarioLogado) {
      alert("Usuário não logado.");
      window.location.href = "login.html";
      return;
    }

    const resp = await fetch(`http://localhost:3000/users/email/${emailUsuarioLogado}`, {
      headers: {
        "Authorization": `Bearer ${token}`
      }
    });

    if (!resp.ok) {
      throw new Error("Erro ao carregar perfil.");
    }

    usuario = await resp.json();

    document.getElementById("usuario-logado").textContent = `Logado como: ${usuario.nome} (${usuario.email})`;
    document.getElementById("nome").value = usuario.nome;
    document.getElementById("email").value = usuario.email;
    document.getElementById("senha").value = "";
    document.getElementById("confirmar-senha").value = "";

    if (usuario.perfis && usuario.perfis.length > 0) {
      const nomesPerfis = usuario.perfis.map(p => p.nome).join(", ");
      document.getElementById("perfil").value = nomesPerfis;
    } else {
      document.getElementById("perfil").value = "";
    }
  } catch (err) {
    erroDiv.textContent = err.message;
    erroDiv.style.display = "block";
  }
}

async function salvarPerfil(e) {
  e.preventDefault();
  const erroDiv = document.getElementById("erro-perfil");
  erroDiv.style.display = "none";
  erroDiv.textContent = "";

  const nome = document.getElementById("nome").value.trim();
  const senha = document.getElementById("senha").value.trim();
  const confirmarSenha = document.getElementById("confirmar-senha").value.trim();

  if (!nome) {
    erroDiv.textContent = "Nome é obrigatório.";
    erroDiv.style.display = "block";
    return;
  }

  if (senha && senha !== confirmarSenha) {
    erroDiv.textContent = "As senhas não coincidem.";
    erroDiv.style.display = "block";
    return;
  }

  try {
    if (!usuario || !usuario.id_usuario) {
      throw new Error("Usuário não carregado.");
    }

    const token = localStorage.getItem("token");

    const resp = await fetch(`http://localhost:3000/users/${usuario.id_usuario}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`
      },
      body: JSON.stringify({
        nome,
        senha: senha || undefined
      })
    });

    if (!resp.ok) {
      const data = await resp.json();
      throw new Error(data.message || "Erro ao salvar perfil.");
    }

    alert("Perfil atualizado com sucesso!");
   
  } catch (err) {
    erroDiv.textContent = err.message;
    erroDiv.style.display = "block";
  }
}

 carregarPerfil();
  

  const form = document.getElementById("perfil-form");
  if (form) {
    form.addEventListener("submit", salvarPerfil);
  } else {
    console.error("Formulário do perfil não encontrado.");
  }

  // Menu toggle (igual seu código)
  const menuToggle = document.getElementById("menu-toggle");
  const container = document.querySelector(".container");
  const sideBar = document.querySelector(".side-bar");

  if (!menuToggle || !sideBar || !container) {
    console.error("Erro: Elementos do menu não encontrados.");
    return;
  }

  menuToggle.addEventListener("click", () => {
    sideBar.classList.toggle("aberto");
    container.classList.toggle("sidebar-aberto");
  });
});

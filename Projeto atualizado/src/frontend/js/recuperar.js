const formRecuperar = document.getElementById("recuperar-form");
const emailInput = document.getElementById("email-recuperar");
const senhaContainer = document.getElementById("senha-container");
const novaSenhaInput = document.getElementById("nova-senha");
const confirmarSenhaInput = document.getElementById("confirmar-nova-senha");
const btnRedefinir = document.getElementById("btn-redefinir");
const mensagemDiv = document.getElementById("mensagem");

let usuarioEncontrado = null;

// Passo 1 - Verifica se o e-mail existe (simula login só com email)
formRecuperar.addEventListener("submit", async function (e) {
  e.preventDefault();
  const email = emailInput.value.trim();

  try {
    const resposta = await fetch("http://localhost:3000/users");
    const usuarios = await resposta.json();

    usuarioEncontrado = usuarios.find(u => u.email.toLowerCase() === email.toLowerCase());

    if (usuarioEncontrado) {
      mensagemDiv.style.display = "none";
      senhaContainer.style.display = "block";
    } else {
      mensagemDiv.textContent = "E-mail não encontrado.";
      mensagemDiv.style.display = "block";
      senhaContainer.style.display = "none";
    }
  } catch (err) {
    console.error("Erro ao buscar usuários:", err);
    mensagemDiv.textContent = "Erro ao buscar usuários.";
    mensagemDiv.style.display = "block";
  }
});

// Passo 2 - Redefine a senha via backend
btnRedefinir.addEventListener("click", async function () {
  const novaSenha = novaSenhaInput.value.trim();
  const confirmarSenha = confirmarSenhaInput.value.trim();

  if (!novaSenha || !confirmarSenha) {
    mensagemDiv.textContent = "Preencha todos os campos de senha.";
    mensagemDiv.style.display = "block";
    return;
  }

  if (novaSenha !== confirmarSenha) {
    mensagemDiv.textContent = "As senhas não coincidem.";
    mensagemDiv.style.display = "block";
    return;
  }

  try {
    const response = await fetch(`http://localhost:3000/users/${usuarioEncontrado.id_usuario}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        senha: novaSenha
      })
    });

    const data = await response.json();

    if (response.ok) {
      alert("Senha redefinida com sucesso!");
      window.location.href = "login.html";
    } else {
      mensagemDiv.textContent = data.message || "Erro ao redefinir a senha.";
      mensagemDiv.style.display = "block";
    }
  } catch (error) {
    console.error("Erro ao redefinir senha:", error);
    mensagemDiv.textContent = "Erro ao redefinir a senha.";
    mensagemDiv.style.display = "block";
  }
});

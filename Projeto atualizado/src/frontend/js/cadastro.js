document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("cadastro-form");
  const erroCadastro = document.getElementById("erro-cadastro");

  form.addEventListener("submit", async function (e) {
    e.preventDefault();

    const nome = document.getElementById("nome").value.trim();
    const email = document.getElementById("email").value.trim();
    const senha = document.getElementById("senha").value.trim();

    erroCadastro.textContent = "";

    if (!nome || !email || !senha ) {
      erroCadastro.textContent = "Preencha todos os campos obrigatórios.";
      return;
    }

    try {
      const response = await fetch("http://localhost:3000/users", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({ nome, email, senha})
});
      const confirmarSenha = document.getElementById("confirmar-senha").value.trim();

      if (senha !== confirmarSenha) {
        erroCadastro.textContent = "As senhas não coincidem.";
        return;
      }
      const data = await response.json(); 

      if (response.ok) {
        alert("Usuário cadastrado com sucesso!");
        window.location.href = "login.html";
      } else {
        console.warn("Erro recebido:", data);
        erroCadastro.textContent = data.message || "Erro ao cadastrar. Tente novamente.";
      }

    } catch (err) {
      console.error("Erro na requisição:", err);
      erroCadastro.textContent = "Erro na conexão com o servidor.";
    }
  });
});

document.getElementById("login-form").addEventListener("submit", async function (e) {
  e.preventDefault();

  const email = document.getElementById("email").value.trim();
  const senha = document.getElementById("senha").value.trim();
  const erroDiv = document.getElementById("erro-div");
  erroDiv.style.display = "none";
  erroDiv.textContent = "";

  // Modal elementos
  const modal = document.getElementById("modal-confirmar-sessao");
  const btnSim = document.getElementById("btn-confirmar-sim");
  const btnNao = document.getElementById("btn-confirmar-nao");

  async function tentarLogin(forcarLogin = false) {
    try {
      const resp = await fetch("http://localhost:3000/users/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, senha, forcarLogin }),
      });

      const data = await resp.json();

      if (!resp.ok) {
        if (resp.status === 409 && data.requerConfirmacao) {
          // Exibe modal e espera resposta do usuário
          return new Promise((resolve, reject) => {
            modal.style.display = "flex";

            btnSim.onclick = () => {
              modal.style.display = "none";
              tentarLogin(true).then(resolve).catch(reject);
            };

            btnNao.onclick = () => {
              modal.style.display = "none";
              erroDiv.textContent = "Login cancelado pelo usuário.";
              erroDiv.style.display = "block";
              resolve();
            };
          });
        }
        throw new Error(data.message || "Erro ao tentar logar.");
      }

      // Login OK
      localStorage.setItem("token", data.token);
      localStorage.setItem("emailUsuarioLogado", data.email);
      const perfisIds = data.perfis.map((perfil) => perfil.id_perfil);
      if (perfisIds.includes(1)) {
        window.location.href = "painel_adm.html";
      } else {
        window.location.href = "painel_operador.html";
      }
    } catch (err) {
      erroDiv.textContent = err.message;
      erroDiv.style.display = "block";
    }
  }

  tentarLogin();
});

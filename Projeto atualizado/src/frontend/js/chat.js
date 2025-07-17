document.addEventListener("DOMContentLoaded", function () {
  const menuToggle = document.getElementById("menu-toggle");
  const container = document.querySelector(".container");
  const sideBar = document.querySelector(".side-bar");

  if (!menuToggle || !sideBar || !container) {
    console.error("Erro: Elementos não encontrados.");
    return;
  }

  menuToggle.addEventListener("click", () => {
    sideBar.classList.toggle("aberto");
    container.classList.toggle("sidebar-aberto");
  });

  // --- Buscar resposta via IA ---
  async function buscarRespostaIA(query) {
    try {
      const response = await fetch('/api/consulta/responder', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          // Se usar token: 'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          pergunta: query,
          id_subcategoria: 1 // Substitua por valor dinâmico futuramente
        })
      });

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Erro ao buscar resposta com IA:', error);
      return { erro: 'Erro na requisição.' };
    }
  }

  // --- Evento do botão buscar ---
  const btnBuscar = document.getElementById("btn-buscar");
  if (btnBuscar) {
    btnBuscar.addEventListener("click", async function () {
      const query = document.getElementById("busca-input").value.trim();
      const resultadosBox = document.getElementById("resultados-busca");

      if (query === "") {
        alert("Digite uma pergunta.");
        return;
      }

      resultadosBox.innerHTML = "<p>🔎 Buscando resposta...</p>";

      const resposta = await buscarRespostaIA(query);

      if (resposta?.texto) {
        resultadosBox.innerHTML = `
          <div class="resultado-ia">
            <p><strong>🔎 Resposta mais relevante:</strong></p>
            <p>${resposta.texto}</p>
            <p><a href="${resposta.url}" target="_blank">📄 Ver Documento</a></p>
            <p><em>📈 Similaridade: ${resposta.similaridade.toFixed(4)}</em></p>
          </div>
        `;
      } else {
        resultadosBox.innerHTML = `<p>❌ ${resposta?.mensagem || resposta?.erro || "Nenhuma resposta encontrada."}</p>`;
      }
    });
  } else {
    console.error("Elemento com id 'btn-buscar' não encontrado.");
  }
});

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

  // --- Função para buscar por solução, palavras-chave ou microtema ---
  function buscarDocumento(query) {
    const docs = JSON.parse(localStorage.getItem("documentos")) || [];
    const lowerQuery = query ? query.toLowerCase() : "";

    return docs.map((doc, index) => ({ doc, index }))
      .filter(item => {
        const solucao = item.doc.solucao?.toLowerCase() || "";
        const palavras = item.doc.palavras?.toLowerCase() || "";
        const microtema = item.doc.microtema?.toLowerCase() || "";

        return (
          solucao.includes(lowerQuery) ||
          palavras.includes(lowerQuery) ||
          microtema.includes(lowerQuery)
        );
      });
  }

  // --- Função para exibir os resultados da busca ---
  function exibirResultados(resultados) {
    const container = document.getElementById("resultados-busca");
    container.innerHTML = "";
    if (resultados.length === 0) {
      container.innerHTML = "<p>Nenhum documento encontrado.</p>";
      return;
    }

    let html = `
      <table border="1">
        <thead>
          <tr>
            <th>#</th>
            <th>Tema</th>
            <th>Assunto</th>
            <th>Palavras-chave</th>
            <th>Solução</th>
            <th>Feedback</th>
          </tr>
        </thead>
        <tbody>
    `;

    resultados.forEach((item, idx) => {
      html += `
        <tr>
          <td>${idx + 1}</td>
          <td>${item.doc.macrotema || ""}</td>
          <td>${item.doc.microtema || ""}</td>
          <td>${item.doc.palavras || ""}</td>
          <td>${item.doc.solucao || ""}</td>
          <td>
            <button onclick="registrarFeedback(${item.index}, true)">👍</button>
            <button onclick="registrarFeedback(${item.index}, false)">👎</button>
          </td>
        </tr>
      `;
    });

    html += `</tbody></table>`;
    container.innerHTML = html;
  }

  // --- Evento do botão de busca ---
  const btnBuscar = document.getElementById("btn-buscar");
  if (btnBuscar) {
    btnBuscar.addEventListener("click", function () {
      const query = document.getElementById("busca-input").value.trim();

      if (query === "") {
        alert("Digite um termo para buscar.");
      } else {
        const resultados = buscarDocumento(query);
        exibirResultados(resultados);
      }
    });
  } else {
    console.error("Elemento com id 'btn-buscar' não encontrado.");
  }

  // --- Função para registrar feedback ---
  window.registrarFeedback = function (index, isPositive) {
    const docs = JSON.parse(localStorage.getItem("documentos")) || [];
    if (docs[index]) {
      if (!docs[index].feedback) {
        docs[index].feedback = { positive: 0, negative: 0 };
      }

      if (isPositive) {
        docs[index].feedback.positive += 1;
        alert("Feedback positivo registrado para a solução: " + docs[index].solucao);
      } else {
        docs[index].feedback.negative += 1;
        alert("Feedback negativo registrado para a solução: " + docs[index].solucao);
      }

      localStorage.setItem("documentos", JSON.stringify(docs));
    }
  };
});

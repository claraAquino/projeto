document.addEventListener("DOMContentLoaded", () => {
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

    const totalUsuariosEl = document.getElementById("total-usuarios");
  const totalDocumentosEl = document.getElementById("total-documentos");

  // Busca usuários do backend
  fetch("http://localhost:3000/users")
    .then(resp => resp.json())
    .then(data => {
      if (totalUsuariosEl) totalUsuariosEl.textContent = data.length;
    })
    .catch(err => {
      console.error("Erro ao buscar usuários:", err);
      if (totalUsuariosEl) totalUsuariosEl.textContent = "Erro";
    });

  // A contagem de documentos ainda depende do localStorage (ou você quer integrar ao backend também?)
  const documentos = JSON.parse(localStorage.getItem("documentos")) || [];
  if (totalDocumentosEl) totalDocumentosEl.textContent = documentos.length;
});


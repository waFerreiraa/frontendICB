function toggleMenu() {
  const nav = document.querySelector("nav");
  const hamburger = document.querySelector(".hamburger");
  nav.classList.toggle("active");
  hamburger.classList.toggle("toggle");
}

function mensagem() {
  const mensagem = encodeURIComponent("Olá, gostaria de mais informações!");
  window.open(`https://wa.me/5511989539307?text=${mensagem}`, "_blank");
}

// Esconde todos os submenus no início
document.querySelectorAll('header nav ul li ul').forEach(submenu => {
  submenu.style.display = 'none';
});

// Configura o clique para abrir/fechar submenu
document.querySelectorAll('header nav ul li').forEach(item => {
  const submenu = item.querySelector('ul');
  if (submenu) {
    const link = item.querySelector('a');
    link.addEventListener('click', e => {
      e.preventDefault();
      submenu.style.display = submenu.style.display === 'block' ? 'none' : 'block';
    });
  }
});

window.addEventListener('DOMContentLoaded', () => {
  const backendUrl = window.location.hostname.includes("localhost")
    ? "http://localhost:3000"
    : "https://backendicb-production.up.railway.app";

  fetch(`${backendUrl}/cultos/ultimo`)
    .then(response => response.json())
    .then(data => {
      const { titulo, link, imagem_path } = data || {};

      if (titulo) {
        document.getElementById('titulo-culto').textContent = titulo;
      }

      if (link) {
        const btn = document.getElementById('btn-acessar');
        btn.href = link;
        btn.style.display = 'inline-block';
      }

      if (imagem_path) {
        const imgPregador = document.getElementById('img-pregador');
        imgPregador.src = imagem_path; // aqui já é a URL completa do Cloudinary
        imgPregador.style.display = 'block';
      } else {
        // Se não tiver imagem, esconde o elemento
        document.getElementById('img-pregador').style.display = 'none';
      }
    })
    .catch(error => {
      console.error('Erro ao carregar culto:', error);
    });
});

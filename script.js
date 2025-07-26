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
      if (submenu.style.display === 'block') {
        submenu.style.display = 'none';
      } else {
        submenu.style.display = 'block';
      }
    });
  }
});

window.addEventListener('DOMContentLoaded', () => {
  const backendUrl = window.location.hostname.includes("localhost")
    ? "http://localhost:3000"
    : "https://backendicb-production.up.railway.app"; // Defina backendUrl aqui

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
        const hero = document.querySelector('.hero');
        // Usando diretamente a URL completa do Cloudinary que vem do backend
        hero.style.backgroundImage = `url('${imagem_path}')`;
        // Para exibir a imagem no corpo, se precisar (já tinha um id="img-pregador")
        const imgPregador = document.getElementById('img-pregador');
        if (imgPregador) {
          imgPregador.src = imagem_path;
          imgPregador.style.display = 'block'; // Mostra a imagem
        }
      }
    })
    .catch(error => {
      console.error('Erro ao carregar culto:', error);
      document.getElementById('titulo-culto').textContent = 'Erro ao carregar culto.';
    });
});
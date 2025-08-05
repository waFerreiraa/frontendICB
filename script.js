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
  fetch('https://backendicb-production.up.railway.app/cultos/ultimo')
    .then(response => response.json())
    .then(data => {
      if (!data) return;

      const { titulo, link, imagem_path } = data;

      if (titulo) {
        document.getElementById('titulo-culto').textContent = titulo;
      }

      if (link) {
        const btn = document.getElementById('btn-acessar');
        btn.href = link;
        btn.style.display = 'inline-block';
      }

      if (imagem_path) {
        // Define imagem no background
        const hero = document.querySelector('.hero');
        hero.style.backgroundImage = `url('${imagem_path}')`;

        // Mostra a imagem no <img id="img-pregador">
        const img = document.getElementById('img-pregador');
        img.src = imagem_path;
        img.style.display = 'block';
      }
    })
    .catch(error => {
      console.error('Erro ao carregar culto:', error);
    });
});

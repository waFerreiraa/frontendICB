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
  const defaultImage = 'img/Pastor Marcelo.png'; // Imagem padrão

  fetch('https://backendicb.onrender.com/cultos/ultimo')
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
      } else {
        document.getElementById('btn-acessar').style.display = 'none';
      }

      const hero = document.querySelector('.hero');
      if (imagem_path) {
        hero.style.backgroundImage = `url('${imagem_path}')`;
      } else {
        hero.style.backgroundImage = `url('${defaultImage}')`;
      }
    })
    .catch(error => {
      console.error('Erro ao carregar culto:', error);
      // Mesmo se erro, mostrar imagem padrão
      const hero = document.querySelector('.hero');
      hero.style.backgroundImage = `url('img/Pastor Marcelo.png')`;
      document.getElementById('titulo-culto').textContent = "Falha ao carregar culto";
      document.getElementById('btn-acessar').style.display = 'none';
    });
});

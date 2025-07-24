// Formulário de culto com upload de imagem
const formCulto = document.getElementById('form-culto');
formCulto.addEventListener('submit', async (e) => {
  e.preventDefault();
  const formData = new FormData(formCulto);

  try {
    const res = await fetch('http://localhost:3000/cultos', {
      method: 'POST',
      body: formData
    });
    const json = await res.json();

    if (json.status === 'sucesso') {
      alert('Palavra publicada com sucesso!');
      formCulto.reset();
    } else {
      alert('Erro ao publicar palavra.');
    }
  } catch (error) {
    alert('Erro na conexão com o servidor.');
    console.error(error);
  }
});

// Formulário de evento (JSON)
const formEvento = document.getElementById('evento-form');
formEvento.addEventListener('submit', async (e) => {
  e.preventDefault();

  const dados = {
    titulo: formEvento.titulo.value.trim(),
    data_evento: formEvento.data_evento.value,
    horario: formEvento.horario.value,
    local: formEvento.local.value.trim()
  };

  if (!dados.titulo || !dados.data_evento || !dados.horario || !dados.local) {
    alert('Preencha todos os campos!');
    return;
  }

  try {
    const res = await fetch('http://localhost:3000/agenda', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(dados)
    });

    const result = await res.json();

    if (result.status === 'sucesso') {
      alert('Evento cadastrado com sucesso!');
      formEvento.reset();
      carregarEventos(); // atualiza lista após cadastro
    } else {
      alert(result.erro || 'Erro ao cadastrar evento.');
    }
  } catch (error) {
    alert('Erro na conexão com o servidor.');
    console.error(error);
  }
});

// Função para carregar e exibir eventos
async function carregarEventos() {
  try {
    const res = await fetch('http://localhost:3000/agenda');
    const eventos = await res.json();

    let container = document.querySelector('.event-list');
    if (!container) {
      // Se não existir container, cria um e adiciona ao body
      container = document.createElement('div');
      container.classList.add('event-list');
      document.body.appendChild(container);
    }

    container.innerHTML = ''; // limpa a lista

    if (eventos.length === 0) {
      container.innerHTML = '<p>Nenhum evento cadastrado.</p>';
      return;
    }

    eventos.forEach(evento => {
      const article = document.createElement('article');
      article.classList.add('event');

      // Pega dia e mês da data do evento
      const data = new Date(evento.data_evento);
      const day = data.getDate().toString().padStart(2, '0');
      const month = data.toLocaleString('pt-BR', { month: 'short' }).toUpperCase();

      article.innerHTML = `
        <div class="event-date">
          <span class="day">${day}</span>
          <span class="month">${month}</span>
        </div>
        <div class="event-info">
          <h2>${evento.titulo}</h2>
          <p class="time">${evento.horario}</p>
          <p class="location">${evento.local}</p>
          <button class="btn-delete" data-id="${evento.id}">Excluir</button>
        </div>
      `;

      container.appendChild(article);
    });

    // Adiciona eventos de clique para os botões de excluir
    document.querySelectorAll('.btn-delete').forEach(botao => {
      botao.addEventListener('click', async (e) => {
        const id = e.target.getAttribute('data-id');
        if (confirm('Tem certeza que deseja excluir este evento?')) {
          try {
            const res = await fetch(`http://localhost:3000/agenda/${id}`, {
              method: 'DELETE'
            });
            const json = await res.json();
            if (json.status === 'Evento deletado com sucesso') {
              alert('Evento excluído!');
              carregarEventos(); // atualiza lista
            } else {
              alert(json.erro || 'Erro ao excluir evento.');
            }
          } catch (err) {
            alert('Erro na conexão com o servidor.');
            console.error(err);
          }
        }
      });
    });

  } catch (error) {
    console.error('Erro ao carregar eventos:', error);
  }
}

// Carrega eventos ao iniciar
window.addEventListener('DOMContentLoaded', carregarEventos);

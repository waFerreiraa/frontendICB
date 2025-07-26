// admin.js

const backendUrl = window.location.hostname.includes("localhost")
  ? "http://localhost:3000"
  : "https://backendicb-production.up.railway.app";

// REMOVIDO: Função getToken e redirecionamento para login

// --- Inicialização ---
document.addEventListener("DOMContentLoaded", () => {
  carregarEventos(); // Carrega os eventos ao iniciar a página
  carregarUltimoCultoParaEdicao(); // Carrega o último culto para edição
});

// --- Rota Cultos (POST e PUT) ---

// Carregar o último culto para preencher o formulário de edição
async function carregarUltimoCultoParaEdicao() {
    try {
        const res = await fetch(`${backendUrl}/cultos/ultimo`);
        const culto = await res.json();

        if (culto) {
            document.getElementById('titulo-culto').value = culto.titulo;
            document.getElementById('culto-id').value = culto.id;
            document.getElementById('current-image-path').value = culto.imagem_path;
            document.getElementById('current-public-id').value = culto.public_id;
        }
    } catch (err) {
        console.error("Erro ao carregar último culto para edição:", err);
    }
}


// Formulário de culto - Agora com POST (novo) e PUT (atualizar)
document.getElementById("form-culto").addEventListener("submit", async (e) => {
  e.preventDefault();
  
  const form = e.target;
  const cultoId = document.getElementById('culto-id').value;
  const formData = new FormData(form);

  const method = cultoId ? "PUT" : "POST";
  const url = cultoId ? `${backendUrl}/cultos/${cultoId}` : `${backendUrl}/cultos`;

  try {
    const res = await fetch(url, {
      method: method,
      body: formData,
      // REMOVIDO: Headers de Authorization
    });

    const json = await res.json();

    if (res.ok) {
      alert(json.status || "Operação realizada com sucesso!");
      form.reset();
      carregarUltimoCultoParaEdicao();
    } else {
      alert(json.erro || "Erro ao realizar a operação.");
      console.error("Erro do servidor:", json.erro);
    }
  } catch (err) {
    alert("Erro ao conectar com o servidor.");
    console.error(err);
  }
});

// --- Rota Agenda (POST, PUT e DELETE) ---

// Formulário de evento - Permanece como estava, mas adiciona PUT
document.getElementById("evento-form").addEventListener("submit", async (e) => {
  e.preventDefault();
  
  const form = e.target;
  const eventoId = form.dataset.editingId;

  const dados = {
    titulo: form.titulo.value.trim(),
    data_evento: form.data_evento.value,
    horario: form.horario.value,
    local: form.local.value.trim(),
  };

  const method = eventoId ? "PUT" : "POST";
  const url = eventoId ? `${backendUrl}/agenda/${eventoId}` : `${backendUrl}/agenda`;

  try {
    const res = await fetch(url, {
      method: method,
      headers: {
        "Content-Type": "application/json",
        // REMOVIDO: Headers de Authorization
      },
      body: JSON.stringify(dados),
    });

    const json = await res.json();

    if (res.ok) {
      alert(json.status || "Operação realizada com sucesso!");
      form.reset();
      form.removeAttribute('data-editing-id');
      document.getElementById('btn-cadastrar-evento').textContent = 'Cadastrar Evento';
      carregarEventos();
    } else {
      alert(json.erro || "Erro ao realizar a operação.");
      console.error("Erro do servidor:", json.erro);
    }
  } catch (err) {
    alert("Erro na conexão com o servidor.");
    console.error(err);
  }
});


// Função para carregar eventos e adicionar funcionalidade de edição/exclusão
async function carregarEventos() {
  try {
    const res = await fetch(`${backendUrl}/agenda`); // Rota pública
    const eventos = await res.json();

    const container = document.querySelector(".event-list");
    container.innerHTML = "";

    if (!eventos || !eventos.length) {
      container.innerHTML = "<p>Nenhum evento cadastrado.</p>";
      return;
    }

    eventos.forEach((evento) => {
      const data = new Date(evento.data_evento);
      const day = String(data.getDate()).padStart(2, "0");
      const month = data.toLocaleString("pt-BR", { month: "short" }).toUpperCase();
      const year = data.getFullYear();

      container.innerHTML += `
        <article class="event">
          <div class="event-date">
            <span class="day">${day}</span>
            <span class="month">${month}</span>
            <span class="year">${year}</span>
          </div>
          <div class="event-info">
            <h2>${evento.titulo}</h2>
            <p class="time">${evento.horario.substring(0, 5)}</p>
            <p class="location">${evento.local}</p>
            <div class="event-actions">
              <button class="btn-edit" data-id="${evento.id}"
                data-titulo="${evento.titulo}"
                data-data="${evento.data_evento.split('T')[0]}"
                data-horario="${evento.horario.substring(0, 5)}"
                data-local="${evento.local}">Editar</button>
              <button class="btn-delete" data-id="${evento.id}">Excluir</button>
            </div>
          </div>
        </article>`;
    });

    // Excluir evento
    document.querySelectorAll(".btn-delete").forEach((btn) => {
      btn.addEventListener("click", async () => {
        const id = btn.dataset.id;
        if (confirm("Deseja excluir este evento?")) {
          try {
            const res = await fetch(`${backendUrl}/agenda/${id}`, {
              method: "DELETE",
              // REMOVIDO: Headers de Authorization
            });
            const json = await res.json();
            if (res.ok) {
              alert(json.status || "Evento excluído com sucesso!");
              carregarEventos();
            } else {
              alert(json.erro || "Erro ao excluir.");
              console.error("Erro do servidor:", json.erro);
            }
          } catch (err) {
            alert("Erro na conexão.");
            console.error(err);
          }
        }
      });
    });

    // Editar evento
    document.querySelectorAll(".btn-edit").forEach((btn) => {
      btn.addEventListener("click", () => {
        const form = document.getElementById("evento-form");
        form.titulo.value = btn.dataset.titulo;
        form.data_evento.value = btn.dataset.data;
        form.horario.value = btn.dataset.horario;
        form.local.value = btn.dataset.local;
        form.dataset.editingId = btn.dataset.id;
        document.getElementById('btn-cadastrar-evento').textContent = 'Atualizar Evento';
        window.scrollTo({ top: form.offsetTop, behavior: 'smooth' });
      });
    });

  } catch (err) {
    console.error("Erro ao carregar eventos:", err);
  }
}
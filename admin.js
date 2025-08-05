const backendUrl = window.location.hostname.includes("localhost")
  ? "http://localhost:3000"
  : "https://backendicb-production.up.railway.app";

// Formulário de culto (com imagem e título)
document.getElementById("form-culto").addEventListener("submit", async (e) => {
  e.preventDefault();
  const form = e.target;
  const formData = new FormData();

  const titulo = form.titulo.value.trim();
  const imagem = form.imagem.files[0];

  if (!titulo || !imagem) {
    alert("Preencha o título e selecione uma imagem.");
    return;
  }

  formData.append("titulo", titulo);
  formData.append("imagem", imagem);

  try {
    const res = await fetch(`${backendUrl}/cultos`, {
      method: "POST",
      body: formData,
    });

    const json = await res.json();

    if (json.status) {
      alert("Culto publicado com sucesso!");
      form.reset();
    } else {
      alert(json.erro || "Erro ao publicar culto.");
    }
  } catch (err) {
    alert("Erro ao conectar com o servidor.");
    console.error(err);
  }
});

// Formulário de evento - permanece igual
document.getElementById("evento-form").addEventListener("submit", async (e) => {
  e.preventDefault();
  const form = e.target;

  const dados = {
    titulo: form.titulo.value.trim(),
    data_evento: form.data_evento.value,
    horario: form.horario.value,
    local: form.local.value.trim(),
  };

  try {
    const res = await fetch(`${backendUrl}/agenda`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(dados),
    });

    const json = await res.json();

    if (json.status) {
      alert("Evento cadastrado com sucesso!");
      form.reset();
      carregarEventos();
    } else {
      alert(json.erro || "Erro ao cadastrar evento.");
    }
  } catch (err) {
    alert("Erro na conexão com o servidor.");
    console.error(err);
  }
});

// Função para carregar eventos
async function carregarEventos() {
  try {
    const res = await fetch(`${backendUrl}/agenda`);
    const eventos = await res.json();

    const container = document.querySelector(".event-list");
    container.innerHTML = "";

    if (!eventos.length) {
      container.innerHTML = "<p>Nenhum evento cadastrado.</p>";
      return;
    }

    eventos.forEach((evento) => {
      const data = new Date(evento.data_evento);
      const day = String(data.getDate()).padStart(2, "0");
      const month = data.toLocaleString("pt-BR", { month: "short" }).toUpperCase();

      container.innerHTML += `
        <article class="event">
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
        </article>`;
    });

    // Excluir evento
    document.querySelectorAll(".btn-delete").forEach((btn) => {
      btn.addEventListener("click", async () => {
        const id = btn.dataset.id;
        if (confirm("Deseja excluir este evento?")) {
          try {
            const res = await fetch(`${backendUrl}/agenda/${id}`, { method: "DELETE" });
            const json = await res.json();
            if (json.status) {
              alert("Evento excluído com sucesso!");
              carregarEventos();
            } else {
              alert(json.erro || "Erro ao excluir.");
            }
          } catch (err) {
            alert("Erro na conexão.");
          }
        }
      });
    });
  } catch (err) {
    console.error("Erro ao carregar eventos:", err);
  }
}

window.addEventListener("DOMContentLoaded", carregarEventos);

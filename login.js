// login.js

const backendUrl = window.location.hostname.includes("localhost")
  ? "http://localhost:3000"
  : "https://backendicb-production.up.railway.app";

document.getElementById("login-form").addEventListener("submit", async (e) => {
  e.preventDefault();

  const username = document.getElementById("username").value;
  const password = document.getElementById("password").value;
  const loginMessage = document.getElementById("login-message");

  try {
    const res = await fetch(`${backendUrl}/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ username, password }),
    });

    const data = await res.json();

    if (res.ok) { // Verifica se a resposta foi bem-sucedida (status 2xx)
      localStorage.setItem("jwt_token", data.token); // Armazena o token
      alert(data.mensagem); // Mensagem de sucesso do backend
      window.location.href = "admin.html"; // Redireciona para o painel de admin
    } else {
      loginMessage.textContent = data.erro || "Erro ao fazer login.";
      console.error("Erro no login:", data.erro);
    }
  } catch (err) {
    loginMessage.textContent = "Erro de conexão. Tente novamente.";
    console.error("Erro de rede/conexão:", err);
  }
});
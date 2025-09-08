document.getElementById("loginForm").addEventListener("submit", async (e) => {
  e.preventDefault(); // evita que a página recarregue

  const email = document.getElementById("email").value;
  const senha = document.getElementById("senha").value;

  try {
    const response = await fetch("/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, senha })
    });

    const data = await response.json();

    console.log("Response:", response); // depuração
    console.log("Data:", data);         // depuração

    if (response.ok) {
      // Redireciona conforme o nível de acesso
      if (data.role === "diretor") {
        window.location.href = "diretor.html";
      } else if (data.role === "professor") {
        window.location.href = "professor.html";
      } else if (data.role === "aluno") {
        window.location.href = "aluno.html";
      } else {
        document.getElementById("mensagem").textContent = "Role desconhecida.";
      }
    } else {
      document.getElementById("mensagem").textContent = data.message;
    }
  } catch (err) {
    document.getElementById("mensagem").textContent = "Erro ao conectar com o servidor.";
    console.error(err);
  }
});

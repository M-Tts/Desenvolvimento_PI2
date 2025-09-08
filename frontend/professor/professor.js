document.getElementById("loginForm").addEventListener("submit", async (e) => {
  e.preventDefault();

  const email = document.getElementById("email").value;
  const senha = document.getElementById("senha").value;

  const res = await fetch("/login/professor", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, senha })
  });

  const data = await res.json();
  if (res.ok) {
    localStorage.setItem("professorLogado", JSON.stringify(data.user));
    window.location.href = "professor.html";
  } else {
    alert(data.message);
  }
});

// Botão "Esqueci a senha"
document.getElementById("esqueciSenha").addEventListener("click", () => {
  alert("Funcionalidade de recuperação de senha ainda não implementada.");
  // Futuramente aqui você pode abrir uma tela ou enviar email
});

// Botão "Voltar para a página inicial"
document.getElementById("voltarInicio").addEventListener("click", () => {
  window.location.href = "../index.html"; // volta para a tela de boas-vindas
});
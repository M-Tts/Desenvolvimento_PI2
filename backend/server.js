const express = require("express");
const sqlite3 = require("sqlite3").verbose();
const bodyParser = require("body-parser");
const path = require("path");

const app = express();
const PORT = 3000;

// Middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Banco de dados SQLite
const db = new sqlite3.Database("./backend/usuarios.sqlite", (err) => {
  if (err) return console.error("Erro ao abrir banco:", err.message);
  console.log("Banco aberto com sucesso!");

  // Cria a tabela de usuários
  db.run(`
    CREATE TABLE IF NOT EXISTS usuarios (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      nome TEXT,
      email TEXT UNIQUE,
      senha TEXT,
      role TEXT,
      turma TEXT
    )
  `, (err) => {
    if (err) return console.error("Erro ao criar tabela:", err.message);
    console.log("Tabela de usuários pronta!");

    // Insere usuário admin (diretor) padrão se não existir
    db.get("SELECT * FROM usuarios WHERE email = ?", ["admin@site.com"], (err, row) => {
      if (err) return console.error("Erro ao buscar usuário admin:", err.message);
      if (!row) {
        db.run(
          "INSERT INTO usuarios (nome, email, senha, role, turma) VALUES (?, ?, ?, ?, ?)",
          ["Administrador", "admin@site.com", "1234", "diretor", null],
          (err) => {
            if (err) console.error("Erro ao criar usuário admin:", err.message);
            else console.log("Usuário admin criado: admin@site.com | senha: 1234 | role: diretor");
          }
        );
      } else {
        console.log("Usuário admin já existe no banco.");
      }
    });
  });
});

// Endpoint de login
app.post("/login", (req, res) => {
  const { email, senha } = req.body;

  db.get(
    "SELECT * FROM usuarios WHERE email = ? AND senha = ?",
    [email, senha],
    (err, row) => {
      if (err) return res.status(500).json({ message: "Erro no servidor" });
      if (!row) return res.status(401).json({ message: "Credenciais inválidas" });

      // Retorna nome, role e turma
      res.json({ message: "Login bem-sucedido", nome: row.nome, role: row.role, turma: row.turma });
    }
  );
});

// Endpoint de teste
app.get("/ping", (req, res) => {
  res.send("Servidor funcionando! 🚀");
});

// Servir arquivos do frontend
app.use(express.static(path.join(__dirname, "../frontend")));

app.listen(PORT, () => {
  console.log(`Servidor rodando em http://localhost:${PORT}`);
});
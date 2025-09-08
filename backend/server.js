const express = require("express");
const sqlite3 = require("sqlite3").verbose();
const bodyParser = require("body-parser");
const path = require("path");

const app = express();
app.use(express.static("frontend"));
app.use(bodyParser.json());

// Conexões separadas
const dbAlunos = new sqlite3.Database("./backend/alunos.sqlite");
const dbProfessores = new sqlite3.Database("./backend/professores.sqlite");

// Criação inicial das tabelas
dbAlunos.run(`CREATE TABLE IF NOT EXISTS alunos (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  nome TEXT,
  email TEXT UNIQUE,
  senha TEXT,
  turma TEXT
)`);

dbProfessores.run(`CREATE TABLE IF NOT EXISTS professores (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  nome TEXT,
  email TEXT UNIQUE,
  senha TEXT,
  disciplina TEXT
)`);

// Rota de login aluno
app.post("/login/aluno", (req, res) => {
  const { email, senha } = req.body;
  dbAlunos.get("SELECT * FROM alunos WHERE email = ? AND senha = ?", [email, senha], (err, row) => {
    if (err) return res.status(500).json({ message: "Erro no servidor" });
    if (!row) return res.status(401).json({ message: "Credenciais inválidas" });
    res.json({ message: "Login aluno bem-sucedido", user: row });
  });
});

// Rota de login prosfessor
app.post("/login/professor", (req, res) => {
  const { email, senha } = req.body;
  dbProfessores.get("SELECT * FROM professores WHERE email = ? AND senha = ?", [email, senha], (err, row) => {
    if (err) return res.status(500).json({ message: "Erro no servidor" });
    if (!row) return res.status(401).json({ message: "Credenciais inválidas" });
    res.json({ message: "Login professor bem-sucedido", user: row });
  });
});

// Endpoint de teste
app.get("/ping", (req, res) => {
  res.send("Servidor funcionando! 🚀");
});

// Servir arquivos do frontend
app.use(express.static(path.join(__dirname, "../frontend")));


const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor rodando em http://localhost:${PORT}`);
});
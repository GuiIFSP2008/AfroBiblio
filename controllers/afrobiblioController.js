const Titulo = require("../models/afrobiblioModel.js");
const path = require('path');

// Exibir todos os títulos
exports.getTitulos = (req, res) => {
  Titulo.getAll((err, results) => {
    if (err) {
      console.error("Erro ao buscar títulos:", err);
      return res.status(500).send("Erro ao buscar títulos");
    }
    res.status(200).json(results);
  });
};

// Cadastrar novo título
exports.addTitulo = (req, res) => {
  const { titulo, autor, pais, ano_publicacao, descricao } = req.body;

  if (!titulo || !autor) {
    return res.status(400).send("Título e autor são obrigatórios.");
  }

  const novoTitulo = { titulo, autor, pais, ano_publicacao, descricao };

  Titulo.insert(novoTitulo, (err) => {
    if (err) {
      console.error("Erro ao cadastrar título:", err);
      return res.status(500).send("Erro ao cadastrar título.");
    }
    res.status(201).send("Título cadastrado com sucesso!");
  });
};
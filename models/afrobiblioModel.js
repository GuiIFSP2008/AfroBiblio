const db = require("../config/db.js");

const Titulo = {
  getAll: (callback) => {
    const sql = "SELECT * FROM titulos";
    db.query(sql, callback);
  },

  insert: (titulo, callback) => {
    const sql = `
      INSERT INTO titulos (titulo, autor, pais, ano_publicacao, descricao)
      VALUES (?, ?, ?, ?, ?)
    `;
    const values = [
      titulo.titulo,
      titulo.autor,
      titulo.pais,
      titulo.ano_publicacao,
      titulo.descricao
    ];
    db.query(sql, values, callback);
  }
};

module.exports = Titulo;

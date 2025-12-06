const mysql = require("mysql2");

const connection = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "", 
    database: "afrobiblio",
    charset: "utf8mb4"
});

connection.connect((err) => {
    if (err) {
        console.error("❌ Erro ao conectar ao banco:", err);
    } else {
        console.log("✅ Conectado ao banco de dados MariaDB");
    }
});

module.exports = connection;


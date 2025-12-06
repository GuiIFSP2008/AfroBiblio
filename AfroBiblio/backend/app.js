const express = require("express");
const cors = require("cors");
const path = require("path");
const afrobiblioRoutes = require("./routes/afrobiblioRoutes.js");
console.log("✅ Rotas carregadas:", typeof afrobiblioRoutes);
require("./config/db.js");

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, "../frontend")));
app.use("/", afrobiblioRoutes);

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`🌍 Servidor rodando em http://localhost:${PORT}`);
});

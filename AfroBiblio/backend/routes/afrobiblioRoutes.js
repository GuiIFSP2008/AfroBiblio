const express = require("express");
const router = express.Router();
const path = require("path");
const db = require("../config/db");

const FRONTEND_PATH = path.join(__dirname, "../../frontend");

// ===============================
// ROTAS DE PÁGINAS
// ===============================
router.get("/", (req, res) => {
  res.sendFile(path.join(FRONTEND_PATH, "index.html"));
});

router.get("/cadastro", (req, res) => {
  res.sendFile(path.join(FRONTEND_PATH, "cadastro", "cadastro.html"));
});

router.get("/login", (req, res) => {
  res.sendFile(path.join(FRONTEND_PATH, "login", "login.html"));
});

router.get("/titulos", (req, res) => {
  res.sendFile(path.join(FRONTEND_PATH, "titulos", "titulos.html"));
});

router.get("/autores", (req, res) => {
  res.sendFile(path.join(FRONTEND_PATH, "autores", "autores.html"));
});

router.get("/adicionar", (req, res) => {
  res.sendFile(path.join(FRONTEND_PATH, "adicionar", "adicionar.html"));
});

router.get("/adicionar/titulo", (req, res) => {
  res.sendFile(path.join(FRONTEND_PATH, "adicionar", "addTitulo.html"));
});

router.get("/adicionar/autor", (req, res) => {
  res.sendFile(path.join(FRONTEND_PATH, "adicionar", "addAutor.html"));
});

router.get("/perfil", (req, res) => {
  res.sendFile(path.join(FRONTEND_PATH, "perfil", "perfil.html"));
});

router.get("/buscar", (req, res) => {
  res.sendFile(path.join(FRONTEND_PATH, "buscar", "buscar.html"));
});

// ===============================
// LOGIN
// ===============================
router.post("/login", (req, res) => {
  const { email, senha } = req.body;

  if (!email || !senha) {
    return res.status(400).json({ erro: "Preencha todos os campos." });
  }

  const sql = "SELECT * FROM usuarios WHERE email = ?";

  db.query(sql, [email], (err, results) => {
    if (err) {
      console.error("Erro no banco:", err);
      return res.status(500).json({ erro: "Erro interno." });
    }

    if (results.length === 0) {
      return res.status(401).json({ erro: "Email ou senha inválidos." });
    }

    const usuario = results[0];

    if (usuario.senha !== senha) {
      return res.status(401).json({ erro: "Email ou senha inválidos." });
    }

    res.json({
      mensagem: "Login bem-sucedido!",
      usuario: {
        id: usuario.id,
        nome: usuario.nome,
        email: usuario.email,
        pais: usuario.pais
      }
    });
  });
});

// ===============================
// CADASTRO
// ===============================
router.post("/cadastro", (req, res) => {
  const { nome, email, senha, pais } = req.body;

  if (!nome || !email || !senha) {
    return res.status(400).json({ erro: "Preencha todos os campos obrigatórios." });
  }

  const sql = `
    INSERT INTO usuarios (nome, email, senha, pais)
    VALUES (?, ?, ?, ?)
  `;

  db.query(sql, [nome, email, senha, pais || null], (err) => {
    if (err) {
      if (err.code === "ER_DUP_ENTRY") {
        return res.status(400).json({ erro: "Email já cadastrado." });
      }
      console.error("Erro ao cadastrar usuário:", err);
      return res.status(500).json({ erro: "Erro interno." });
    }

    res.status(201).json({ mensagem: "Usuário cadastrado com sucesso!" });
  });
});
// ===============================
// TÍTULOS ALEATÓRIOS (máx 4)
// ===============================
router.get("/api/random/titulos", (req, res) => {
  const sql = `
    SELECT t.id, t.titulo, a.nome AS autor, p.nome AS pais
    FROM titulos t
    LEFT JOIN autores a ON a.id = t.autor_id
    LEFT JOIN paises p ON p.id = t.pais_id
    ORDER BY RAND()
    LIMIT 4
  `;

  db.query(sql, (err, results) => {
    if (err) return res.status(500).json({ erro: "Erro ao buscar títulos." });
    res.json(results);
  });
});

// ===============================
// AUTORES ALEATÓRIOS (máx 4)
// ===============================
router.get("/api/random/autores", (req, res) => {
  const sql = `
    SELECT a.id, a.nome, a.biografia, p.nome AS pais
    FROM autores a
    LEFT JOIN paises p ON p.id = a.pais_id
    ORDER BY RAND()
    LIMIT 4
  `;

  db.query(sql, (err, results) => {
    if (err) return res.status(500).json({ erro: "Erro ao buscar autores." });
    res.json(results);
  });
});

// ===============================
// LISTAR TODOS OS TÍTULOS
// ===============================
router.get("/api/titulos", (req, res) => {
  const sql = `
    SELECT 
      t.id, t.titulo, t.ano_publicacao, t.descricao,
      a.nome AS autor,
      p.nome AS pais
    FROM titulos t
    LEFT JOIN autores a ON t.autor_id = a.id
    LEFT JOIN paises p ON t.pais_id = p.id
    ORDER BY t.titulo ASC
  `;

  db.query(sql, (err, results) => {
    if (err) return res.status(500).json({ erro: "Erro ao buscar títulos." });
    res.json(results);
  });
});

// ===============================
// EXCLUIR PERFIL
// ===============================
router.delete("/perfil/:id", (req, res) => {
  const { id } = req.params;

  const sql = "DELETE FROM usuarios WHERE id = ?";

  db.query(sql, [id], (err, result) => {
    if (err) {
      console.error("Erro ao excluir usuário:", err);
      return res.status(500).json({ erro: "Erro ao excluir usuário." });
    }

    if (result.affectedRows === 0) {
      return res.status(404).json({ erro: "Usuário não encontrado." });
    }

    res.json({ mensagem: "Usuário excluído com sucesso!" });
  });
});

// ===============================
// ATUALIZAR PERFIL
// ===============================
router.put("/atualizar-perfil/:id", (req, res) => {
  const { id } = req.params;
  const { nome, senha, pais } = req.body;

  if (!nome) {
    return res.status(400).json({ erro: "Nome é obrigatório." });
  }

  let sql = "UPDATE usuarios SET nome = ?";
  const dados = [nome];

  if (senha && senha.trim() !== "") {
    sql += ", senha = ?";
    dados.push(senha);
  }

  if (pais) {
    sql += ", pais = ?";
    dados.push(pais);
  }

  sql += " WHERE id = ?";
  dados.push(id);

  db.query(sql, dados, (err) => {
    if (err) {
      console.error("Erro ao atualizar perfil:", err);
      return res.status(500).json({ erro: "Erro ao atualizar perfil." });
    }

    res.json({ mensagem: "Perfil atualizado com sucesso!" });
  });
});

// ===============================
// TÍTULOS DO USUÁRIO
// ===============================
router.get("/api/titulos/usuario/:id", (req, res) => {
  const sql = `
    SELECT t.*, a.nome AS nome_autor
    FROM titulos t
    LEFT JOIN autores a ON a.id = t.autor_id
    WHERE t.usuario_id = ?
  `;

  db.query(sql, [req.params.id], (err, result) => {
    if (err) return res.status(500).json({ erro: "Erro ao buscar títulos." });
    res.json(result);
  });
});

// ===============================
// AUTORES DO USUÁRIO
// ===============================
router.get("/api/autores/usuario/:id", (req, res) => {
  const sql = `
    SELECT a.*, p.nome AS pais
    FROM autores a
    LEFT JOIN paises p ON p.id = a.pais_id
    WHERE a.usuario_id = ?
  `;

  db.query(sql, [req.params.id], (err, result) => {
    if (err) return res.status(500).json({ erro: "Erro ao buscar autores." });
    res.json(result);
  });
});
// ===============================
// ADICIONAR TÍTULO
// ===============================
router.post("/adicionar/titulo", (req, res) => {
  const { titulo, autor_id, pais_id, ano_publicacao, descricao, idiomas, usuario_id } = req.body;

  if (!titulo || !autor_id || !pais_id || !usuario_id) {
    return res.status(400).json({ erro: "Preencha título, autor, país e esteja logado." });
  }

  const sql = `
    INSERT INTO titulos (titulo, autor_id, pais_id, ano_publicacao, descricao, usuario_id)
    VALUES (?, ?, ?, ?, ?, ?)
  `;

  db.query(sql, [titulo, autor_id, pais_id, ano_publicacao || null, descricao || null, usuario_id], (err, result) => {
    if (err) {
      console.error("Erro ao inserir título:", err);
      return res.status(500).json({ erro: "Erro ao cadastrar título." });
    }

    const titulo_id = result.insertId;

    // Se não tiver idiomas, já termina aqui
    if (!idiomas || idiomas.length === 0) {
      return res.json({ mensagem: "Título cadastrado com sucesso!", titulo_id });
    }

    const sqlIdiomas = `
      INSERT INTO titulos_idiomas (titulo_id, idioma_id)
      VALUES ?
    `;

    const valores = idiomas.map(id => [titulo_id, id]);

    db.query(sqlIdiomas, [valores], (err2) => {
      if (err2) {
        console.error("Erro ao inserir idiomas:", err2);
        return res.status(500).json({ erro: "Título criado, mas houve erro ao salvar idiomas." });
      }

      res.json({
        mensagem: "Título e idiomas cadastrados com sucesso!",
        titulo_id
      });
    });
  });
});

// ===============================
// ADICIONAR AUTOR
// ===============================
router.post("/adicionar/autor", (req, res) => {
  const { nome, pais_id, biografia, usuario_id } = req.body;

  if (!nome || !pais_id || !usuario_id) {
    return res.status(400).json({ erro: "Preencha nome, país e esteja logado." });
  }

  const sql = `
    INSERT INTO autores (nome, pais_id, biografia, usuario_id)
    VALUES (?, ?, ?, ?)
  `;

  db.query(sql, [nome, pais_id, biografia || null, usuario_id], (err, result) => {
    if (err) {
      console.error("Erro ao inserir autor:", err);
      return res.status(500).json({ erro: "Erro ao cadastrar autor." });
    }

    res.json({
      mensagem: "Autor cadastrado com sucesso!",
      autor_id: result.insertId
    });
  });
});

// ===============================
// LISTAR AUTORES
// ===============================
router.get("/api/autores", (req, res) => {
  const sql = `
    SELECT a.id, a.nome, a.biografia, p.nome AS pais
    FROM autores a
    LEFT JOIN paises p ON a.pais_id = p.id
    ORDER BY a.nome
  `;

  db.query(sql, (err, results) => {
    if (err) {
      console.error("Erro ao buscar autores:", err);
      return res.status(500).json({ erro: "Erro ao buscar autores." });
    }

    res.json(results);
  });
});

// ===============================
// LISTAR PAÍSES
// ===============================
router.get("/api/paises", (req, res) => {
  const sql = "SELECT id, nome FROM paises ORDER BY nome";

  db.query(sql, (err, results) => {
    if (err) {
      console.error("Erro ao buscar países:", err);
      return res.status(500).json({ erro: "Erro ao buscar países." });
    }

    res.json(results);
  });
});

// ===============================
// LISTAR IDIOMAS
// ===============================
router.get("/api/idiomas", (req, res) => {
  const sql = "SELECT id, nome FROM idiomas ORDER BY nome";

  db.query(sql, (err, results) => {
    if (err) {
      console.error("Erro ao buscar idiomas:", err);
      return res.status(500).json({ erro: "Erro ao buscar idiomas." });
    }

    res.json(results);
  });
});
// =============================
// DELETE TÍTULO
// =============================
router.delete("/api/titulos/:id", (req, res) => {
  const { id } = req.params;

  // Remove idiomas vinculados ao título
  const sqlIdiomas = "DELETE FROM titulos_idiomas WHERE titulo_id = ?";

  db.query(sqlIdiomas, [id], (err) => {
    if (err) {
      console.error("Erro ao remover idiomas:", err);
      return res.status(500).json({ erro: "Erro ao excluir idiomas do título." });
    }

    // Depois remove o título
    const sqlTitulo = "DELETE FROM titulos WHERE id = ?";

    db.query(sqlTitulo, [id], (err2, result) => {
      if (err2) {
        console.error("Erro ao excluir título:", err2);
        return res.status(500).json({ erro: "Erro ao excluir título." });
      }

      if (result.affectedRows === 0) {
        return res.status(404).json({ erro: "Título não encontrado." });
      }

      res.json({ mensagem: "Título excluído com sucesso!" });
    });
  });
});

// =============================
// DELETE AUTOR
// =============================
router.delete("/api/autores/:id", (req, res) => {
  const { id } = req.params;

  // 1. Remove idiomas de títulos do autor
  const sqlIdiomas = `
    DELETE titulos_idiomas FROM titulos_idiomas
    INNER JOIN titulos ON titulos_idiomas.titulo_id = titulos.id
    WHERE titulos.autor_id = ?
  `;

  db.query(sqlIdiomas, [id], (err) => {
    if (err) {
      console.error("Erro ao excluir idiomas:", err);
      return res.status(500).json({ erro: "Erro ao excluir idiomas de títulos." });
    }

    // 2. Remove títulos do autor
    const sqlTitulos = "DELETE FROM titulos WHERE autor_id = ?";

    db.query(sqlTitulos, [id], (err2) => {
      if (err2) {
        console.error("Erro ao excluir títulos:", err2);
        return res.status(500).json({ erro: "Erro ao excluir títulos do autor." });
      }

      // 3. Remove o autor
      const sqlAutor = "DELETE FROM autores WHERE id = ?";

      db.query(sqlAutor, [id], (err3, result3) => {
        if (err3) {
          console.error("Erro ao excluir autor:", err3);
          return res.status(500).json({ erro: "Erro ao excluir autor." });
        }

        if (result3.affectedRows === 0) {
          return res.status(404).json({ erro: "Autor não encontrado." });
        }

        res.json({ mensagem: "Autor excluído com sucesso!" });
      });
    });
  });
});

// ===============================
// BUSCA GERAL (títulos + autores)
// ===============================
router.get("/api/buscar", (req, res) => {
  const termo = req.query.termo ? `%${req.query.termo}%` : "%";
  const filtroPais = req.query.pais || "todos";
  const filtroTipo = req.query.tipo || "todos"; // autor | titulo | todos

  let condAutores = "1=1";
  let condTitulos = "1=1";

  const paramsAutores = [];
  const paramsTitulos = [];

  // TERMO (LIKE)
  if (req.query.termo) {
    condAutores += " AND a.nome LIKE ? COLLATE utf8mb4_general_ci";
    paramsAutores.push(termo);

    condTitulos += " AND t.titulo LIKE ? COLLATE utf8mb4_general_ci";
    paramsTitulos.push(termo);
  }

  // FILTRO PAÍS
  if (filtroPais !== "todos") {
    condAutores += " AND p.nome = ?";
    paramsAutores.push(filtroPais);

    condTitulos += " AND p.nome = ?";
    paramsTitulos.push(filtroPais);
  }

  // CONSULTAS
  const sqlAutores = `
    SELECT a.id, a.nome, p.nome AS pais, a.biografia
    FROM autores a
    LEFT JOIN paises p ON p.id = a.pais_id
    WHERE ${condAutores}
  `;

  const sqlTitulos = `
    SELECT t.id, t.titulo, a.nome AS autor, p.nome AS pais, t.descricao
    FROM titulos t
    LEFT JOIN autores a ON a.id = t.autor_id
    LEFT JOIN paises p ON p.id = t.pais_id
    WHERE ${condTitulos}
  `;

  // ===== SOMENTE AUTORES =====
  if (filtroTipo === "autor") {
    return db.query(sqlAutores, paramsAutores, (err, autores) => {
      if (err) return res.status(500).json({ erro: "Erro ao buscar autores." });

      res.json(
        autores.map(a => ({
          tipo: "autor",
          id: a.id,
          nome: a.nome,
          pais: a.pais,
          biografia: a.biografia
        }))
      );
    });
  }

  // ===== SOMENTE TÍTULOS =====
  if (filtroTipo === "titulo") {
    return db.query(sqlTitulos, paramsTitulos, (err, titulos) => {
      if (err) return res.status(500).json({ erro: "Erro ao buscar títulos." });

      res.json(
        titulos.map(t => ({
          tipo: "titulo",
          id: t.id,
          titulo: t.titulo,
          autor: t.autor,
          pais: t.pais,
          descricao: t.descricao
        }))
      );
    });
  }

  // ===== AMBOS (todos) =====
  db.query(sqlAutores, paramsAutores, (errA, autores) => {
    if (errA) return res.status(500).json({ erro: "Erro ao buscar autores." });

    db.query(sqlTitulos, paramsTitulos, (errT, titulos) => {
      if (errT) return res.status(500).json({ erro: "Erro ao buscar títulos." });

      res.json([
        ...autores.map(a => ({
          tipo: "autor",
          id: a.id,
          nome: a.nome,
          pais: a.pais,
          biografia: a.biografia
        })),
        ...titulos.map(t => ({
          tipo: "titulo",
          id: t.id,
          titulo: t.titulo,
          autor: t.autor,
          pais: t.pais,
          descricao: t.descricao
        }))
      ]);
    });
  });
});

// ===============================
// LISTA DE PAÍSES PARA BUSCA
// ===============================
router.get("/api/buscar/paises", (req, res) => {
  const sql = `SELECT DISTINCT nome AS pais FROM paises ORDER BY nome`;

  db.query(sql, (err, results) => {
    if (err) {
      console.error("Erro ao buscar países:", err);
      return res.status(500).json({ erro: "Erro ao buscar países." });
    }

    res.json(results);
  });
});

// ===============================
// LISTA DE IDIOMAS PARA BUSCA
// ===============================
router.get("/api/buscar/idiomas", (req, res) => {
  const sql = `SELECT id, nome FROM idiomas ORDER BY nome`;

  db.query(sql, (err, results) => {
    if (err) {
      console.error("Erro ao buscar idiomas:", err);
      return res.status(500).json({ erro: "Erro ao buscar idiomas." });
    }

    res.json(results);
  });
});

// =============================
// EDITAR TÍTULO
// =============================
router.put("/api/titulos/:id", (req, res) => {
  const { id } = req.params;
  const { titulo, autor_id, pais_id, ano_publicacao, descricao } = req.body;

  const sql = `
    UPDATE titulos 
    SET titulo = ?, autor_id = ?, pais_id = ?, ano_publicacao = ?, descricao = ?
    WHERE id = ?
  `;

  db.query(sql, [titulo, autor_id, pais_id, ano_publicacao || null, descricao || null, id], (err) => {
    if (err) {
      console.error("Erro ao atualizar título:", err);
      return res.status(500).json({ erro: "Erro ao atualizar título." });
    }

    res.json({ mensagem: "Título atualizado com sucesso!" });
  });
});
// =============================
// GET TÍTULO POR ID (para editar)
// =============================
router.get("/api/titulos/:id", (req, res) => {
  const { id } = req.params;

  const sql = `
    SELECT 
      t.*,
      a.nome AS autor_nome,
      p.nome AS pais_nome
    FROM titulos t
    LEFT JOIN autores a ON a.id = t.autor_id
    LEFT JOIN paises p ON p.id = t.pais_id
    WHERE t.id = ?
  `;

  db.query(sql, [id], (err, result) => {
    if (err) {
      console.error("Erro ao buscar título:", err);
      return res.status(500).json({ erro: "Erro ao buscar título." });
    }

    if (result.length === 0) {
      return res.status(404).json({ erro: "Título não encontrado." });
    }

    res.json(result[0]);
  });
});

// =============================
// GET AUTOR POR ID (para editar)
// =============================
router.get("/api/autores/:id", (req, res) => {
  const { id } = req.params;

  const sql = `
    SELECT 
      a.id, a.nome, a.biografia, a.pais_id,
      p.nome AS pais
    FROM autores a
    LEFT JOIN paises p ON p.id = a.pais_id
    WHERE a.id = ?
  `;

  db.query(sql, [id], (err, result) => {
    if (err) {
      console.error("Erro ao buscar autor:", err);
      return res.status(500).json({ erro: "Erro ao buscar autor." });
    }

    if (result.length === 0) {
      return res.status(404).json({ erro: "Autor não encontrado." });
    }

    res.json(result[0]);
  });
});

// =============================
// EDITAR AUTOR
// =============================
router.put("/api/autores/:id", (req, res) => {
  const { id } = req.params;
  const { nome, pais_id, biografia } = req.body;

  const sql = `
    UPDATE autores 
    SET nome = ?, pais_id = ?, biografia = ?
    WHERE id = ?
  `;

  db.query(sql, [nome, pais_id || null, biografia || null, id], (err) => {
    if (err) {
      console.error("Erro ao atualizar autor:", err);
      return res.status(500).json({ erro: "Erro ao atualizar autor." });
    }

    res.json({ mensagem: "Autor atualizado com sucesso!" });
  });
});

// =============================
// EXPORTAR ROTAS
// =============================
module.exports = router;

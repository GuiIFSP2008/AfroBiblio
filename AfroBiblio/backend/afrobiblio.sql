DROP DATABASE IF EXISTS afrobiblio;
CREATE DATABASE afrobiblio CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE afrobiblio;

-- ===========================================
-- TABELA: PAISES
-- ===========================================
CREATE TABLE paises (
  id INT AUTO_INCREMENT PRIMARY KEY,
  nome VARCHAR(100) NOT NULL UNIQUE
) ENGINE=InnoDB;

-- ===========================================
-- TABELA: USUARIOS
-- ===========================================
CREATE TABLE usuarios (
  id INT AUTO_INCREMENT PRIMARY KEY,
  nome VARCHAR(100) NOT NULL,
  email VARCHAR(100) NOT NULL UNIQUE,
  senha VARCHAR(255) NOT NULL,
  pais VARCHAR(50)
) ENGINE=InnoDB;

-- ===========================================
-- TABELA: AUTORES
-- ===========================================
CREATE TABLE autores (
  id INT AUTO_INCREMENT PRIMARY KEY,
  nome VARCHAR(150) NOT NULL,
  pais_id INT,
  biografia TEXT,
  usuario_id INT,
  FOREIGN KEY (pais_id) REFERENCES paises(id) ON DELETE SET NULL,
  FOREIGN KEY (usuario_id) REFERENCES usuarios(id) ON DELETE SET NULL
) ENGINE=InnoDB;

-- ===========================================
-- TABELA: TITULOS
-- ===========================================
CREATE TABLE titulos (
  id INT AUTO_INCREMENT PRIMARY KEY,
  titulo VARCHAR(200) NOT NULL,
  autor_id INT,
  pais_id INT,
  ano_publicacao INT,
  descricao TEXT,
  usuario_id INT,
  FOREIGN KEY (autor_id) REFERENCES autores(id) ON DELETE SET NULL,
  FOREIGN KEY (pais_id) REFERENCES paises(id) ON DELETE SET NULL,
  FOREIGN KEY (usuario_id) REFERENCES usuarios(id) ON DELETE SET NULL
) ENGINE=InnoDB;

-- ===========================================
-- TABELA: IDIOMAS
-- ===========================================
CREATE TABLE idiomas (
  id INT AUTO_INCREMENT PRIMARY KEY,
  nome VARCHAR(100) NOT NULL UNIQUE
) ENGINE=InnoDB;

-- ===========================================
-- TABELA: TITULOS_IDIOMAS (N:N)
-- ===========================================
CREATE TABLE titulos_idiomas (
  titulo_id INT NOT NULL,
  idioma_id INT NOT NULL,
  PRIMARY KEY (titulo_id, idioma_id),
  FOREIGN KEY (titulo_id) REFERENCES titulos(id) ON DELETE CASCADE,
  FOREIGN KEY (idioma_id) REFERENCES idiomas(id) ON DELETE CASCADE
) ENGINE=InnoDB;


-- ===========================================
-- INSERT: PAISES
-- ===========================================
INSERT INTO paises (nome) VALUES
('África do Sul'), ('Angola'), ('Argélia'), ('Benin'), ('Botsuana'),
('Burquina Faso'), ('Burundi'), ('Cabo Verde'), ('Camarões'), ('Chade'),
('Comores'), ('Congo'), ('Costa do Marfim'), ('Djibuti'), ('Egito'),
('Eritreia'), ('Eswatini'), ('Etiópia'), ('Gabão'), ('Gâmbia'),
('Gana'), ('Guiné'), ('Guiné-Bissau'), ('Guiné Equatorial'), ('Lesoto'),
('Libéria'), ('Líbia'), ('Madagascar'), ('Maláui'), ('Mali'),
('Marrocos'), ('Maurício'), ('Mauritânia'), ('Moçambique'), ('Namíbia'),
('Níger'), ('Nigéria'), ('Quênia'), ('República Centro-Africana'),
('República Democrática do Congo'), ('Ruanda'), ('São Tomé e Príncipe'),
('Senegal'), ('Serra Leoa'), ('Seychelles'), ('Somália'), ('Sudão'),
('Sudão do Sul'), ('Tanzânia'), ('Togo'), ('Tunísia'),
('Uganda'), ('Zâmbia'), ('Zimbábue');

-- ===========================================
-- INSERT: IDIOMAS
-- ===========================================
INSERT INTO idiomas (nome) VALUES
('Português'), ('Inglês'), ('Francês'), ('Espanhol'), ('Alemão'),
('Italiano'), ('Holandês'),
('Suaíli'), ('Iorubá'), ('Zulu'), ('Xhosa'), ('Hauçá'),
('Amárico'), ('Somali'), ('Shona'), ('Lingala'), ('Wolof'),
('Kinyarwanda'), ('Kirundi'), ('Akan'), ('Ewe'), ('Fula'),
('Tigrínia'), ('Berbere'), ('Árabe'), ('Árabe Egípcio'),
('Árabe Magrebino'), ('Bambara'), ('Fanti'), ('Soto'),
('Tswana'), ('Maasai'),
('Crioulo Cabo-Verdiano'), ('Crioulo Guineense'),
('Crioulo Haitiano'), ('Africâner');

-- ===========================================
-- INSERT: USUÁRIO ADMIN
-- ===========================================
INSERT INTO usuarios (nome, email, senha, pais) VALUES
('Administrador', 'admin@gmail.com', 'ifsp1234', 'Brasil');

-- ===========================================
-- INSERT: AUTORES
-- ===========================================
INSERT INTO autores (nome, pais_id, biografia, usuario_id) VALUES
('Chinua Achebe',
 (SELECT id FROM paises WHERE nome='Nigéria'),
 'Pai da literatura africana moderna, autor de "O Mundo se Despedaça".', 1),

('Ngũgĩ wa Thiong\'o',
 (SELECT id FROM paises WHERE nome='Quênia'),
 'Escritor e ativista queniano, defensor das línguas africanas.', 1),

('Mia Couto',
 (SELECT id FROM paises WHERE nome='Moçambique'),
 'Um dos maiores escritores de língua portuguesa, com forte realismo mágico.', 1),

('Naguib Mahfouz',
 (SELECT id FROM paises WHERE nome='Egito'),
 'Romancista egípcio vencedor do Nobel de Literatura (1988).', 1),

('Chimamanda Ngozi Adichie',
 (SELECT id FROM paises WHERE nome='Nigéria'),
 'Uma das mais influentes escritoras africanas contemporâneas.', 1);


-- ===========================================
-- INSERT: TÍTULOS (10 OBRAS)
-- ===========================================
INSERT INTO titulos (titulo, autor_id, pais_id, ano_publicacao, descricao, usuario_id) VALUES
('O Mundo se Despedaça',
 (SELECT id FROM autores WHERE nome='Chinua Achebe'),
 (SELECT id FROM paises WHERE nome='Nigéria'),
 1958,
 'Romance que retrata o impacto do colonialismo britânico na cultura igbo.',
 1),

('Não Mais Sossegados',
 (SELECT id FROM autores WHERE nome='Chinua Achebe'),
 (SELECT id FROM paises WHERE nome='Nigéria'),
 1960,
 'Segunda obra de Achebe, centrada em conflitos sociais na Nigéria pós-independência.',
 1),

('Um Grão de Milho',
 (SELECT id FROM autores WHERE nome='Ngũgĩ wa Thiong\'o'),
 (SELECT id FROM paises WHERE nome='Quênia'),
 1967,
 'Clássico queniano sobre colonialismo, amor e resistência.',
 1),

('Petals of Blood',
 (SELECT id FROM autores WHERE nome='Ngũgĩ wa Thiong\'o'),
 (SELECT id FROM paises WHERE nome='Quênia'),
 1977,
 'Romance político que critica corrupção e opressão no Quênia.',
 1),

('Terra Sonâmbula',
 (SELECT id FROM autores WHERE nome='Mia Couto'),
 (SELECT id FROM paises WHERE nome='Moçambique'),
 1992,
 'Um dos maiores romances africanos, mesclando guerra e fantasia.',
 1),

('O Último Voo do Flamingo',
 (SELECT id FROM autores WHERE nome='Mia Couto'),
 (SELECT id FROM paises WHERE nome='Moçambique'),
 2000,
 'Romance mágico sobre misteriosas explosões de soldados.',
 1),

('O Beco do Pilão',
 (SELECT id FROM autores WHERE nome='Naguib Mahfouz'),
 (SELECT id FROM paises WHERE nome='Egito'),
 1947,
 'Retrato social profundo ambientado nas ruas do Cairo.',
 1),

('O Ladrão e os Cães',
 (SELECT id FROM autores WHERE nome='Naguib Mahfouz'),
 (SELECT id FROM paises WHERE nome='Egito'),
 1961,
 'Romance que mistura existencialismo e crítica social.',
 1),

('Hibisco Roxo',
 (SELECT id FROM autores WHERE nome='Chimamanda Ngozi Adichie'),
 (SELECT id FROM paises WHERE nome='Nigéria'),
 2003,
 'Estreia literária de Adichie, sobre família, religião e liberdade.',
 1),

('Americanah',
 (SELECT id FROM autores WHERE nome='Chimamanda Ngozi Adichie'),
 (SELECT id FROM paises WHERE nome='Nigéria'),
 2013,
 'Romance sobre identidade, migração e questões raciais.',
 1);

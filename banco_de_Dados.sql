-- Criação do Banco de Dados
CREATE DATABASE IF NOT EXISTS quiz_transito
CHARACTER SET utf8mb4
COLLATE utf8mb4_unicode_ci;

USE quiz_transito;

-- Tabela de Perguntas
CREATE TABLE IF NOT EXISTS perguntas (
    id INT AUTO_INCREMENT PRIMARY KEY,
    pergunta TEXT NOT NULL,
    opcao_a VARCHAR(255) NOT NULL,
    opcao_b VARCHAR(255) NOT NULL,
    opcao_c VARCHAR(255) NOT NULL,
    opcao_d VARCHAR(255) NOT NULL,
    resposta_correta ENUM('A', 'B', 'C', 'D') NOT NULL,
    explicacao TEXT,
    categoria ENUM('placas', 'legislacao', 'direcao') DEFAULT 'placas',
    imagem VARCHAR(255) NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Tabela de Usuários (para futura implementação de login)
CREATE TABLE IF NOT EXISTS usuarios (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nome VARCHAR(100) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    senha VARCHAR(255) NOT NULL,
    tipo ENUM('admin', 'usuario') DEFAULT 'usuario',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Tabela para estatísticas do Quiz
CREATE TABLE IF NOT EXISTS estatisticas_quiz (
    id INT AUTO_INCREMENT PRIMARY KEY,
    usuario_id INT NULL,
    total_perguntas INT NOT NULL,
    acertos INT NOT NULL,
    data_realizacao TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (usuario_id) REFERENCES usuarios(id) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Tabela de Categorias (para organização futura)
CREATE TABLE IF NOT EXISTS categorias (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nome VARCHAR(50) NOT NULL UNIQUE,
    descricao TEXT,
    icone VARCHAR(50)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Inserir categorias padrão
INSERT INTO categorias (nome, descricao, icone) VALUES
('placas', 'Perguntas sobre placas de trânsito', '🚦'),
('legislacao', 'Perguntas sobre legislação de trânsito', '📜'),
('direcao', 'Perguntas sobre direção defensiva', '🚗'),
('primeiros_socorros', 'Perguntas sobre primeiros socorros', '🏥'),
('meio_ambiente', 'Perguntas sobre meio ambiente e trânsito', '🌳');

-- Inserir dados iniciais de perguntas
INSERT INTO perguntas (pergunta, opcao_a, opcao_b, opcao_c, opcao_d, resposta_correta, explicacao, categoria) VALUES
('Qual o significado da placa R-1?', 
 'Parada obrigatória', 
 'Proibido estacionar', 
 'Parada proibida', 
 'Estacionamento regulamentado', 
 'A', 
 'Placa de Parada Obrigatória - indica que o condutor deve parar seu veículo antes de entrar na via',
 'placas'),

('O que significa a placa de trânsito com fundo azul?', 
 'Regulamentação', 
 'Advertência', 
 'Indicação', 
 'Obras', 
 'C', 
 'Placas de indicação têm fundo azul ou verde e fornecem informações úteis aos motoristas',
 'placas'),

('Qual a velocidade máxima em vias arteriais sem sinalização?', 
 '40 km/h', 
 '60 km/h', 
 '80 km/h', 
 '100 km/h', 
 'B', 
 'Vias arteriais têm velocidade máxima de 60 km/h quando não sinalizadas',
 'legislacao'),

('O que significa a placa A-14?', 
 'Curva acentuada', 
 'Interseção em círculo', 
 'Rotatória', 
 'Cruzamento', 
 'B', 
 'Placa de Advertência: Interseção em círculo - indica rotatória à frente',
 'placas'),

('Qual a penalidade para dirigir sob influência de álcool?', 
 'Advertência por escrito', 
 'Multa e suspensão do direito de dirigir', 
 'Apenas multa', 
 'Apenas suspensão', 
 'B', 
 'Dirigir sob influência de álcool é infração gravíssima, com multa de R$ 2.934,70 e suspensão do direito de dirigir por 12 meses',
 'legislacao'),

('O que é direção defensiva?', 
 'Dirigir devagar', 
 'Dirigir com atenção para evitar acidentes', 
 'Dirigir apenas em pistas duplicadas', 
 'Usar sempre o celular', 
 'B', 
 'Direção defensiva é o ato de dirigir de modo a evitar acidentes, mesmo diante de ações incorretas de outros condutores',
 'direcao'),

('Qual a distância segura para manter do veículo da frente?', 
 '1 metro', 
 '2 metros', 
 'Regra dos 2 segundos', 
 '5 metros', 
 'C', 
 'A regra dos 2 segundos ajuda a manter distância segura: escolha um ponto fixo e conte 2 segundos após o veículo da frente passar',
 'direcao'),

('O que fazer em caso de aquaplanagem?', 
 'Frear bruscamente', 
 'Acelerar para sair da água', 
 'Tirar o pé do acelerador e manter o volante reto', 
 'Virar o volante rapidamente', 
 'C', 
 'Em caso de aquaplanagem, tire o pé do acelerador, mantenha o volante reto e não freie bruscamente',
 'direcao');

-- Inserir mais perguntas sobre placas específicas
INSERT INTO perguntas (pergunta, opcao_a, opcao_b, opcao_c, opcao_d, resposta_correta, explicacao, categoria) VALUES
('Qual o significado da placa R-6c?', 
 'Proibido estacionar', 
 'Estacionamento regulamentado', 
 'Proibido parar', 
 'Área de estacionamento', 
 'C', 
 'Placa R-6c significa "Proibido Parar e Estacionar" - não é permitido parar nem estacionar no local',
 'placas'),

('O que indica uma placa octogonal vermelha com bordas brancas?', 
 'Dê a preferência', 
 'Parada obrigatória', 
 'Proibido entrar', 
 'Siga em frente', 
 'B', 
 'A placa octogonal vermelha com bordas brancas é o símbolo universal de PARADA OBRIGATÓRIA',
 'placas'),

('Qual placa indica "Animais na pista"?', 
 'A-35', 
 'A-36', 
 'A-37', 
 'A-38', 
 'B', 
 'A placa A-36 "Animais" adverte sobre a possível presença de animais na pista',
 'placas'),

('O que significa a placa de trânsito com fundo laranja?', 
 'Indicação turística', 
 'Obras ou situações temporárias', 
 'Regulamentação especial', 
 'Serviços auxiliares', 
 'B', 
 'Placas com fundo laranja indicam obras ou situações temporárias no trânsito',
 'placas');

-- Criar índices para melhor performance
CREATE INDEX idx_perguntas_categoria ON perguntas(categoria);
CREATE INDEX idx_perguntas_resposta ON perguntas(resposta_correta);
CREATE INDEX idx_estatisticas_usuario ON estatisticas_quiz(usuario_id);
CREATE INDEX idx_estatisticas_data ON estatisticas_quiz(data_realizacao);

-- Criar view para estatísticas gerais
CREATE VIEW vw_estatisticas_gerais AS
SELECT 
    COUNT(*) as total_perguntas,
    COUNT(DISTINCT categoria) as total_categorias,
    (SELECT COUNT(*) FROM perguntas WHERE categoria = 'placas') as perguntas_placas,
    (SELECT COUNT(*) FROM perguntas WHERE categoria = 'legislacao') as perguntas_legislacao,
    (SELECT COUNT(*) FROM perguntas WHERE categoria = 'direcao') as perguntas_direcao
FROM perguntas;

-- Criar procedure para inserir pergunta com validação
DELIMITER //

CREATE PROCEDURE sp_inserir_pergunta(
    IN p_pergunta TEXT,
    IN p_opcao_a VARCHAR(255),
    IN p_opcao_b VARCHAR(255),
    IN p_opcao_c VARCHAR(255),
    IN p_opcao_d VARCHAR(255),
    IN p_resposta_correta CHAR(1),
    IN p_explicacao TEXT,
    IN p_categoria VARCHAR(50)
)
BEGIN
    -- Validar se a resposta correta é válida
    IF p_resposta_correta NOT IN ('A', 'B', 'C', 'D') THEN
        SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'Resposta correta deve ser A, B, C ou D';
    ELSE
        INSERT INTO perguntas (pergunta, opcao_a, opcao_b, opcao_c, opcao_d, resposta_correta, explicacao, categoria)
        VALUES (p_pergunta, p_opcao_a, p_opcao_b, p_opcao_c, p_opcao_d, p_resposta_correta, p_explicacao, p_categoria);
    END IF;
END//

-- Criar função para calcular porcentagem de acertos
CREATE FUNCTION fn_calcular_acertos(p_usuario_id INT) 
RETURNS DECIMAL(5,2)
DETERMINISTIC
READS SQL DATA
BEGIN
    DECLARE v_total INT;
    DECLARE v_acertos INT;
    DECLARE v_percentual DECIMAL(5,2);
    
    SELECT COUNT(*), SUM(acertos) INTO v_total, v_acertos
    FROM estatisticas_quiz
    WHERE usuario_id = p_usuario_id;
    
    IF v_total > 0 THEN
        SET v_percentual = (v_acertos / (v_total * 30)) * 100;
    ELSE
        SET v_percentual = 0;
    END IF;
    
    RETURN v_percentual;
END//

-- Criar trigger para atualizar timestamp
CREATE TRIGGER trg_perguntas_update
BEFORE UPDATE ON perguntas
FOR EACH ROW
BEGIN
    SET NEW.updated_at = CURRENT_TIMESTAMP;
END//

DELIMITER ;

-- Inserir usuário admin padrão (senha: admin123 - em produção use hash)
INSERT INTO usuarios (nome, email, senha, tipo) VALUES
('Administrador', 'admin@quiztransito.com', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'admin');

-- Criar usuário de aplicação com permissões específicas
CREATE USER IF NOT EXISTS 'app_quiz'@'localhost' IDENTIFIED BY 'Quiz@Transito2024';
GRANT SELECT, INSERT, UPDATE, DELETE ON quiz_transito.perguntas TO 'app_quiz'@'localhost';
GRANT SELECT, INSERT ON quiz_transito.estatisticas_quiz TO 'app_quiz'@'localhost';
GRANT SELECT ON quiz_transito.vw_estatisticas_gerais TO 'app_quiz'@'localhost';

FLUSH PRIVILEGES;

-- Consultas úteis para o sistema

-- 1. Buscar perguntas aleatórias para o quiz
SELECT * FROM perguntas ORDER BY RAND() LIMIT 10;

-- 2. Estatísticas por categoria
SELECT 
    categoria,
    COUNT(*) as quantidade,
    GROUP_CONCAT(LEFT(pergunta, 50)) as exemplos
FROM perguntas
GROUP BY categoria;

-- 3. Verificar duplicatas (mesma pergunta)
SELECT pergunta, COUNT(*) as duplicatas
FROM perguntas
GROUP BY pergunta
HAVING COUNT(*) > 1;

-- 4. Buscar perguntas com suas respostas formatadas
SELECT 
    id,
    pergunta,
    CONCAT('A) ', opcao_a) as opcao_a,
    CONCAT('B) ', opcao_b) as opcao_b,
    CONCAT('C) ', opcao_c) as opcao_c,
    CONCAT('D) ', opcao_d) as opcao_d,
    CONCAT('Resposta Correta: ', resposta_correta) as gabarito,
    explicacao
FROM perguntas
WHERE categoria = 'placas';

-- Adicionar tabela de informações se não existir
CREATE TABLE IF NOT EXISTS informacoes (
    id INT AUTO_INCREMENT PRIMARY KEY,
    titulo VARCHAR(255) NOT NULL,
    conteudo TEXT NOT NULL,
    categoria ENUM('processo', 'regras', 'categorias', 'custos', 'dicas') NOT NULL,
    ordem INT DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);
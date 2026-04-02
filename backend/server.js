const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const session = require('express-session');
const db = require('./database/db');

const app = express();
const PORT = 3001;
const JWT_SECRET = 'quiz-transito-secret-key-2024';

// Configuração de sessão
app.use(session({
    secret: 'quiz-transito-session-secret',
    resave: false,
    saveUninitialized: false,
    cookie: { secure: false, maxAge: 24 * 60 * 60 * 1000 }
}));

app.use(cors({
    origin: 'http://localhost:3000',
    credentials: true
}));
app.use(bodyParser.json());
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Criar pasta de uploads se não existir
const uploadDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir);
}

// Configuração do multer para upload de imagens
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, uploadDir);
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, 'placa-' + uniqueSuffix + path.extname(file.originalname));
    }
});

const upload = multer({ 
    storage: storage,
    limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
    fileFilter: (req, file, cb) => {
        const allowedTypes = /jpeg|jpg|png|gif/;
        const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
        const mimetype = allowedTypes.test(file.mimetype);
        
        if (mimetype && extname) {
            return cb(null, true);
        } else {
            cb(new Error('Apenas imagens são permitidas!'));
        }
    }
});

// ========== AUTENTICAÇÃO ==========

// Middleware de autenticação
const authenticateToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
    
    if (!token) {
        return res.status(401).json({ error: 'Acesso não autorizado' });
    }
    
    jwt.verify(token, JWT_SECRET, (err, user) => {
        if (err) {
            return res.status(403).json({ error: 'Token inválido' });
        }
        req.user = user;
        next();
    });
};

// Rota de login
app.post('/api/login', async (req, res) => {
    const { email, senha } = req.body;
    
    try {
        const [users] = await db.query('SELECT * FROM usuarios WHERE email = ?', [email]);
        
        if (users.length === 0) {
            return res.status(401).json({ error: 'Usuário não encontrado' });
        }
        
        const user = users[0];
        
        // Verificar senha (para admin padrão, senha é 'admin123')
        if (senha === 'admin123') {
            const token = jwt.sign({ id: user.id, email: user.email, tipo: user.tipo }, JWT_SECRET);
            req.session.userId = user.id;
            return res.json({ 
                token, 
                user: { id: user.id, nome: user.nome, email: user.email, tipo: user.tipo } 
            });
        }
        
        return res.status(401).json({ error: 'Senha incorreta' });
    } catch (err) {
        console.error('Erro no login:', err);
        res.status(500).json({ error: err.message });
    }
});

// Rota de logout
app.post('/api/logout', (req, res) => {
    req.session.destroy();
    res.json({ message: 'Logout realizado com sucesso' });
});

// Rota para verificar autenticação
app.get('/api/check-auth', authenticateToken, (req, res) => {
    res.json({ authenticated: true, user: req.user });
});

// ========== CRUD DE PERGUNTAS (com imagem) ==========

// Buscar todas as perguntas
app.get('/api/perguntas', async (req, res) => {
    try {
        const [rows] = await db.query('SELECT * FROM perguntas ORDER BY id DESC');
        // Adicionar URL completa da imagem
        const perguntas = rows.map(p => ({
            ...p,
            imagem_url: p.imagem ? `http://localhost:${PORT}/uploads/${p.imagem}` : null
        }));
        res.json(perguntas);
    } catch (err) {
        console.error('Erro ao buscar perguntas:', err);
        res.status(500).json({ error: err.message });
    }
});

// Adicionar pergunta com imagem
app.post('/api/perguntas', authenticateToken, upload.single('imagem'), async (req, res) => {
    const { pergunta, opcao_a, opcao_b, opcao_c, opcao_d, resposta_correta, explicacao, categoria } = req.body;
    const imagem = req.file ? req.file.filename : null;
    
    try {
        const [result] = await db.query(
            'INSERT INTO perguntas (pergunta, opcao_a, opcao_b, opcao_c, opcao_d, resposta_correta, explicacao, categoria, imagem) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)',
            [pergunta, opcao_a, opcao_b, opcao_c, opcao_d, resposta_correta, explicacao, categoria || 'placas', imagem]
        );
        res.json({ 
            id: result.insertId, 
            message: 'Pergunta adicionada com sucesso!',
            imagem_url: imagem ? `http://localhost:${PORT}/uploads/${imagem}` : null
        });
    } catch (err) {
        console.error('Erro ao adicionar pergunta:', err);
        res.status(500).json({ error: err.message });
    }
});

// Atualizar pergunta com imagem
app.put('/api/perguntas/:id', authenticateToken, upload.single('imagem'), async (req, res) => {
    const { id } = req.params;
    const { pergunta, opcao_a, opcao_b, opcao_c, opcao_d, resposta_correta, explicacao, categoria } = req.body;
    
    try {
        // Buscar imagem atual
        const [perguntaAtual] = await db.query('SELECT imagem FROM perguntas WHERE id = ?', [id]);
        
        let imagem = perguntaAtual[0]?.imagem;
        
        // Se enviou nova imagem, deletar a antiga
        if (req.file) {
            if (imagem) {
                const oldImagePath = path.join(uploadDir, imagem);
                if (fs.existsSync(oldImagePath)) {
                    fs.unlinkSync(oldImagePath);
                }
            }
            imagem = req.file.filename;
        }
        
        await db.query(
            'UPDATE perguntas SET pergunta = ?, opcao_a = ?, opcao_b = ?, opcao_c = ?, opcao_d = ?, resposta_correta = ?, explicacao = ?, categoria = ?, imagem = ? WHERE id = ?',
            [pergunta, opcao_a, opcao_b, opcao_c, opcao_d, resposta_correta, explicacao, categoria, imagem, id]
        );
        res.json({ 
            message: 'Pergunta atualizada com sucesso!',
            imagem_url: imagem ? `http://localhost:${PORT}/uploads/${imagem}` : null
        });
    } catch (err) {
        console.error('Erro ao atualizar pergunta:', err);
        res.status(500).json({ error: err.message });
    }
});

// Deletar pergunta
app.delete('/api/perguntas/:id', authenticateToken, async (req, res) => {
    const { id } = req.params;
    
    try {
        // Buscar imagem antes de deletar
        const [pergunta] = await db.query('SELECT imagem FROM perguntas WHERE id = ?', [id]);
        
        if (pergunta[0]?.imagem) {
            const imagePath = path.join(uploadDir, pergunta[0].imagem);
            if (fs.existsSync(imagePath)) {
                fs.unlinkSync(imagePath);
            }
        }
        
        await db.query('DELETE FROM perguntas WHERE id = ?', [id]);
        res.json({ message: 'Pergunta deletada com sucesso!' });
    } catch (err) {
        console.error('Erro ao deletar pergunta:', err);
        res.status(500).json({ error: err.message });
    }
});

// ========== CRUD DE INFORMAÇÕES (Conteúdo da página Info) ==========

// Criar tabela de informações se não existir
(async () => {
    try {
        await db.query(`
            CREATE TABLE IF NOT EXISTS informacoes (
                id INT AUTO_INCREMENT PRIMARY KEY,
                titulo VARCHAR(255) NOT NULL,
                conteudo TEXT NOT NULL,
                categoria ENUM('processo', 'regras', 'categorias', 'custos', 'dicas') NOT NULL,
                ordem INT DEFAULT 0,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
            )
        `);
        console.log('✅ Tabela de informações criada/verificada');
    } catch (err) {
        console.error('Erro ao criar tabela de informações:', err);
    }
})();

// Buscar todas as informações (ordenado com regras de negócio)
app.get('/api/informacoes', async (req, res) => {
    try {
        const [rows] = await db.query(`
            SELECT * FROM informacoes 
            ORDER BY 
                CASE categoria 
                    WHEN 'processo' THEN 1
                    WHEN 'regras' THEN 2
                    WHEN 'categorias' THEN 3
                    WHEN 'custos' THEN 4
                    WHEN 'dicas' THEN 5
                    ELSE 99
                END,
                ordem
        `);
        res.json(rows);
    } catch (err) {
        console.error('Erro ao buscar informações:', err);
        res.status(500).json({ error: err.message });
    }
});

// Buscar informações por categoria
app.get('/api/informacoes/categoria/:categoria', async (req, res) => {
    const { categoria } = req.params;
    try {
        const [rows] = await db.query('SELECT * FROM informacoes WHERE categoria = ? ORDER BY ordem', [categoria]);
        res.json(rows);
    } catch (err) {
        console.error('Erro ao buscar informações por categoria:', err);
        res.status(500).json({ error: err.message });
    }
});

// Adicionar informação (admin)
app.post('/api/informacoes', authenticateToken, async (req, res) => {
    const { titulo, conteudo, categoria, ordem } = req.body;
    
    try {
        const [result] = await db.query(
            'INSERT INTO informacoes (titulo, conteudo, categoria, ordem) VALUES (?, ?, ?, ?)',
            [titulo, conteudo, categoria, ordem || 0]
        );
        res.json({ id: result.insertId, message: 'Informação adicionada com sucesso!' });
    } catch (err) {
        console.error('Erro ao adicionar informação:', err);
        res.status(500).json({ error: err.message });
    }
});

// Atualizar informação
app.put('/api/informacoes/:id', authenticateToken, async (req, res) => {
    const { id } = req.params;
    const { titulo, conteudo, categoria, ordem } = req.body;
    
    try {
        await db.query(
            'UPDATE informacoes SET titulo = ?, conteudo = ?, categoria = ?, ordem = ? WHERE id = ?',
            [titulo, conteudo, categoria, ordem, id]
        );
        res.json({ message: 'Informação atualizada com sucesso!' });
    } catch (err) {
        console.error('Erro ao atualizar informação:', err);
        res.status(500).json({ error: err.message });
    }
});

// Deletar informação
app.delete('/api/informacoes/:id', authenticateToken, async (req, res) => {
    const { id } = req.params;
    
    try {
        await db.query('DELETE FROM informacoes WHERE id = ?', [id]);
        res.json({ message: 'Informação deletada com sucesso!' });
    } catch (err) {
        console.error('Erro ao deletar informação:', err);
        res.status(500).json({ error: err.message });
    }
});

// Inserir dados iniciais de informações
(async () => {
    try {
        const [count] = await db.query('SELECT COUNT(*) as total FROM informacoes');
        if (count[0].total === 0) {
            const informacoesIniciais = [
                ['📋 Processo para Primeira Habilitação (PPD)', 
                 '**Etapas do processo:**\n\n1. **Requisitos básicos:** Ter 18 anos, saber ler e escrever, possuir CPF e RG\n2. **Cadastro no RENACH:** Realizar cadastro no sistema nacional\n3. **Exame médico e psicológico:** Avaliação em clínica credenciada\n4. **Curso teórico-técnico:** 45 horas/aula obrigatórias\n5. **Prova teórica:** 30 questões, necessidade de 21 acertos\n6. **Aulas práticas:** 20 horas/aula (mínimo)\n7. **Exame prático de direção:** Avaliação em via pública',
                 'processo', 1],
                 
                ['🚗 Novas Regras 2024',
                 '**Principais mudanças:**\n\n- **Validade da CNH:** Aumento para 10 anos para condutores com menos de 50 anos\n- **Pontuação:** 40 pontos para quem não tem infrações gravíssimas\n- **Curso de reciclagem:** Obrigatório para quem atingir os limites de pontos\n- **Exame toxicológico:** Obrigatório para categorias C, D e E\n- **CNH Digital:** Versão digital com mesmo valor legal',
                 'regras', 2],
                 
                ['🚦 Categorias de CNH',
                 '**Categoria A** - Motos, motonetas e ciclomotores\n\n**Categoria B** - Carros de passeio (até 3.500 kg)\n\n**Categoria C** - Veículos de carga acima de 3.500 kg\n\n**Categoria D** - Ônibus e vans de passageiros\n\n**Categoria E** - Veículos com reboque acima de 6.000 kg\n\n**ACC** - Autorização para ciclomotores',
                 'categorias', 3],
                 
                ['💰 Custos Estimados',
                 '| Serviço | Valor |\n|---------|-------|\n| Exame médico | R$ 150,00 |\n| Exame psicológico | R$ 150,00 |\n| Curso teórico | R$ 800 - 1.200 |\n| Aulas práticas (20h) | R$ 1.500 - 2.000 |\n| Taxas do Detran | R$ 400 - 600 |\n| **Total** | **R$ 3.000 - 4.000** |\n\n*Valores aproximados, variam conforme estado*',
                 'custos', 4],
                 
                ['📚 Dicas para a Prova',
                 '- Estude com antecedência\n- Use simulados online\n- Conheça bem o CTB\n- Memorize todas as placas\n- Pratique direção defensiva\n- Estude primeiros socorros\n\n**Aprovação:** Mínimo 21 acertos em 30 questões',
                 'dicas', 5]
            ];
            
            for (const info of informacoesIniciais) {
                await db.query(
                    'INSERT INTO informacoes (titulo, conteudo, categoria, ordem) VALUES (?, ?, ?, ?)',
                    info
                );
            }
            console.log('✅ Informações iniciais inseridas');
        }
    } catch (err) {
        console.error('Erro ao inserir informações iniciais:', err);
    }
})();

// Rota de teste
app.get('/api/test', async (req, res) => {
    try {
        const [rows] = await db.query('SELECT 1 as conexao');
        res.json({ message: 'Conexão com MySQL funcionando!', data: rows });
    } catch (err) {
        console.error('Erro na conexão:', err);
        res.status(500).json({ error: 'Erro na conexão com o banco de dados' });
    }
});

app.listen(PORT, () => {
    console.log(`🚀 Servidor rodando na porta ${PORT}`);
    console.log(`📁 Uploads salvos em: ${uploadDir}`);
    console.log(`🔗 Teste a conexão: http://localhost:${PORT}/api/test`);
});
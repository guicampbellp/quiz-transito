# Quiz Trânsito - Instruções de Acesso

## Status do Projeto ✓

- ✅ **Framework Web**: React (Frontend) + Node.js/Express (Backend)
- ✅ **Controle de Versão**: Git/GitHub
- ✅ **Banco de Dados**: MySQL
- ✅ **Design**: Melhorado e profissional
- ✅ **Apresentação**: PowerPoint criado

## Acessando a Aplicação

### 1. Frontend (React)
- **URL**: http://localhost:3000
- Abra este link no navegador para acessar a aplicação

### 2. Backend (API)
- **URL**: http://localhost:3001
- **Teste de Conexão**: http://localhost:3001/api/test

### 3. Admin (Painel Administrativo)
- **Acesso**: http://localhost:3000/login
- **Email**: admin@quiztransito.com
- **Senha**: admin123

## Funcionalidades Disponíveis

### Para Usuários
- **Quiz Interativo**: Simulados com 5, 10, 15 ou 20 questões
- **Material de Estudo**: Informações sobre habilitação, novas regras, custos, etc.
- **Histórico de Resultados**: Acompanhe seu desempenho nos quizzes

### Para Administradores
- **Gestão de Perguntas**: Adicionar, editar e deletar questões
- **Upload de Imagens**: Adicione imagens de placas às questões
- **Gestão de Informações**: Controle o material de estudo
- **Categorias**: Organize por tema (placas, legislação, direção defensiva)

## Estrutura do Projeto

```
quiz-transito/
├── backend/
│   ├── server.js              # Servidor Node.js
│   ├── database/
│   │   └── db.js              # Configuração MySQL
│   ├── uploads/               # Imagens das placas
│   └── package.json
├── frontend/
│   ├── src/
│   │   ├── components/        # Componentes React
│   │   ├── styles/            # CSS
│   │   └── App.js
│   └── package.json
├── banco_de_Dados.sql         # Schema do banco
├── apresentacao_quiz_transito.pptx  # Apresentação
└── INSTRUCOES_ACESSO.md       # Este arquivo
```

## Credenciais Padrão

### Admin
- Email: `admin@quiztransito.com`
- Senha: `admin123`

## Banco de Dados

- **Host**: localhost
- **Usuário**: root
- **Senha**: 462263
- **Banco**: quiz_transito

## Tecnologias Utilizadas

- **Frontend**: React 18 + Bootstrap 5 + Axios
- **Backend**: Node.js + Express.js
- **Banco**: MySQL 8+
- **Autenticação**: JWT
- **Upload**: Multer

## Novas Regras de Trânsito 2024

A aplicação inclui informações sobre:
- Validade da CNH ampliada para 10 anos
- Novo sistema de pontos (40 pontos limite)
- Exame toxicológico obrigatório
- CNH Digital com valor legal
- Atualizações nas infrações e penalidades

## Integrantes do Projeto

1. Roberto Gustavo Reiniger Neto - RA: 24209569
2. Paulo Heredia Padin Junior - RA: 24202269
3. Humberto Assis Andrade Paixão - RA: 2229630
4. Belchior Rodrigues Cavalcante - RA: 2231611
5. Shirley Christina Ramos dos Santos - RA: 2213441
6. Guilherme Campbell Penna - RA: 24216190
7. Arthur Ferreira de Castro - RA: 24228235

## Próximos Passos

1. Abra http://localhost:3000 no navegador
2. Explore o Quiz e o Material de Estudo
3. Faça login com as credenciais padrão para acessar o Admin
4. Adicione mais perguntas e informações conforme necessário

---

**Gerado**: 07 de Maio de 2026
**Versão**: 1.0.0

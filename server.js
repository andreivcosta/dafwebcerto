const { verifyToken } = require('./authMiddware');
const express = require('express');
const cors = require('cors'); 
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { Pool } = require('pg'); 
const { PrismaClient } = require('@prisma/client');
const { PrismaPg } = require('@prisma/adapter-pg');

const app = express();

// 1. Configuração do Driver de Conexão do Prisma 7
const connectionString = 'postgresql://postgres:1691@localhost:5432/projeto_dafweb?schema=public';
const pool = new Pool({ connectionString });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

// Middlewares
app.use(cors()); 
app.use(express.json()); 

// Chave secreta para o Token JWT
const JWT_SECRET = 'CHAVE_SUPER_SECRETA_DO_TRABALHO'; 

// =========================================================================
// ROTA DE CADASTRO (Sign Up) - COM PRISMA 7
// =========================================================================
app.post('/cadastro', async (req, res) => {
    const { nome, email, senha } = req.body;

    if (!nome || !email || !senha) {
        return res.status(400).json({ erro: 'Por favor, preencha todos os campos.' });
    }

    try {
        const salt = await bcrypt.genSalt(10);
        const senhaHash = await bcrypt.hash(senha, salt);

        // Criação do registro no banco com Prisma
        const novoUsuario = await prisma.usuarios.create({
            data: {
                nome: nome,
                email: email,
                senha_hash: senhaHash
            }
        });

        return res.status(201).json({
            mensagem: 'Usuário cadastrado com sucesso!',
            usuario: { 
                id: novoUsuario.id, 
                nome: novoUsuario.nome, 
                email: novoUsuario.email 
            }
        });

    } catch (error) {
        // P2002: Código do Prisma para e-mail já existente (Unique)
        if (error.code === 'P2002') {
            return res.status(400).json({ erro: 'Este e-mail já está em uso.' });
        }
        console.error(error);
        return res.status(500).json({ erro: 'Erro interno no servidor.' });
    }
});

// =========================================================================
// ROTA DE LOGIN (Sign In) - COM PRISMA 7
// =========================================================================
app.post('/login', async (req, res) => {
    const { email, senha } = req.body;

    if (!email || !senha) {
        return res.status(400).json({ erro: 'Preencha e-mail e senha.' });
    }

    try {
        // Busca utilizador por e-mail único com Prisma
        const usuario = await prisma.usuarios.findUnique({
            where: { email: email }
        });

        if (!usuario) {
            return res.status(401).json({ erro: 'E-mail ou senha incorretos.' });
        }

        const senhaValida = await bcrypt.compare(senha, usuario.senha_hash);
        if (!senhaValida) {
            return res.status(401).json({ erro: 'E-mail ou senha incorretos.' });
        }

        // Geração do token JWT válido por 8 horas
        const token = jwt.sign(
            { id: usuario.id }, 
            JWT_SECRET, 
            { expiresIn: '8h' }
        );

        return res.json({
            mensagem: 'Login efetuado com sucesso!',
            token
        });

    } catch (error) {
        console.error(error);
        return res.status(500).json({ erro: 'Erro interno no servidor.' });
    }
});

app.get('/perfil', verifyToken, (req, res) => {
    res.json({
        mensagem: 'Rota protegida!',
        usuario: req.user
    });
});

// Inicialização do Servidor
app.listen(3000, () => {
    console.log('Servidor rodando com Prisma 7 na porta 3000! 🚀');
});
const express = require('express');
const cors = require('cors'); 
const { Pool } = require('pg');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const app = express();

// Ativa o CORS e a leitura de JSON de forma limpa e única
app.use(cors()); 
app.use(express.json()); 

// =========================================================================
// CONEXÃO COM O BANCO DE DADOS
// =========================================================================
const pool = new Pool({
    user: 'postgres',          
    host: 'localhost',
    database: 'projeto_dafweb',      
    password: '1691',  
    port: 5432,
    ssl: false 
});

const JWT_SECRET = 'CHAVE_SUPER_SECRETA_DO_TRABALHO'; 

// =========================================================================
// 2. ROTA DE CADASTRO DO USUÁRIO (Sign Up)
// =========================================================================
app.post('/cadastro', async (req, res) => {
    const { nome, email, senha } = req.body;

    if (!nome || !email || !senha) {
        return res.status(400).json({ erro: 'Por favor, preencha todos os campos.' });
    }

    try {
        const salt = await bcrypt.genSalt(10);
        const senhaHash = await bcrypt.hash(senha, salt);

        const query = 'INSERT INTO usuarios (nome, email, senha_hash) VALUES ($1, $2, $3) RETURNING id, nome, email';
        const resultado = await pool.query(query, [nome, email, senhaHash]);

        return res.status(201).json({
            mensagem: 'Usuário cadastrado com sucesso!',
            usuario: resultado.rows[0]
        });

    } catch (error) {
        if (error.code === '23505') {
            return res.status(400).json({ erro: 'Este e-mail já está em uso.' });
        }
        console.error(error);
        return res.status(500).json({ erro: 'Erro interno no servidor.' });
    }
});

// =========================================================================
// 3. ROTA DE LOGIN (Sign In)
// =========================================================================
app.post('/login', async (req, res) => {
    const { email, senha } = req.body;

    if (!email || !senha) {
        return res.status(400).json({ erro: 'Preencha e-mail e senha.' });
    }

    try {
        const query = 'SELECT * FROM usuarios WHERE email = $1';
        const resultado = await pool.query(query, [email]);
        const usuario = resultado.rows[0];

        if (!usuario) {
            return res.status(401).json({ erro: 'E-mail ou senha incorretos.' });
        }

        const senhaValida = await bcrypt.compare(senha, usuario.senha_hash);
        if (!senhaValida) {
            return res.status(401).json({ erro: 'E-mail ou senha incorretos.' });
        }

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

// Inicializa o servidor na porta 3000
app.listen(3000, () => {
    console.log('Servidor back-end rodando na porta 3000! 🚀');
});
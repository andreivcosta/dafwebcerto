const jwt = require("jsonwebtoken");

function verifyToken(req, res, next) {
    const authHeader = req.headers.authorization;
    const token = authHeader && authHeader.split(" ")[1];

    if (!token) {
        return res.status(401).json({
            erro: "Token não fornecido"
        });
    }

    try {
        const decoded = jwt.verify(
            token,
            'CHAVE_SUPER_SECRETA_DO_TRABALHO'
        );

        req.user = decoded;

        next();
    } catch {
        return res.status(403).json({
            erro: "Token inválido"
        });
    }
}

module.exports = { verifyToken };
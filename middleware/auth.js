// backend/middleware/auth.js
const jwt = require('jsonwebtoken');
require('dotenv').config();

const verificarToken = (req, res, next) => {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    if (!token) return res.status(401).json({ error: 'Acceso denegado. Token requerido.' });

    try {
        const verified = jwt.verify(token, process.env.JWT_SECRET);
        req.usuario = verified;  // { id, rol, email, ... }
        next();
    } catch (error) {
        res.status(400).json({ error: 'Token inválido.' });
    }
};

const verificarDocente = (req, res, next) => {
    if (req.usuario.rol !== 'docente') {
        return res.status(403).json({ error: 'Acción permitida solo para docentes.' });
    }
    next();
};

module.exports = { verificarToken, verificarDocente };
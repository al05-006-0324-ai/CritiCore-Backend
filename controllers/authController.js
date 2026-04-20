// backend/controllers/authController.js
const pool = require('../db');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { validationResult } = require('express-validator');

const registro = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

    const { nombre, email, password, rol, matricula } = req.body;

    try {
        // Verificar si el usuario ya existe
        const userExists = await pool.query('SELECT * FROM usuarios WHERE email = $1', [email]);
        if (userExists.rows.length > 0) return res.status(400).json({ error: 'El email ya está registrado.' });

        // Hashear contraseña
        const salt = await bcrypt.genSalt(10);
        const password_hash = await bcrypt.hash(password, salt);

        // Insertar nuevo usuario
        const newUser = await pool.query(
            'INSERT INTO usuarios (nombre, email, password_hash, rol, matricula) VALUES ($1, $2, $3, $4, $5) RETURNING id, nombre, email, rol, matricula, xp',
            [nombre, email, password_hash, rol, matricula || null]
        );

        // Crear token JWT
        const token = jwt.sign(
            { id: newUser.rows[0].id, email: newUser.rows[0].email, rol: newUser.rows[0].rol },
            process.env.JWT_SECRET,
            { expiresIn: '7d' }
        );

        res.json({ token, usuario: newUser.rows[0] });
    } catch (error) {
        console.error('Error en registro', error);
        res.status(500).json({ error: 'Error del servidor.' });
    }
};

const login = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

    const { email, password } = req.body;

    try {
        const user = await pool.query('SELECT * FROM usuarios WHERE email = $1', [email]);
        if (user.rows.length === 0) return res.status(400).json({ error: 'Credenciales inválidas.' });

        const validPassword = await bcrypt.compare(password, user.rows[0].password_hash);
        if (!validPassword) return res.status(400).json({ error: 'Credenciales inválidas.' });

        const token = jwt.sign(
            { id: user.rows[0].id, email: user.rows[0].email, rol: user.rows[0].rol },
            process.env.JWT_SECRET,
            { expiresIn: '7d' }
        );

        // No enviar password_hash
        const { password_hash, ...usuario } = user.rows[0];
        res.json({ token, usuario });
    } catch (error) {
        console.error('Error en login', error);
        res.status(500).json({ error: 'Error del servidor.' });
    }
};

module.exports = { registro, login };
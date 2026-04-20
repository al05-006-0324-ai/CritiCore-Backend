// backend/controllers/respuestasController.js
const pool = require('../db');
const { validationResult } = require('express-validator'); // ← Importante

const guardarRespuesta = async (req, res) => {
    // 1. Validar errores de express-validator (longitud mínima, etc.)
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errores: errors.array() });
    }

    const { reto_id, justificacion, es_correcta } = req.body;
    const usuario_id = req.usuario.id;

    try {
        await pool.query(
            'INSERT INTO respuestas (usuario_id, reto_id, justificacion, es_correcta) VALUES ($1, $2, $3, $4)',
            [usuario_id, reto_id, justificacion, es_correcta]
        );

        
        // Si es correcta, aumentar XP
        if (es_correcta) {
            await pool.query('UPDATE usuarios SET xp = xp + 150 WHERE id = $1', [usuario_id]);
        }

        res.json({ mensaje: 'Respuesta guardada.' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error al guardar respuesta.' });
    }
};

module.exports = { guardarRespuesta };
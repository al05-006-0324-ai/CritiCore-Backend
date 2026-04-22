// backend/controllers/respuestasController.js
const pool = require('../db');
const { validationResult } = require('express-validator'); // ← Importante

const guardarRespuesta = async (req, res) => {
    const { reto_id, justificacion, es_correcta } = req.body;
    const usuario_id = req.usuario.id;

    try {
        await pool.query(
            `INSERT INTO respuestas (usuario_id, reto_id, justificacion, es_correcta, estado)
            VALUES ($1, $2, $3, $4, 'pendiente')`,
            [usuario_id, reto_id, justificacion, es_correcta]
        );
        // No se suma XP aquí; lo hará el docente al revisar.
        res.json({ mensaje: 'Respuesta guardada. Pendiente de revisión por el docente.' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error al guardar respuesta.' });
    }
};


// 22-04-2026
const obtenerMisRespuestas = async (req, res) => {
    const usuario_id = req.usuario.id;
    try {
        const respuestas = await pool.query(`
            SELECT r.id, ret.titulo AS caso, r.justificacion, r.es_correcta, 
                   r.estado, r.feedback_docente, r.created_at
            FROM respuestas r
            JOIN retos ret ON ret.id = r.reto_id
            WHERE r.usuario_id = $1
            ORDER BY r.created_at DESC
        `, [usuario_id]);
        res.json(respuestas.rows);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error al obtener tus respuestas' });
    }
};


module.exports = { guardarRespuesta, obtenerMisRespuestas };
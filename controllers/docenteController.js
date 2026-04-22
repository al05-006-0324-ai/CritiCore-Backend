// backend/controllers/docenteController.js
const pool = require('../db');

const obtenerRespuestas = async (req, res) => {
    try {
        const respuestas = await pool.query(`
            SELECT re.id, u.nombre AS usuario, u.matricula, r.titulo AS caso, 
                   re.justificacion, re.es_correcta, re.estado, re.feedback_docente, re.created_at
            FROM respuestas re
            JOIN usuarios u ON u.id = re.usuario_id
            JOIN retos r ON r.id = re.reto_id
            ORDER BY re.created_at DESC
        `);
        res.json(respuestas.rows);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error al obtener respuestas.' });
    }
};

// 19-04-2026
const obtenerEstadisticas = async (req, res) => {
    try {
        // 1. Porcentaje de aciertos por categoría
        const aciertosPorCategoria = await pool.query(`
            SELECT c.nombre, 
                   COUNT(*) FILTER (WHERE re.es_correcta = true AND re.estado = 'aprobada') AS correctas,
                   COUNT(*) FILTER (WHERE re.estado = 'aprobada') AS total
            FROM respuestas re
            JOIN retos r ON r.id = re.reto_id
            JOIN categorias c ON c.id = r.categoria_id
            GROUP BY c.id
        `);

        // 2. XP de los alumnos
        const evolucionXP = await pool.query(`
            SELECT u.nombre, u.xp, u.created_at
            FROM usuarios u
            WHERE u.rol = 'estudiante'
            ORDER BY u.xp DESC
            LIMIT 10
        `);

        // 3. Promedio de longitud de justificación (solo respuestas aprobadas)
        const promedioJustificacion = await pool.query(`
            SELECT u.nombre, AVG(LENGTH(re.justificacion)) AS promedio
            FROM respuestas re
            JOIN usuarios u ON u.id = re.usuario_id
            WHERE re.estado = 'aprobada'
            GROUP BY u.id
            LIMIT 10
        `);

        // Enviar los tres conjuntos de datos en un solo objeto JSON
        res.json({
            aciertosPorCategoria: aciertosPorCategoria.rows,
            evolucionXP: evolucionXP.rows,
            promedioJustificacion: promedioJustificacion.rows
        });
    } catch (error) {
        console.error('Error en obtenerEstadisticas:', error);
        res.status(500).json({ error: 'Error al obtener estadísticas' });
    }
};


// 18-04-2026
// Eliminar una respuesta por su ID (solo docentes)
const eliminarRespuesta = async (req, res) => {
    const { id } = req.params;

    // Validar que el ID sea un número
    if (isNaN(id)) {
        return res.status(400).json({ error: 'ID inválido' });
    }

    try {
        const result = await pool.query('DELETE FROM respuestas WHERE id = $1 RETURNING id', [id]);
        if (result.rowCount === 0) {
            return res.status(404).json({ error: 'Respuesta no encontrada' });
        }
        res.json({ mensaje: 'Respuesta eliminada correctamente' });
    } catch (error) {
        console.error('Error al eliminar respuesta:', error);
        res.status(500).json({ error: 'Error del servidor al eliminar respuesta' });
    }
};


// 22/04/2026
const revisarRespuesta = async (req, res) => {
    const { id } = req.params;
    const { estado, feedback_docente, otorgar_xp } = req.body; // estado: 'aprobada' o 'rechazada'
    // solo docentes pueden llamar esto (ya verificado por middleware)

    try {
        // Obtener la respuesta y el usuario asociado
        const respuesta = await pool.query(
            'SELECT usuario_id, reto_id, es_correcta FROM respuestas WHERE id = $1',
            [id]
        );
        if (respuesta.rows.length === 0) {
            return res.status(404).json({ error: 'Respuesta no encontrada' });
        }

        // Actualizar estado y feedback
        await pool.query(
            'UPDATE respuestas SET estado = $1, feedback_docente = $2 WHERE id = $3',
            [estado, feedback_docente, id]
        );

        // Si se aprueba y se indica otorgar XP, sumar 150 XP al alumno
        if (estado === 'aprobada' && otorgar_xp) {
            const usuario_id = respuesta.rows[0].usuario_id;
            await pool.query('UPDATE usuarios SET xp = xp + 150 WHERE id = $1', [usuario_id]);
        }

        res.json({ mensaje: 'Respuesta revisada correctamente' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error al revisar respuesta.' });
    }
};


module.exports = { obtenerRespuestas, eliminarRespuesta, obtenerEstadisticas, revisarRespuesta };
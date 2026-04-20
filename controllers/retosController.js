// backend/controllers/retosController.js
const pool = require('../db');
//16-04-2026
const { validationResult } = require('express-validator');

const obtenerCategoriasConRetos = async (req, res) => {
    try {
        const categorias = await pool.query(`
            SELECT c.*, COALESCE(json_agg(r.*) FILTER (WHERE r.id IS NOT NULL), '[]') AS retos
            FROM categorias c
            LEFT JOIN retos r ON r.categoria_id = c.id AND r.activo = true
            GROUP BY c.id
        `);
        res.json(categorias.rows);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error al obtener categorías.' });
    }
};

const obtenerRetosPorCategoria = async (req, res) => {
    const { categoriaId } = req.params;
    try {
        const retos = await pool.query(
            'SELECT * FROM retos WHERE categoria_id = $1 AND activo = true',
            [categoriaId]
        );
        res.json(retos.rows);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error al obtener retos.' });
    }
};




//16-04-2026
// NUEVA FUNCIÓN: Agregar un reto (solo docente)
const agregarReto = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errores: errors.array() });
    }

    const { titulo, descripcion, es_falso, explicacion, categoria_id } = req.body;
    const creado_por = req.usuario.id; // ID del docente logueado

    try {
        const result = await pool.query(
            `INSERT INTO retos (titulo, descripcion, es_falso, explicacion, categoria_id, creado_por, activo)
             VALUES ($1, $2, $3, $4, $5, $6, true) RETURNING *`,
            [titulo, descripcion, es_falso, explicacion, categoria_id, creado_por]
        );
        res.status(201).json({ mensaje: 'Reto creado exitosamente', reto: result.rows[0] });
    } catch (error) {
        console.error('Error al crear reto:', error);
        res.status(500).json({ error: 'Error del servidor al crear reto.' });
    }
};

module.exports = { obtenerCategoriasConRetos, obtenerRetosPorCategoria, agregarReto };

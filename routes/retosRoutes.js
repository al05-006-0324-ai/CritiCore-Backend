// backend/routes/retosRoutes.js
const express = require('express');
const { body } = require('express-validator');
const { 
    obtenerCategoriasConRetos, 
    obtenerRetosPorCategoria,
    agregarReto, 
    obtenerProgresoAlumno
} = require('../controllers/retosController');
const { verificarToken, verificarDocente } = require('../middleware/auth');
const router = express.Router();

router.get('/categorias', verificarToken, obtenerCategoriasConRetos);
router.get('/categoria/:categoriaId', verificarToken, obtenerRetosPorCategoria);
// 22-04-2026
router.get('/progreso', verificarToken, obtenerProgresoAlumno);


// Nueva ruta: solo docentes pueden crear retos
router.post('/', [
    verificarToken,
    verificarDocente,
    body('titulo').notEmpty().withMessage('El título es obligatorio'),
    body('descripcion').notEmpty().withMessage('La descripción es obligatoria'),
    body('es_falso').isBoolean().withMessage('es_falso debe ser booleano'),
    body('explicacion').notEmpty().withMessage('La explicación es obligatoria'),
    body('categoria_id').isInt().withMessage('ID de categoría inválido')
], agregarReto);

module.exports = router;
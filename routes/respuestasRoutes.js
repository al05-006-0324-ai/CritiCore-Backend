// backend/routes/respuestasRoutes.js
const express = require('express');
const { body } = require('express-validator');
const { guardarRespuesta, obtenerMisRespuestas } = require('../controllers/respuestasController');
const { verificarToken } = require('../middleware/auth');
const router = express.Router();

router.post('/', [
    verificarToken,
    body('reto_id').isInt().withMessage('ID de reto inválido'),
    body('justificacion').isLength({ min: 60 }).withMessage('La justificación debe tener al menos 60 caracteres'),
    body('es_correcta').isBoolean().withMessage('es_correcta debe ser booleano')
], guardarRespuesta);

// 22-04-2026
router.get('/mis-respuestas', verificarToken, obtenerMisRespuestas);


module.exports = router;
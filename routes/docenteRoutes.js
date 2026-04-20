// backend/routes/docenteRoutes.js
const express = require('express');
const { obtenerRespuestas, eliminarRespuesta, obtenerEstadisticas } = require('../controllers/docenteController');
const { verificarToken, verificarDocente } = require('../middleware/auth');
const router = express.Router();

router.get('/respuestas', verificarToken, verificarDocente, obtenerRespuestas);
// 18-04-2026
router.delete('/respuestas/:id', verificarToken, verificarDocente, eliminarRespuesta);
// 19-04-2026
router.get('/estadisticas', verificarToken, verificarDocente, obtenerEstadisticas);

module.exports = router;
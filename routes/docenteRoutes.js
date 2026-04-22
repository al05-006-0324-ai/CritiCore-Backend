// backend/routes/docenteRoutes.js
const express = require('express');
const { obtenerRespuestas, eliminarRespuesta, obtenerEstadisticas, revisarRespuesta } = require('../controllers/docenteController');
const { verificarToken, verificarDocente } = require('../middleware/auth');
const router = express.Router();

router.get('/respuestas', verificarToken, verificarDocente, obtenerRespuestas);
// 18-04-2026
router.delete('/respuestas/:id', verificarToken, verificarDocente, eliminarRespuesta);
// 19-04-2026
router.get('/estadisticas', verificarToken, verificarDocente, obtenerEstadisticas);
// 22-04-2026
router.put('/respuestas/:id/revisar', verificarToken, verificarDocente, revisarRespuesta);


module.exports = router;
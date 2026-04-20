const express = require('express');
const { generarFeedback } = require('../controllers/geminiController');
const { verificarToken } = require('../middleware/auth');
const router = express.Router();

// Endpoint protegido: solo usuarios autenticados pueden pedir feedback IA
router.post('/feedback', verificarToken, generarFeedback);

module.exports = router;
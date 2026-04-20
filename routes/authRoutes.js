// backend/routes/authRoutes.js
const express = require('express');
const { body } = require('express-validator');
const { registro, login } = require('../controllers/authController');
const router = express.Router();

router.post('/registro', [
    body('nombre').notEmpty().withMessage('El nombre es obligatorio'),
    body('email').isEmail().withMessage('Email inválido'),
    body('password').isLength({ min: 6 }).withMessage('La contraseña debe tener al menos 6 caracteres'),
    body('rol').isIn(['estudiante', 'docente']).withMessage('Rol debe ser estudiante o docente'),
    body('matricula').optional().notEmpty()
], registro);

router.post('/login', [
    body('email').isEmail().withMessage('Email inválido'),
    body('password').notEmpty().withMessage('La contraseña es obligatoria')
], login);

module.exports = router;
// backend/server.js
const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
dotenv.config();

const authRoutes = require('./routes/authRoutes');
const retosRoutes = require('./routes/retosRoutes');
const respuestasRoutes = require('./routes/respuestasRoutes');
const docenteRoutes = require('./routes/docenteRoutes');
// 17-04-2026
const geminiRoutes = require('./routes/geminiRoutes');   // ← NUEVA LÍNEA

const app = express();

// Middlewares
app.use(cors());
app.use(express.json());

// Rutas
app.use('/api/auth', authRoutes);
app.use('/api/retos', retosRoutes);
app.use('/api/respuestas', respuestasRoutes);
app.use('/api/docente', docenteRoutes);
// 17-04-2026
app.use('/api/gemini', geminiRoutes);   // ← NUEVA LÍNEA

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Servidor corriendo en puerto ${PORT}`);
});

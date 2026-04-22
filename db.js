// backend/db.js
const { Pool } = require('pg');
require('dotenv').config();

// Configuración de conexión: prioriza DATABASE_URL (para producción en Railway/Neon)
// Si no existe, usa las variables individuales (para desarrollo local)
const poolConfig = process.env.DATABASE_URL ? {
    connectionString: process.env.DATABASE_URL,
    ssl: {
        rejectUnauthorized: false, // Necesario para Neon (base de datos en la nube)
    }
} : {
    user: process.env.DB_USER,
    host: process.env.DB_HOST,
    database: process.env.DB_NAME,
    password: process.env.DB_PASSWORD,
    port: process.env.DB_PORT,
};

const pool = new Pool(poolConfig);

module.exports = pool;
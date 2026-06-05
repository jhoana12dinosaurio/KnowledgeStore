const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
  host:     process.env.DB_HOST     || 'localhost',
  port:     parseInt(process.env.DB_PORT || '5432'),
  database: process.env.DB_NAME     || 'learnix_db',
  user:     process.env.DB_USER     || 'postgres',
  password: process.env.DB_PASSWORD || '',
  max: 20,                  // máximo de conexiones en el pool
  idleTimeoutMillis: 30000, // cierra conexiones inactivas después de 30s
  connectionTimeoutMillis: 2000,
});

pool.on('connect', () => {
  if (process.env.NODE_ENV !== 'test') {
    console.log('✅ Conectado a PostgreSQL');
  }
});

pool.on('error', (err) => {
  console.error('❌ Error inesperado en el pool de PostgreSQL:', err);
  process.exit(-1);
});

/**
 * Ejecuta una query con parámetros opcionales.
 * @param {string} text  - SQL query
 * @param {any[]}  params - Parámetros parametrizados
 */
const query = (text, params) => pool.query(text, params);

/**
 * Obtiene un cliente del pool para transacciones.
 */
const getClient = () => pool.connect();

module.exports = { query, getClient, pool };
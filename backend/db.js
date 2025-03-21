import pg from 'pg';
const { Pool } = pg;

export const pool = new Pool({
  user: process.env.PG_USER,
  host: process.env.PG_HOST,
  database: process.env.PG_DATABASE,
  password: process.env.PG_PASSWORD,
  port: process.env.PG_PORT || 5432,
  ssl: process.env.PG_SSL ? { rejectUnauthorized: false } : false,
});

pool
  .query('SELECT NOW()')
  .then(() => console.log('✅ Banco de dados conectado'))
  .catch((err) => console.error('❌ Erro na conexão com o BD:', err));

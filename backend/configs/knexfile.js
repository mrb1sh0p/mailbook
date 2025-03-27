import dotenv from 'dotenv';
import path from 'node:path';
import { fileURLToPath } from 'url';
import knex from 'knex';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.resolve(__dirname, '../.env') });

const dbConfig = {
  client: 'pg',
  connection: {
    host: process.env.PG_HOST,
    database: process.env.PG_DATABASE,
    user: process.env.PG_USER,
    password: process.env.PG_PASSWORD,
    port: process.env.PG_PORT,
  },
  migrations: {
    directory: path.resolve(__dirname, 'migrations'),
    loadExtensions: ['.js'],
  },
};

const db = knex(dbConfig);

(async () => {
  try {
    await db.raw('SELECT 1+1 AS result');
    console.log('Conexão bem-sucedida com o banco de dados.');
  } catch (error) {
    console.error('Erro ao conectar ao banco de dados:', error);
  } finally {
    await db.destroy();
  }
})();

export default dbConfig;

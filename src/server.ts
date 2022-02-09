import dotenv from 'dotenv';
import express from 'express';
import path from 'path';
import pg from 'pg';

dotenv.config({
  path: path.resolve(
    process.cwd(),
    `.env${process.env.NODE_ENV ? `.${process.env.NODE_ENV}` : ''}`,
  ),
});

const port = process.env.PORT ? Number(process.env.PORT) : 3000;
if (Number.isNaN(port)) {
  throw new Error('"PORT" must be an integer');
}

const dbHost = process.env.POSTGRES_HOST;
if (!dbHost) {
  throw new Error('"POSTGRES_HOST" is required');
}
const dbPort = process.env.POSTGRES_PORT
  ? Number(process.env.POSTGRES_PORT)
  : 5432;
if (Number.isNaN(dbPort)) {
  throw new Error('"POSTGRES_PORT" must be an integer');
}
const dbUser = process.env.POSTGRES_USER;
if (!dbUser) {
  throw new Error('"POSTGRES_USER" is required');
}
const dbPassword = process.env.POSTGRES_PASSWORD;
if (!dbPassword) {
  throw new Error('"POSTGRES_PASSWORD" is required');
}
const db = process.env.POSTGRES_DB;
if (!db) {
  throw new Error('"POSTGRES_DB" is required');
}

const app = express();

app.use(express.json());

(async () => {
  const client = new pg.Client({
    host: dbHost,
    port: dbPort,
    user: dbUser,
    password: dbPassword,
    database: db,
  });

  await client.connect();

  app.get('/hotspots', async (req, res) => {
    const hotspots = (await client.query('SELECT * from hotspots')).rows;

    return res.json(hotspots);
  });

  app.listen(port, () => {
    console.log(`http://localhost:${port}`);
  });
})();

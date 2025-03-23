import { Pool } from "pg";
import dotenv from "dotenv";
import colors from "colors";

dotenv.config();

const pool = new Pool({
  user: process.env.POSTGRES_USER,
  host: process.env.POSTGRES_HOST,
  database: process.env.POSTGRES_DB,
  password: process.env.POSTGRES_PASSWORD,
  port: Number(process.env.POSTGRES_PORT),
	ssl: true
});

pool.on('connect', () => {
  console.log(colors.green.bold('Database connection established successfully'));
});

pool.on('error', (err, client) => {
  console.log(colors.red.bold('Postgres connection error:'), err);
  process.exit(-1);
});

export default pool;
import pgPromise from 'pg-promise';
import dotenv from 'dotenv';

dotenv.config();

const pgp = pgPromise();
const connectionString = process.env.POSTGRESQL || '';
const db = pgp(connectionString);

export { db };

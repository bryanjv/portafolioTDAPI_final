import * as dotenv from 'dotenv';

dotenv.config(); //Variables de entorno 

export const HOST = process.env.HOST;
export const USER = process.env.USER;
export const DATABASE = process.env.DATABASE;
export const PGPASSWORD = process.env.PGPASSWORD;
export const PGPORT = process.env.PGPORT;
export const APIPORT = process.env.APIPORT;
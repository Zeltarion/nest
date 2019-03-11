import { join } from 'path';

const FILE_STORAGE_PATH = join(__dirname, `../../static`);

const {
  HOST,
  PORT,
  DB_HOST,
  DB_PORT,
  DB_USER,
  DB_PASSWORD,
  DB_NAME,
  JWT_SECRET,
  JWT_EXPIRES,
  FACCEBOOK_CLIENT_ID,
  FACCEBOOK_CLIENT_SECRET,
} = process.env;
import { ORM_CONFIG } from './orm.config';

export {
  HOST,
  PORT,
  ORM_CONFIG,
  DB_HOST,
  DB_PORT,
  DB_USER,
  DB_PASSWORD,
  DB_NAME,
  JWT_SECRET,
  JWT_EXPIRES,
  FACCEBOOK_CLIENT_ID,
  FACCEBOOK_CLIENT_SECRET,
};

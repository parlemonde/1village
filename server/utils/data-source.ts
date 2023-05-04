import path from 'path';
import type { DataSourceOptions } from 'typeorm';
import { DataSource } from 'typeorm';
import 'dotenv/config';

const DEFAULT_TYPE = 'mysql' as const;
const DEFAULT_HOST = 'localhost';
const DEFAULT_PORT = 3306;
export const DEFAULT_NAME = 'village';

function getAppDataSource(): DataSource {
  const type = process.env.DB_TYPE === 'mysql' || process.env.DB_TYPE === 'mariadb' ? process.env.DB_TYPE : DEFAULT_TYPE;
  let connectionOptions: DataSourceOptions;
  if (process.env.DATABASE_URL) {
    connectionOptions = {
      type,
      url: process.env.DATABASE_URL,
    };
  } else {
    connectionOptions = {
      type,
      host: process.env.DB_HOST || DEFAULT_HOST,
      port: Number(process.env.DB_PORT) || DEFAULT_PORT,
      username: process.env.DB_USER,
      password: process.env.DB_PASS,
      database: process.env.DB_NAME || DEFAULT_NAME,
      extra: process.env.DB_SSL
        ? {
          ssl: true,
        }
        : { ssl: false },
    };
  }

  return new DataSource({
    charset: 'utf8mb4_unicode_ci',
    logging: process.env.NODE_ENV !== 'production',
    entities: [path.join(__dirname, '../entities/*.js')],
    migrations: [path.join(__dirname, '../migrations/*.js')],
    subscribers: [],
    synchronize: false,
    ...connectionOptions,
  });
}

export const AppDataSource = getAppDataSource();

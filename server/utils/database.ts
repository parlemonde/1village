import * as argon2 from 'argon2';
import mysql from 'mysql2';
import path from 'path';
import type { Connection, ConnectionOptions } from 'typeorm';
import { createConnection, getRepository } from 'typeorm';

import { User, UserType } from '../entities/user';

import { sleep } from './index';
import { logger } from './logger';

const DEFAULT_TYPE = 'mysql' as const;
const DEFAULT_PORT = '3306';
const DEFAULT_NAME = 'village';

const getDBConfig = (): ConnectionOptions | null => {
  if (!process.env.DB_TYPE || (process.env.DB_TYPE !== 'mysql' && process.env.DB_TYPE !== 'mariadb')) {
    return null;
  }

  let connectionOptions: ConnectionOptions;
  if (process.env.DATABASE_URL) {
    connectionOptions = {
      type: (process.env.DB_TYPE || DEFAULT_TYPE) as 'mariadb' | 'mysql',
      url: process.env.DATABASE_URL,
    };
  } else {
    connectionOptions = {
      database: process.env.DB_NAME || DEFAULT_NAME,
      host: process.env.DB_HOST,
      password: process.env.DB_PASS,
      port: parseInt(process.env.DB_PORT || DEFAULT_PORT, 10),
      type: (process.env.DB_TYPE || DEFAULT_TYPE) as 'mariadb' | 'mysql',
      username: process.env.DB_USER,
      extra: process.env.DB_SSL
        ? {
            ssl: true,
          }
        : { ssl: false },
    };
  }

  return {
    charset: 'utf8mb4_unicode_ci',
    logging: process.env.NODE_ENV !== 'production',
    entities: [path.join(__dirname, '../entities/*.js')],
    subscribers: [],
    synchronize: true,
    ...connectionOptions,
  };
};

function query(q: string, connection: mysql.Connection): Promise<void> {
  return new Promise((resolve, reject) => {
    connection.query(q, (error: Error) => {
      if (error) {
        reject(error);
        return;
      }
      resolve();
    });
  });
}

async function createMySQLDB(): Promise<void> {
  try {
    const connection = mysql.createConnection({
      charset: 'utf8mb4_unicode_ci',
      host: process.env.DB_HOST,
      password: process.env.DB_PASS,
      user: process.env.DB_USER,
    });
    const dbName: string = process.env.DB_NAME || DEFAULT_NAME;
    await query(`CREATE DATABASE IF NOT EXISTS ${dbName} CHARACTER SET = 'utf8mb4' COLLATE = 'utf8mb4_unicode_ci';`, connection);
    logger.info(`Database ${dbName} created!`);
  } catch (e) {
    logger.error(e);
  }
}

async function createSuperAdminUser(): Promise<void> {
  if (!process.env.ADMIN_PSEUDO || !process.env.ADMIN_PASSWORD) {
    return;
  }
  const adminPseudo = process.env.ADMIN_PSEUDO;
  const adminPassword = process.env.ADMIN_PASSWORD;
  const count = await getRepository(User).count({ where: { pseudo: adminPseudo } });
  if (count > 0) {
    return;
  }
  const user = new User();
  user.email = 'admin.1village@parlemonde.org';
  user.pseudo = adminPseudo;
  user.level = '';
  user.school = 'Asso Par Le Monde';
  user.type = UserType.SUPER_ADMIN;
  user.passwordHash = await argon2.hash(adminPassword);
  user.accountRegistration = 0;
  user.countryCode = 'fr';
  user.positionLat = '0';
  user.positionLon = '0';
  await getRepository(User).save(user);
  logger.info('Super user Admin created!');
}

export async function connectToDatabase(tries: number = 10): Promise<Connection | null> {
  if (tries === 0) {
    return null;
  }
  try {
    const config = getDBConfig();
    if (config === null) {
      logger.error('Could not connect to database. Config file for database is not correct!');
      return null;
    }
    const connection = await createConnection(config);
    await createSuperAdminUser();
    return connection;
  } catch (e) {
    logger.error(e);
    logger.info('Could not connect to database. Retry in 10 seconds...');
    if (((e as Error) || '').toString().includes('Unknown database')) {
      await createMySQLDB();
    }
    await sleep(10000);
    return connectToDatabase(tries - 1);
  }
}

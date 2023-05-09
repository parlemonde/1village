import * as argon2 from 'argon2';
import mysql from 'mysql2';

import { User, UserType } from '../entities/user';
import { AppDataSource, DEFAULT_NAME } from './data-source';
import { sleep } from './index';
import { logger } from './logger';

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

async function createTablesIfNotExist(): Promise<void> {
  const query: Array<{ count: number }> = await AppDataSource.query(
    `SELECT COUNT(*) as count FROM INFORMATION_SCHEMA.tables WHERE TABLE_SCHEMA = ?`,
    [process.env.DB_NAME || DEFAULT_NAME],
  );
  // There could be the migrations table already
  if (query.length === 1 && query[0].count < 2) {
    await AppDataSource.synchronize();
  }
}

async function createSuperAdminUser(): Promise<void> {
  if (!process.env.ADMIN_PSEUDO || !process.env.ADMIN_PASSWORD) {
    return;
  }
  const adminPseudo = process.env.ADMIN_PSEUDO;
  const adminPassword = process.env.ADMIN_PASSWORD;
  const count = await AppDataSource.getRepository(User).count({ where: { pseudo: adminPseudo } });
  if (count > 0) {
    return;
  }
  const user = new User();
  user.email = 'admin.1village@parlemonde.org';
  user.pseudo = adminPseudo;
  user.firstname = '';
  user.lastname = '';
  user.level = '';
  user.school = 'Asso Par Le Monde';
  user.type = UserType.SUPER_ADMIN;
  user.passwordHash = await argon2.hash(adminPassword);
  user.accountRegistration = 0;
  user.countryCode = 'fr';
  user.positionLat = '0';
  user.positionLon = '0';
  await AppDataSource.getRepository(User).save(user);
  logger.info('Super user Admin created!');
}

export async function connectToDatabase(tries: number = 10): Promise<boolean> {
  if (tries === 0) {
    return false;
  }
  try {
    await AppDataSource.initialize();
    await createTablesIfNotExist();
    await createSuperAdminUser();
    return true;
  } catch (e) {
    if (((e as Error) || '').toString().includes('Unknown database')) {
      await createMySQLDB();
    } else {
      logger.error(e);
      logger.info('Could not connect to database. Retry in 10 seconds...');
      await sleep(10000);
    }
    return connectToDatabase(tries - 1);
  }
}

import type { MigrationInterface, QueryRunner } from 'typeorm';

import { countries } from '../utils/iso-3166-countries-french';

export class NewCountryTable1712732757287 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`CREATE TABLE IF NOT EXISTS country (
        id int PRIMARY KEY AUTO_INCREMENT,
        isoCode varchar(3) UNIQUE NOT NULL,
        name varchar(255) UNIQUE NOT NULL
      );`);
    // seed country in db
    for (const country of countries) {
      // try catch here to prevent if country is already set in db for some reason
      try {
        await queryRunner.query(`INSERT INTO country (isoCode, name) VALUES ("${country.isoCode}", "${country.name}");`);
      } catch (error) {
        console.error(error);
      }
    }
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE IF EXISTS country;`);
  }
}

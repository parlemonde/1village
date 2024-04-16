import type { MigrationInterface, QueryRunner } from 'typeorm';

import { Village } from '../entities/village';

export class VillageCountryRelation1713259022347 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    // await queryRunner.query(`CREATE TABLE IF NOT EXISTS village_country (
    //         village_id INT NOT NULL,
    //         country_id INT NOT NULL,
    //         PRIMARY KEY (village_id, country_id),
    //         FOREIGN KEY (village_id) REFERENCES village(id),
    //         FOREIGN KEY (country_id) REFERENCES country(id)
    //       );`);
    const allVillages: { id: number; countryCodes: string }[] = await queryRunner.query(`SELECT id, countryCodes FROM village;`);
    for (const village of allVillages) {
      const countryCodes = village.countryCodes
        .split(',')
        .map((cc) => `'${cc}'`)
        .join(',');
      console.log(countryCodes);
      const countryIds: { id: number }[] = await queryRunner.query(`SELECT id FROM country WHERE isoCode IN(${countryCodes})`);
      console.log(countryIds);
      //   for (const id of countryIds) {
      //     await queryRunner.query(`INSERT INTO village_country (village_id, country_id) VALUES ('${id}');`);
      //   }
    }
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // const villageCountry = await queryRunner.query(`SELECT * FROM village_country;`);
    // console.log(villageCountry);
    // await queryRunner.dropForeignKey('village', 'village_id');
    // await queryRunner.dropForeignKey('country', 'country_id');
    // await queryRunner.dropTable('village_country');
    // const allVillages: { id: number; countryCodes: string }[] = await queryRunner.query(`SELECT id, countryCodes FROM village;`);
  }
}

import type { MigrationInterface, QueryRunner } from 'typeorm';

export class VillageCountryRelation1713259022347 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`CREATE TABLE IF NOT EXISTS village_country (
            village_id INT NOT NULL,
            country_id INT NOT NULL,
            PRIMARY KEY (village_id, country_id),
            FOREIGN KEY (village_id) REFERENCES village(id),
            FOREIGN KEY (country_id) REFERENCES country(id)
          );`);
    const allVillages: { id: number; countryCodes: string }[] = await queryRunner.query(`SELECT id, countryCodes FROM village;`);

    for (const village of allVillages) {
      if (village.countryCodes) {
        const countryCodes = village.countryCodes
          .split(',')
          .map((cc) => `'${cc}'`)
          .join(',');
        const countryIds: { id: number }[] = await queryRunner.query(`SELECT id FROM country WHERE isoCode IN(${countryCodes})`);
        for (const countryId of countryIds) {
          await queryRunner.query(`INSERT INTO village_country (village_id, country_id) VALUES (${village.id}, ${countryId.id});`);
        }
      }
    }
    // drop countryCodes from village table
    await queryRunner.query(`ALTER TABLE village DROP COLUMN countryCodes;`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE village ADD COLUMN countryCodes TINYTEXT;`);
    const villageCountryRelation: { village_id: number; country_id: number }[] = await queryRunner.query(`SELECT * FROM village_country;`);
    // create countryCodes column
    const allVillages: { id: number }[] = await queryRunner.query(`SELECT id FROM village;`);
    for (const village of allVillages) {
      // build string query from country id
      const countryIds = villageCountryRelation
        .reduce<string>((acc, relation, i) => {
          if (relation.village_id === village.id) {
            acc += `${relation.country_id}, `;
          }
          return acc;
        }, '')
        .slice(0, -2);
      // get isoCodes from country table
      const countryIsoCodes: { isoCode: string }[] = await queryRunner.query(`SELECT isoCode FROM country WHERE id IN(${countryIds});`);
      // build original countryCodes and set them in village.countryCodes
      const countryCodes = countryIsoCodes
        .reduce((acc, countryIso) => {
          acc += `${countryIso.isoCode},`;
          return acc;
        }, '')
        .slice(0, -1);
      await queryRunner.query(`UPDATE village SET countryCodes = '${countryCodes}' WHERE id = ${village.id};`);
    }
    // drop key contraint and relation table
    await queryRunner.dropTable('village_country');
  }
}

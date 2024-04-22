import type { MigrationInterface, QueryRunner } from 'typeorm';

export class UserVillageCountryRelation1713446226165 implements MigrationInterface {
  name = 'UserVillageCountryRelation1713446226165';

  public async up(queryRunner: QueryRunner): Promise<void> {
    // village county relation
    await queryRunner.query(
      `CREATE TABLE village_countries_country (
            villageId int NOT NULL, 
            countryId int NOT NULL, 
            INDEX IDX_df9756b7b0058adb584d3a8c75 (villageId), 
            INDEX IDX_870cdc22399cffb6327c914b79 (countryId),
            CONSTRAINT FK_df9756b7b0058adb584d3a8c75e FOREIGN KEY (villageId) REFERENCES village(id) ON DELETE CASCADE ON UPDATE CASCADE,
            CONSTRAINT FK_870cdc22399cffb6327c914b790 FOREIGN KEY (countryId) REFERENCES country(id) ON DELETE CASCADE ON UPDATE CASCADE,
            PRIMARY KEY (villageId, countryId)) 
            ENGINE=InnoDB;`,
    );

    // save data stored
    const allVillages: { id: number; countryCodes: string }[] = await queryRunner.query(`SELECT id, countryCodes FROM village;`);
    for (const village of allVillages) {
      if (village.countryCodes) {
        const countryCodes = village.countryCodes
          .split(',')
          .map((cc) => `'${cc}'`)
          .join(',');
        const countryIds: { id: number }[] = await queryRunner.query(`SELECT id FROM country WHERE isoCode IN(${countryCodes})`);
        for (const countryId of countryIds) {
          await queryRunner.query(`INSERT INTO village_countries_country (villageId, countryId) VALUES (${village.id}, ${countryId.id});`);
        }
      }
    }
    // user country relation
    await queryRunner.query(`ALTER TABLE user
        ADD COLUMN countryId int,
        ADD CONSTRAINT FK_4aaf6d02199282eb8d3931bff31 FOREIGN KEY (countryId) REFERENCES country(id) ON DELETE NO ACTION ON UPDATE NO ACTION`);
    const usersCountry: { id: number; countryCode: string }[] = await queryRunner.query(`SELECT id, countryCode FROM user;`);
    // save data stored
    for (const userCountry of usersCountry) {
      const countryId: { id: number }[] = await queryRunner.query(`SELECT id FROM country WHERE isoCode='${userCountry.countryCode}';`);
      if (countryId.length) {
        await queryRunner.query(`UPDATE user SET countryId=${countryId[0].id} WHERE id=${userCountry.id};`);
      }
    }
    // // cleaning
    await queryRunner.query(`ALTER TABLE village DROP COLUMN countryCodes;`);
    await queryRunner.query(`ALTER TABLE user DROP COLUMN countryCode;`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // recreate village data
    await queryRunner.query(`ALTER TABLE village ADD COLUMN countryCodes TINYTEXT;`);
    const villageCountryRelation: { villageId: number; countryId: number }[] = await queryRunner.query(`SELECT * FROM village_countries_country;`);
    // create countryCodes column
    const allVillages: { id: number }[] = await queryRunner.query(`SELECT id FROM village;`);
    for (const village of allVillages) {
      // build string query from country id
      const countryIds = villageCountryRelation
        .reduce<string>((acc, relation) => {
          if (relation.villageId === village.id) {
            acc += `${relation.countryId}, `;
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

    // recreate user data
    const usersCountryId: { id: number; countryId: number }[] = await queryRunner.query(`SELECT id, countryId FROM user;`);
    await queryRunner.query(`ALTER TABLE user ADD COLUMN countryCode TINYTEXT;`);
    for (const userData of usersCountryId) {
      const isoCode: [{ isoCode: string }] = await queryRunner.query(`SELECT isoCode FROM country WHERE id=${userData.countryId}`);
      if (isoCode.length) {
        await queryRunner.query(`UPDATE user SET countryCode = '${isoCode[0].isoCode}' WHERE id = ${userData.id};`);
      }
    }
    // drop key contraint and relation table
    await queryRunner.query(`ALTER TABLE user DROP FOREIGN KEY FK_6f937fd92e219e3e5fa70aea9c7`);
    await queryRunner.query(`ALTER TABLE user DROP COLUMN countryId`);
    await queryRunner.query(`ALTER TABLE village_countries_country DROP FOREIGN KEY FK_870cdc22399cffb6327c914b790`);
    await queryRunner.dropTable('village_countries_country');
  }
}

import type { MigrationInterface, QueryRunner } from 'typeorm';

export class UserVillageCountryRelation1713446226165 implements MigrationInterface {
  name = 'UserVillageCountryRelation1713446226165';

  public async up(queryRunner: QueryRunner): Promise<void> {
    // VILLAGE county relation
    const villageCountriesCountryTable = await queryRunner.getTable('village_countries_country');
    if (!villageCountriesCountryTable) {
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
    }

    // save data stored
    const villageTable = await queryRunner.getTable('village');
    const villageCountryCodesColumn = villageTable?.columns.find((c) => c.name === 'countryCodes');
    if (villageCountryCodesColumn) {
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
      await queryRunner.query(`ALTER TABLE village DROP COLUMN countryCodes;`);
    }

    // USER country relation
    const userTable = await queryRunner.getTable('user');
    const userCountryId = userTable?.columns.find((c) => c.name === 'countryId');
    const userCountryConstraint = userTable?.foreignKeys.find((fk) => fk.name === 'FK_4aaf6d02199282eb8d3931bff31');
    if (!userCountryId && !userCountryConstraint) {
      await queryRunner.query(`ALTER TABLE user
          ADD COLUMN countryId int,
          ADD CONSTRAINT FK_4aaf6d02199282eb8d3931bff31 FOREIGN KEY (countryId) REFERENCES country(id) ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }
    const userCountryCode = userTable?.columns.find((c) => c.name === 'countryCode');
    if (userCountryCode) {
      const usersCountry: { id: number; countryCode: string }[] = await queryRunner.query(`SELECT id, countryCode FROM user;`);
      // save data stored
      for (const userCountry of usersCountry) {
        const countryId: { id: number }[] = await queryRunner.query(`SELECT id FROM country WHERE isoCode='${userCountry.countryCode}';`);
        if (countryId.length) {
          await queryRunner.query(`UPDATE user SET countryId=${countryId[0].id} WHERE id=${userCountry.id};`);
        }
      }
      await queryRunner.query(`ALTER TABLE user DROP COLUMN countryCode;`);
    }

    // CLASSROOM relation
    const classroomTable = await queryRunner.getTable('classroom');
    const classroomCountryId = classroomTable?.columns.find((c) => c.name === 'countryId');
    const classroomCountryConstraint = classroomTable?.foreignKeys.find((fk) => fk.name === 'FK_650c574da06eaf08695ed7a7bcd');
    if (!classroomCountryId && !classroomCountryConstraint) {
      await queryRunner.query(
        `ALTER TABLE classroom
        ADD countryId int NULL,
        ADD CONSTRAINT FK_650c574da06eaf08695ed7a7bcd FOREIGN KEY (countryId) REFERENCES country(id) ON DELETE NO ACTION ON UPDATE NO ACTION;`,
      );
    }
    const classroomCountryCode = classroomTable?.columns.find((c) => c.name === 'countryCode');
    if (classroomCountryCode) {
      const classroomCountryCodes: { id: number; countryCode: string }[] = await queryRunner.query(`SELECT id, countryCode FROM classroom`);
      for (const classroom of classroomCountryCodes) {
        const country: { id: number }[] = await queryRunner.query(`SELECT id FROM country WHERE isoCode='${classroom.countryCode}';`);
        await queryRunner.query(`UPDATE classroom SET countryId=${country[0].id} WHERE id=${classroom.id};`);
      }
      await queryRunner.query(`ALTER TABLE classroom DROP COLUMN countryCode`);
    }
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // recreate VILLAGE data
    const villageTable = await queryRunner.getTable('village');
    const villageCountryCodes = villageTable?.columns.find((c) => c.name === 'countryCodes');
    if (!villageCountryCodes) {
      await queryRunner.query(`ALTER TABLE village ADD COLUMN countryCodes TINYTEXT;`);
    }
    const villageCountriesCountryTable = await queryRunner.getTable('village_countries_country');
    if (villageCountriesCountryTable) {
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
      // removing relation village countries table
      if (villageTable?.foreignKeys.find((fk) => fk.name === 'FK_870cdc22399cffb6327c914b790')) {
        await queryRunner.query(`ALTER TABLE village_countries_country DROP FOREIGN KEY FK_870cdc22399cffb6327c914b790`);
      }
      if (villageTable?.foreignKeys.find((fk) => fk.name === 'FK_df9756b7b0058adb584d3a8c75e')) {
        await queryRunner.query(`ALTER TABLE village_countries_country DROP FOREIGN KEY FK_df9756b7b0058adb584d3a8c75e`);
      }
      await queryRunner.dropTable('village_countries_country');
    }

    // recreate USER data
    const userTable = await queryRunner.getTable('user');
    const userCountryId = userTable?.columns.find((c) => c.name === 'countryId');
    if (userCountryId) {
      const usersCountryId: { id: number; countryId: number }[] = await queryRunner.query(`SELECT id, countryId FROM user;`);
      const userCountryCode = userTable?.columns.find((c) => c.name === 'countryCode');
      if (!userCountryCode) {
        await queryRunner.query(`ALTER TABLE user ADD COLUMN countryCode TINYTEXT;`);
        for (const userData of usersCountryId) {
          const isoCode: [{ isoCode: string }] = await queryRunner.query(`SELECT isoCode FROM country WHERE id=${userData.countryId}`);
          if (isoCode.length) {
            await queryRunner.query(`UPDATE user SET countryCode = '${isoCode[0].isoCode}' WHERE id = ${userData.id};`);
          }
        }
      }
      // drop key constraint + column
      await queryRunner.query(`ALTER TABLE user DROP FOREIGN KEY FK_4aaf6d02199282eb8d3931bff31`);
      await queryRunner.query(`ALTER TABLE user DROP COLUMN countryId`);
    }

    // recreate CLASSROOM data
    const classroomTable = await queryRunner.getTable('classroom');
    const classroomCountryId = classroomTable?.columns.find((c) => c.name === 'countryId');
    if (classroomCountryId) {
      const classroomsCountryId: { id: number; countryId: number }[] = await queryRunner.query(`SELECT id, countryId FROM classroom;`);
      if (!classroomTable?.columns.find((c) => c.name === 'countryCode')) {
        await queryRunner.query(`ALTER TABLE classroom ADD COLUMN countryCode TINYTEXT;`);
        for (const classroom of classroomsCountryId) {
          const isoCode: [{ isoCode: string }] = await queryRunner.query(`SELECT isoCode FROM country WHERE id=${classroom.countryId}`);
          if (isoCode.length) {
            await queryRunner.query(`UPDATE classroom SET countryCode = '${isoCode[0].isoCode}' WHERE id = ${classroom.id};`);
          }
        }
      }
      // drop key contraint and relation table
      await queryRunner.query(`ALTER TABLE classroom DROP FOREIGN KEY FK_650c574da06eaf08695ed7a7bcd`);
      await queryRunner.query(`ALTER TABLE classroom DROP COLUMN countryId`);
    }
  }
}

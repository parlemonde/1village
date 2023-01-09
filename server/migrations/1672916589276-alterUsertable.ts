import type { MigrationInterface, QueryRunner } from 'typeorm';
import { TableColumn } from 'typeorm';

export class MyMigration1579323075000 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.addColumn(
      'user',
      new TableColumn({
        name: 'newtype',
        type: 'tinyint',
        isNullable: true,
      }),
    );

    // Map the old enum values to the new tinyint values
    const mapping = {
      '0': 3, // TEACHER = 3
      '1': 5, // OBSERVATOR = 5
      '2': 2, // MEDIATOR = 2
      '3': 1, // ADMIN = 1
      '4': 0, // SUPER_ADMIN = 0
    };

    const queries = Object.entries(mapping).map(([enumValue, tinyintValue]) => {
      return `UPDATE user SET newtype = ${tinyintValue} WHERE type = '${enumValue}'`;
    });

    for (const query of queries) {
      await queryRunner.query(query);
    }

    await queryRunner.dropColumn('user', 'type');
    await queryRunner.renameColumn('user', 'newtype', 'type');
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    /*     // Add the enum column back
    await queryRunner.addColumn(
      'user',
      new TableColumn({
        name: 'type',
        type: 'enum',
        enum: ['value1', 'value2', 'value3'],
        isNullable: true,
      }),
    );

    // Map the new tinyint values to the old enum values
    const mapping = {
      0: '4', // SUPER_ADMIN = "4"
      1: '3', // ADMIN = "3"
      2: '2', // MEDIATOR = "2"
      3: '0', // TEACHER = "0"
      4: '5', // FAMILY = "" (not present in the old enum)
      5: '1', // OBSERVATOR = "1"
    };

    // Copy the data from the tinyint column back to the enum column, using the mapping
    await queryRunner.query(
      `
      UPDATE user
      SET type = ?
      WHERE newtype = ?
    `,
      [Object.values(mapping), Object.keys(mapping)],
    );

    // Drop the tinyint column and rename the table back
    await queryRunner.dropColumn('user', 'newtype');
    await queryRunner.renameTable('user', 'newtype'); */
  }
}

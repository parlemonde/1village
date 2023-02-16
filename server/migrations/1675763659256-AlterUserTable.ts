import type { MigrationInterface, QueryRunner } from 'typeorm';
import { TableColumn } from 'typeorm';

export class AlterUserTable1675763659256 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    const user = 'user';
    const firstname = 'firstname';
    const lastname = 'lastname';
    const language = 'language';
    const hasAcceptedNewsletter = 'hasAcceptedNewsletter';
    const isVerified = 'isVerified';
    const table = await queryRunner.getTable(user);

    const columnsToAdd = [
      {
        name: firstname,
        type: 'varchar',
        length: '50',
        default: '""',
      },
      {
        name: lastname,
        type: 'varchar',
        length: '100',
        default: '""',
      },
      {
        name: language,
        type: 'varchar',
        length: '400',
        default: '""',
      },
      {
        name: hasAcceptedNewsletter,
        type: 'tinyint',
        default: '0',
      },
      {
        name: isVerified,
        type: 'boolean',
        default: false,
      },
    ];

    if (table) {
      for (const columnToAdd of columnsToAdd) {
        const column = table.columns.find((c) => c.name === columnToAdd.name);
        if (!column) {
          await queryRunner.addColumn(user, new TableColumn(columnToAdd));
        }
      }
    }

    await queryRunner.addColumn(
      'user',
      new TableColumn({
        name: 'newtype',
        type: 'tinyint',
        // isNullable: true,
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
    await queryRunner.dropColumns('user', ['firstname', 'lastname', 'language', 'hasAcceptedNewsletter', 'isVerified']);
    // Map the tinyint values to the old enum values
    const mapping = {
      3: '0', // TEACHER = 3
      5: '1', // OBSERVATOR = 5
      2: '2', // MEDIATOR = 2
      1: '3', // ADMIN = 1
      0: '4', // SUPER_ADMIN = 0
    };

    const queries = Object.entries(mapping).map(([tinyintValue, enumValue]) => {
      return `UPDATE user SET type = '${enumValue}' WHERE newtype = ${tinyintValue}`;
    });

    for (const query of queries) {
      await queryRunner.query(query);
    }

    await queryRunner.dropColumn('user', 'newtype');
    await queryRunner.addColumn(
      'user',
      new TableColumn({
        name: 'type',
        type: 'enum',
        enum: ['TEACHER', 'OBSERVATOR', 'MEDIATOR', 'ADMIN', 'SUPER_ADMIN'],
      }),
    );
  }
}

import type { MigrationInterface, QueryRunner } from 'typeorm';
import { Table, TableForeignKey } from 'typeorm';

export class CreateNotificationsTable1628353976535 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'notifications',
        columns: [
          {
            name: 'id',
            type: 'int',
            isPrimary: true,
            isGenerated: true,
            generationStrategy: 'increment',
          },
          {
            name: 'userId',
            type: 'int',
          },
          {
            name: 'commentary',
            type: 'boolean',
            default: true,
          },
          {
            name: 'reaction',
            type: 'boolean',
            default: true,
          },
          {
            name: 'publicationFromSchool',
            type: 'boolean',
            default: true,
          },
          {
            name: 'publicationFromAdmin',
            type: 'boolean',
            default: true,
          },
          {
            name: 'creationAccountFamily',
            type: 'boolean',
            default: true,
          },
          {
            name: 'openingVillageStep',
            type: 'boolean',
            default: true,
          },
        ],
      }),
      true,
    );

    await queryRunner.createForeignKey(
      'notifications',
      new TableForeignKey({
        columnNames: ['userId'],
        referencedColumnNames: ['id'],
        referencedTableName: 'user',
        onDelete: 'CASCADE',
      }),
    );

    const users = await queryRunner.query(`SELECT id FROM user`);

    for (const user of users) {
      await queryRunner.query(
        `INSERT INTO notifications (userId, commentary, reaction, publicationFromSchool, publicationFromAdmin, creationAccountFamily, openingVillageStep) VALUES (${user.id}, true, true, true, true, true, true)`,
      );
    }
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    const table = await queryRunner.getTable('notifications');
    const foreignKey = table?.foreignKeys.find((fk) => fk.columnNames.indexOf('userId') !== -1);
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    await queryRunner.dropForeignKey('notifications', foreignKey!);
    await queryRunner.dropTable('notifications');
  }
}

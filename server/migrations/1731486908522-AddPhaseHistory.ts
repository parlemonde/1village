import { Table, TableForeignKey, TableIndex } from 'typeorm';
import type { MigrationInterface, QueryRunner } from 'typeorm';

export class AddPhaseHistory1731486908522 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'phase_history',
        columns: [
          {
            name: 'id',
            type: 'int',
            isPrimary: true,
            isGenerated: true,
            generationStrategy: 'increment',
          },
          {
            name: 'villageId',
            type: 'int',
            isNullable: false,
          },
          {
            name: 'phase',
            type: 'tinyint',
          },
          {
            name: 'startingOn',
            type: 'datetime',
          },
          {
            name: 'endingOn',
            type: 'datetime',
            isNullable: true,
          },
        ],
      }),
    );

    await queryRunner.createIndex(
      'phase_history',
      new TableIndex({
        name: 'IDX_PHASE_HISTORY',
        columnNames: ['villageId', 'phase'],
        isUnique: true,
      }),
    );

    await queryRunner.createForeignKey(
      'phase_history',
      new TableForeignKey({
        columnNames: ['villageId'],
        referencedColumnNames: ['id'],
        referencedTableName: 'village',
        onDelete: 'CASCADE',
      }),
    );

    const villages = await queryRunner.query(`SELECT id FROM village`);
    const startingOn2024Phase1Date = '2024-09-30 00:00:00.000000';

    for (const village of villages) {
      await queryRunner.query(`INSERT INTO phase_history (villageId, phase, startingOn, endingOn) VALUES (?, ?, ?, ?)`, [
        village.id,
        1,
        startingOn2024Phase1Date,
        null,
      ]);
    }
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    const table = await queryRunner.getTable('phase_history');
    if (table) {
      const foreignKey = table.foreignKeys.find((fk) => fk.columnNames.indexOf('questionId') !== -1);
      if (foreignKey) {
        await queryRunner.dropForeignKey('phase_history', foreignKey);
        await queryRunner.dropIndex('phase_history', 'IDX_PHASE_HISTORY');
        await queryRunner.dropTable('phase_history');
      }
    }
  }
}

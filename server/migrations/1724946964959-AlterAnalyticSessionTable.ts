import type { MigrationInterface, QueryRunner } from 'typeorm';
import { TableColumn, TableForeignKey } from 'typeorm';

export class AlterAnalyticSessionTable1724946964959 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.addColumn(
      'analytic_session',
      new TableColumn({
        name: 'userId',
        type: 'int',
        isNullable: true,
      }),
    );

    await queryRunner.addColumn(
      'analytic_session',
      new TableColumn({
        name: 'phase',
        type: 'int',
        isNullable: false,
      }),
    );

    await queryRunner.createForeignKey(
      'analytic_session',
      new TableForeignKey({
        columnNames: ['userId'],
        referencedColumnNames: ['id'],
        referencedTableName: 'user',
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    const table = await queryRunner.getTable('analytic_session');
    const isUserIdColumnExists = table?.findColumnByName('userId');
    const isUserPhaseColumnExists = table?.findColumnByName('phase');

    if (table) {
      if (isUserIdColumnExists) {
        const foreignKey = table.foreignKeys.find((fk) => fk.columnNames.indexOf('userId') !== -1);
        if (foreignKey) await queryRunner.dropForeignKey('analytic_session', foreignKey);
        await queryRunner.dropColumn('analytic_session', 'userId');
      }
      if (isUserPhaseColumnExists) {
        await queryRunner.dropColumn('analytic_session', 'phase');
      }
    }
  }
}

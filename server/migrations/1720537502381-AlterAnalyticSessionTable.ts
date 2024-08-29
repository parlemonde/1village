import type { MigrationInterface, QueryRunner } from 'typeorm';
import { TableColumn, TableForeignKey } from 'typeorm';

export class AlterAnalyticSessionTable1720537502381 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.addColumn(
      'analytic_session',
      new TableColumn({
        name: 'userId',
        type: 'int',
        isNullable: true,
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
    const isColumnExists = table?.findColumnByName('userId');

    if (table && isColumnExists) {
      const foreignKey = table.foreignKeys.find((fk) => fk.columnNames.indexOf('userId') !== -1);

      if (foreignKey) await queryRunner.dropForeignKey('analytic_session', foreignKey);
      await queryRunner.dropColumn('analytic_session', 'userId');
    }
  }
}

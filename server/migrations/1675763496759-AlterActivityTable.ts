import type { MigrationInterface, QueryRunner } from 'typeorm';
import { TableIndex, TableColumn } from 'typeorm';

export class AlterActivityTable1675763496759 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    const activity = 'activity';
    const isVisibleToParent = 'isVisibleToParent';
    const table = await queryRunner.getTable(activity);

    if (!table || table.columns.find((column) => column.name === isVisibleToParent)) {
      // The table doesn't exist or the column already exists, so we don't need to do anything
      return;
    }

    await queryRunner.addColumn(
      'activity',
      new TableColumn({
        name: 'isVisibleToParent',
        type: 'tinyint',
        default: '1',
      }),
    );
    await queryRunner.createIndex(
      'activity',
      new TableIndex({
        columnNames: ['userId'],
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    const activity = 'activity';
    const isVisibleToParent = 'isVisibleToParent';

    const table = await queryRunner.getTable(activity);
    if (!table || !table.columns.find((column) => column.name === isVisibleToParent)) {
      // The table doesn't exist or the column already exists, so we don't need to do anything
      return;
    }

    await queryRunner.dropColumn(activity, isVisibleToParent);
    await queryRunner.dropIndex('activity', 'userId');
  }
}

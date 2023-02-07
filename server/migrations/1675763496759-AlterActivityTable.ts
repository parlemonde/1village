import type { MigrationInterface, QueryRunner } from 'typeorm';
import { TableIndex, TableColumn } from 'typeorm';

export class AlterActivityTable1675763496759 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
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
    await queryRunner.dropColumn('activity', 'isVisibleToParent');
    await queryRunner.dropIndex('activity', 'userId');
  }
}

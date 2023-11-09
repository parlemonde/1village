import type { MigrationInterface, QueryRunner } from 'typeorm';
import { TableColumn } from 'typeorm';

export class AlterCommentTable1699541640124 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    const table = await queryRunner.getTable('comment');
    const isColumnExists = table?.findColumnByName('isoCode');

    if (!isColumnExists) {
      await queryRunner.addColumn(
        'comment',
        new TableColumn({
          name: 'isoCode',
          type: 'text',
          isNullable: true,
        }),
      );
    }
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    const table = await queryRunner.getTable('comment');
    const isColumnExists = table?.findColumnByName('isoCode');

    if (isColumnExists) {
      await queryRunner.dropColumn('comment', 'isoCode');
    }
  }
}

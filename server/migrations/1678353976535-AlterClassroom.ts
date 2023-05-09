import type { MigrationInterface, QueryRunner } from 'typeorm';
import { TableColumn } from 'typeorm';

export class AlterClassroom1678353976535 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    const table = await queryRunner.getTable('classroom');
    const isColumnExists = table?.findColumnByName('countryCode');

    if (!isColumnExists) {
      await queryRunner.addColumn(
        'classroom',
        new TableColumn({
          name: 'countryCode',
          type: 'varchar',
          length: '2',
          isNullable: true,
        }),
      );
    }
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    const table = await queryRunner.getTable('classroom');
    const isColumnExists = table?.findColumnByName('countryCode');

    if (isColumnExists) {
      await queryRunner.dropColumn('classroom', 'countryCode');
    }
  }
}

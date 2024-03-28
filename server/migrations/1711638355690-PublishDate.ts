import { TableColumn } from 'typeorm';
import type { MigrationInterface, QueryRunner } from 'typeorm';

export class PublishDate1705329596198 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    const activityTable = await queryRunner.getTable('activity');
    if (activityTable) {
      if (!activityTable.findColumnByName('publishDate')) {
        await queryRunner.addColumn(
          'activity',
          new TableColumn({
            name: 'publishDate',
            type: 'DATETIME',
            isNullable: true,
          }),
        );
        await queryRunner.query('UPDATE activity SET publishDate = createDate WHERE publishDate IS NULL AND status = 0');
      }
    }
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    const activityTable = await queryRunner.getTable('activity');
    if (activityTable) {
      if (activityTable.findColumnByName('publishDate')) {
        await queryRunner.dropColumn('activity', 'publishDate');
      }
    }
  }
}

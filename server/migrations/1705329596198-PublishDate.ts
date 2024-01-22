import { TableColumn } from 'typeorm';
import type { MigrationInterface, QueryRunner } from 'typeorm';

export class PublishDate1705329596198 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.addColumn(
      'activity',
      new TableColumn({
        name: 'publishDate',
        type: 'date',
        isNullable: true,
      }),
    );
    await queryRunner.query('UPDATE activity SET publishDate = createDate WHERE publishDate IS NULL');
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropColumn('activity', 'publishDate');
    await queryRunner.query('ALTER TABLE "activity" DROP COLUMN "publishDate"');
  }
}

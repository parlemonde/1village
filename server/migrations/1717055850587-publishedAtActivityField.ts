import type { MigrationInterface, QueryRunner } from 'typeorm';

export class PublishedAtActivityField1717055850587 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    const activityTable = await queryRunner.getTable('activity');
    if (!activityTable?.columns.find((col) => col.name === 'publishDate')) {
      await queryRunner.query(`ALTER TABLE activity
                ADD COLUMN publishDate TIMESTAMP`);
      await queryRunner.query(`UPDATE activity SET publishDate = activity.createDate WHERE status = 0;`);
    }
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    const activityTable = await queryRunner.getTable('activity');
    if (activityTable?.columns.find((col) => col.name === 'publishDate')) {
      await queryRunner.query(`ALTER TABLE activity
              DROP COLUMN publishDate`);
    }
  }
}

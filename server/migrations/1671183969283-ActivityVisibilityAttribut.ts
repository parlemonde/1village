import type { MigrationInterface, QueryRunner } from 'typeorm';
import { TableColumn } from 'typeorm';

//Doc : https://typeorm.biunav.com/en/migrations.html#using-migration-api-to-write-migrations
export class ActivityVisibilityAttribut1671183969283 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.addColumn(
      'activity',
      new TableColumn({
        name: 'isVisibleToParent',
        type: 'tinyint',
        default: '1',
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropColumn('activity', 'isVisibleToParent');
  }
}

import type { MigrationInterface, QueryRunner } from 'typeorm';
import { TableColumn } from 'typeorm';

export class AlterActivityTable1727776142738 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.changeColumn(
      'activity',
      'villageId',
      new TableColumn({
        name: 'villageId',
        type: 'int',
        isNullable: true,
      }),
    );

    await queryRunner.changeColumn(
      'activity',
      'publishDate',
      new TableColumn({
        name: 'publishDate',
        type: 'datetime(6)',
        isNullable: true,
      }),
    );

    await queryRunner.addColumn(
      'activity',
      new TableColumn({
        name: 'parentActivityId',
        type: 'int',
        isNullable: true,
      }),
    );

    // Add isDisplayed column for exclude a parent activity to be
    // displayed in the list of activities
    await queryRunner.addColumn(
      'activity',
      new TableColumn({
        name: 'isDisplayed',
        type: 'boolean',
        isNullable: true,
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.changeColumn(
      'activity',
      'villageId',
      new TableColumn({
        name: 'villageId',
        type: 'int',
        isNullable: false,
      }),
    );

    await queryRunner.changeColumn(
      'activity',
      'publishDate',
      new TableColumn({
        name: 'publishDate',
        type: 'datetime',
        isNullable: false,
      }),
    );

    await queryRunner.dropColumn('activity', 'parentActivityId');
    await queryRunner.dropColumn('activity', 'isDisplayed');
  }
}

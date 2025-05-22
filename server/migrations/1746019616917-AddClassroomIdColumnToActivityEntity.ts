import type { MigrationInterface, QueryRunner } from 'typeorm';
import { TableColumn, TableForeignKey } from 'typeorm';

export class AddClassroomIdColumnToActivityEntity1746019616917 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.addColumn(
      'activity',
      new TableColumn({
        name: 'classroomId',
        type: 'int',
        isNullable: true,
        default: null,
      }),
    );
    await queryRunner.createForeignKey(
      'activity',
      new TableForeignKey({
        columnNames: ['classroomId'],
        referencedColumnNames: ['id'],
        referencedTableName: 'classroom',
        onDelete: 'CASCADE',
        name: 'ActivityClassroomFK',
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropForeignKey('activity', 'ActivityClassroomFK');
    await queryRunner.dropColumn('activity', 'classroomId');
  }
}

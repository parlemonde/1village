import type { MigrationInterface, QueryRunner } from 'typeorm';
import { TableColumn } from 'typeorm';

export class ClassroomNewParamVisibilitySetToClass1671700906804 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.addColumn(
      'classroom',
      new TableColumn({
        name: 'hasVisibilitySetToClass',
        type: 'tinyint',
        default: '0',
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropColumn('classroom', 'hasVisibilitySetToClass');
  }
}

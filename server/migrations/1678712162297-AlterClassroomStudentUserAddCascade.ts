import type { MigrationInterface, QueryRunner } from 'typeorm';
import { Table } from 'typeorm';

export class AlterClassroomStudentUserAddCascade1678712162297 implements MigrationInterface {
  async up(queryRunner: QueryRunner): Promise<void> {
    const table = await queryRunner.getTable('user');
    const foreignKey = table.foreignKeys.find((fk) => fk.columnNames.indexOf('') !== -1);
    await queryRunner.dropForeignKey('answer', foreignKey);

    await queryRunner.createForeignKey(
      'answer',
      new TableForeignKey({
        columnNames: [''],
        referencedColumnNames: ['id'],
        referencedTableName: '',
        onDelete: 'CASCADE',
      }),
    );
  }

  async down(queryRunner: QueryRunner): Promise<void> {
    const table = await queryRunner.getTable('answer');
    const foreignKey = table.foreignKeys.find((fk) => fk.columnNames.indexOf('questionId') !== -1);
    await queryRunner.dropForeignKey('answer', foreignKey);
  }
}

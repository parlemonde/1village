import type { MigrationInterface, QueryRunner } from 'typeorm';
import { TableForeignKey } from 'typeorm';

import { dropForeignKeyIfExists } from '../utils/dropForeignKeyIfExists';

export class AddCascadesForVillageAndStudentDeletion1679254082349 implements MigrationInterface {
  async up(queryRunner: QueryRunner): Promise<void> {
    await dropForeignKeyIfExists(queryRunner, 'classroom', 'villageId');
    await dropForeignKeyIfExists(queryRunner, 'student', 'classroomId');

    await queryRunner.createForeignKey(
      'classroom',
      new TableForeignKey({
        columnNames: ['villageId'],
        referencedColumnNames: ['id'],
        referencedTableName: 'village',
        onDelete: 'CASCADE',
        name: 'ClassroomVillageFK',
      }),
    );

    await queryRunner.createForeignKey(
      'student',
      new TableForeignKey({
        columnNames: ['classroomId'],
        referencedColumnNames: ['id'],
        referencedTableName: 'classroom',
        onDelete: 'CASCADE',
        name: 'StudentClassroomFK',
      }),
    );
  }

  async down(queryRunner: QueryRunner): Promise<void> {
    await dropForeignKeyIfExists(queryRunner, 'classroom', 'villageId');
    await dropForeignKeyIfExists(queryRunner, 'student', 'classroomId');

    await queryRunner.createForeignKey(
      'classroom',
      new TableForeignKey({
        columnNames: ['villageId'],
        referencedColumnNames: ['id'],
        referencedTableName: 'village',
        name: 'FK_ce22c442aec315cd3aa13b69210',
      }),
    );

    await queryRunner.createForeignKey(
      'student',
      new TableForeignKey({
        columnNames: ['classroomId'],
        referencedColumnNames: ['id'],
        referencedTableName: 'classroom',
        name: 'FK_ab334f6a4e3ed5adda6e2172334',
      }),
    );
  }
}

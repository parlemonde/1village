import type { MigrationInterface, QueryRunner } from 'typeorm';
import { TableForeignKey } from 'typeorm';

import { dropForeignKeyIfExists } from '../utils/dropForeignKeyIfExists';

export class AddCascades1678809291061 implements MigrationInterface {
  async up(queryRunner: QueryRunner): Promise<void> {
    await dropForeignKeyIfExists(queryRunner, 'classroom', 'userId');
    await dropForeignKeyIfExists(queryRunner, 'user_to_student', 'userId');
    await dropForeignKeyIfExists(queryRunner, 'user_to_student', 'studentId');
    await dropForeignKeyIfExists(queryRunner, 'student', 'classroomId');

    await queryRunner.createForeignKey(
      'classroom',
      new TableForeignKey({
        columnNames: ['userId'],
        referencedColumnNames: ['id'],
        referencedTableName: 'user',
        onDelete: 'CASCADE',
        name: 'ClassroomUserFK',
      }),
    );

    await queryRunner.createForeignKey(
      'user_to_student',
      new TableForeignKey({
        columnNames: ['userId'],
        referencedColumnNames: ['id'],
        referencedTableName: 'user',
        onDelete: 'CASCADE',
        name: 'UserStudent_UserFK',
      }),
    );

    await queryRunner.createForeignKey(
      'user_to_student',
      new TableForeignKey({
        columnNames: ['studentId'],
        referencedColumnNames: ['id'],
        referencedTableName: 'student',
        onDelete: 'CASCADE',
        name: 'UserStudent_StudentFK',
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
    await dropForeignKeyIfExists(queryRunner, 'classroom', 'userId');
    await dropForeignKeyIfExists(queryRunner, 'user_to_student', 'studentId');
    await dropForeignKeyIfExists(queryRunner, 'user_to_student', 'userId');
    await dropForeignKeyIfExists(queryRunner, 'student', 'classroomId');

    await queryRunner.createForeignKey(
      'classroom',
      new TableForeignKey({
        columnNames: ['userId'],
        referencedColumnNames: ['id'],
        referencedTableName: 'user',
        name: 'FK_6f2187911a8faba7c91a83194d9',
      }),
    );

    await queryRunner.createForeignKey(
      'user_to_student',
      new TableForeignKey({
        columnNames: ['studentId'],
        referencedColumnNames: ['id'],
        referencedTableName: 'student',
        name: 'FK_39299bddd62684b6bf55a7a8aec',
      }),
    );

    await queryRunner.createForeignKey(
      'user_to_student',
      new TableForeignKey({
        columnNames: ['userId'],
        referencedColumnNames: ['id'],
        referencedTableName: 'user',
        name: 'FK_c4a67eb239df56e50679e238eec',
      }),
    );

    await queryRunner.createForeignKey(
      'student',
      new TableForeignKey({
        columnNames: ['classroomId'],
        referencedColumnNames: ['id'],
        referencedTableName: 'classroom',
        name: 'FK_426224f5597213259b1d58fc0f4',
      }),
    );
  }
}

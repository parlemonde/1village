import { TableColumn } from 'typeorm';
import type { MigrationInterface, QueryRunner } from 'typeorm';

export class AddCreatedAtColumnToStudentAndUserEntities1729236109909 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.addColumn(
      'student',
      new TableColumn({
        name: 'createdAt',
        type: 'timestamp',
        isNullable: true,
      }),
    );
    await queryRunner.query(`UPDATE "student" SET "createdAt" = NULL WHERE "createdAt" IS NOT NULL`);
    await queryRunner.changeColumn(
      'student',
      'createdAt',
      new TableColumn({
        name: 'createdAt',
        type: 'timestamp',
        isNullable: false,
        default: 'CURRENT_TIMESTAMP',
      }),
    );
    await queryRunner.addColumn(
      'user',
      new TableColumn({
        name: 'createdAt',
        type: 'timestamp',
        isNullable: true,
      }),
    );
    await queryRunner.query(`UPDATE "user" SET "createdAt" = NULL WHERE "createdAt" IS NOT NULL`);
    await queryRunner.changeColumn(
      'user',
      'createdAt',
      new TableColumn({
        name: 'createdAt',
        type: 'timestamp',
        isNullable: false,
        default: 'CURRENT_TIMESTAMP',
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropColumn('student', 'createdAt');
    await queryRunner.dropColumn('user', 'createdAt');
  }
}

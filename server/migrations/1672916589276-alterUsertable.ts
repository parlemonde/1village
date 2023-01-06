import type { MigrationInterface, QueryRunner } from 'typeorm';

export class UpdateUserType1593203874479 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      UPDATE users
      SET type = 
        CASE
          WHEN type = 'TEACHER' THEN '3'
          WHEN type = 'OBSERVATOR' THEN '5'
          WHEN type = 'MEDIATOR' THEN '2'
          WHEN type = 'ADMIN' THEN '1'
          WHEN type = 'SUPER_ADMIN' THEN '0'
          WHEN type = 'FAMILY' THEN '4'
        END
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      UPDATE users
      SET type = 
        CASE
          WHEN type = '3' THEN 'TEACHER'
          WHEN type = '5' THEN 'OBSERVATOR'
          WHEN type = '2' THEN 'MEDIATOR'
          WHEN type = '1' THEN 'ADMIN'
          WHEN type = '0' THEN 'SUPER_ADMIN'
          WHEN type = '4' THEN 'FAMILY'
        END
    `);
  }
}

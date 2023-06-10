import type { MigrationInterface, QueryRunner } from 'typeorm';

export class alterToken1678113524215 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE token MODIFY token VARCHAR(300);`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE token MODIFY token VARCHAR(95);`);
  }
}

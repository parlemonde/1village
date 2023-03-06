import type { MigrationInterface, QueryRunner } from 'typeorm';

export class alterToken1678113524215 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE token ALTER COLUMN token VARCHAR(300);`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE token ALTER COLUMN token VARCHAR(95);`);
  }
}

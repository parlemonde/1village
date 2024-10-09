import type { MigrationInterface, QueryRunner } from 'typeorm';

export class AlterGameTable1724946964960 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE game ADD COLUMN status INT NOT NULL DEFAULT (1)`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE game DROP COLUMN status`);
  }
}

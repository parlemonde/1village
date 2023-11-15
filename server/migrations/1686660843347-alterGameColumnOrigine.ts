import type { MigrationInterface, QueryRunner } from 'typeorm';

export class alterGameColumnOrigine1686660843347 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE game MODIFY origine text NULL`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE game MODIFY origine text NOT NULL`);
  }
}

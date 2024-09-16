import type { MigrationInterface, QueryRunner } from 'typeorm';

export class AlterGameResponseTable1724946964958 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE game_response DROP FOREIGN KEY FK_3a0c737a217bbd6bbd268203fb8`);
    await queryRunner.query(`ALTER TABLE game_response DROP COLUMN gameId`);
    await queryRunner.query(`ALTER TABLE game_response ADD COLUMN gameId INT`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE game_response DROP COLUMN gameId`);
    await queryRunner.query(`ALTER TABLE game_response ADD COLUMN gameId INT`);
    await queryRunner.query(`ALTER TABLE game_response ADD CONSTRAINT FK_3a0c737a217bbd6bbd268203fb8 FOREIGN KEY (gameId) REFERENCES game(id)`);
  }
}

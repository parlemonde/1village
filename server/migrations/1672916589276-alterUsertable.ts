import type { MigrationInterface, QueryRunner } from 'typeorm';

export class ReplaceUserTypeEnumWithTinyint1593203874479 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    // Add the new tinyint column "type"
    await queryRunner.query(`ALTER TABLE user ADD type tinyint NOT NULL DEFAULT 3`);
    // Update the values in the "type" column to match the old enum values
    await queryRunner.query(`UPDATE user SET type = 4 WHERE type = 0`);
    await queryRunner.query(`UPDATE user SET type = 3 WHERE type = 1`);
    await queryRunner.query(`UPDATE user SET type = 2 WHERE type = 2`);
    await queryRunner.query(`UPDATE user SET type = 0 WHERE type = 3`);
    await queryRunner.query(`UPDATE user SET type = 5 WHERE type = 1`);
    // Drop the old enum column "type"
    await queryRunner.query(`ALTER TABLE user DROP COLUMN type`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // Add the old enum column "type"
    await queryRunner.query(`ALTER TABLE user ADD type enum('TEACHER','OBSERVATOR','MEDIATOR','ADMIN','SUPER_ADMIN') NOT NULL DEFAULT 'TEACHER'`);
    // Update the values in the "type" column to match the new tinyint values
    await queryRunner.query(`UPDATE user SET type = 'SUPER_ADMIN' WHERE type = 4`);
    await queryRunner.query(`UPDATE user SET type = 'ADMIN' WHERE type = 3`);
    await queryRunner.query(`UPDATE user SET type = 'MEDIATOR' WHERE type = 2`);
    await queryRunner.query(`UPDATE user SET type = 'TEACHER' WHERE type = 0`);
    await queryRunner.query(`UPDATE user SET type = 'OBSERVATOR' WHERE type = 5`);
    // Drop the new tinyint column "type"
    await queryRunner.query(`ALTER TABLE user DROP COLUMN type`);
  }
}

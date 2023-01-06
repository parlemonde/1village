import type { MigrationInterface, QueryRunner } from 'typeorm';

export class UpdateUserTypeEnum1593203874479 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    // Update the values in the "type" column to match the new enum values
    await queryRunner.query(`UPDATE user SET type = 0 WHERE type = 3`);
    await queryRunner.query(`UPDATE user SET type = 1 WHERE type = 4`);
    await queryRunner.query(`UPDATE user SET type = 2 WHERE type = 2`);
    await queryRunner.query(`UPDATE user SET type = 3 WHERE type = 1`);
    await queryRunner.query(`UPDATE user SET type = 4 WHERE type = 0`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // Update the values in the "type" column to match the old enum values
    await queryRunner.query(`UPDATE user SET type = 4 WHERE type = 1`);
    await queryRunner.query(`UPDATE user SET type = 3 WHERE type = 0`);
    await queryRunner.query(`UPDATE user SET type = 2 WHERE type = 2`);
    await queryRunner.query(`UPDATE user SET type = 1 WHERE type = 3`);
    await queryRunner.query(`UPDATE user SET type = 0 WHERE type = 4`);
  }
}

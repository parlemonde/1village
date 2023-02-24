import type { MigrationInterface, QueryRunner } from 'typeorm';

export class AlterTablePseudoNullable1677233245182 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE user DROP INDEX IDX_be726a825c7254f55be1540601`);
    await queryRunner.query(`ALTER TABLE user ALTER COLUMN pseudo SET DEFAULT ''`);
  }
  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE user ALTER COLUMN pseudo SET DEFAULT NULL`);
    await queryRunner.query(`CREATE UNIQUE INDEX IDX_be726a825c7254f55be1540601 ON user (pseudo)`);
  }
}

import type { MigrationInterface, QueryRunner } from 'typeorm';

export class AlterTablePseudoNullable1677233245182 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE user ALTER COLUMN pseudo SET DEFAULT ''`);
    await queryRunner.query(`ALTER TABLE user DROP CONSTRAINT "IDX_be726a825c7254f55be1540601"`);
  }
  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE user ALTER COLUMN pseudo SET DEFAULT NULL`);
    await queryRunner.query(`ALTER TABLE user ADD CONSTRAINT "IDX_be726a825c7254f55be1540601" UNIQUE(pseudo)`);
  }
}

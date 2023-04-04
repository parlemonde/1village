import type { MigrationInterface, QueryRunner } from 'typeorm';

export class AlterGame1680529318903 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      UPDATE game
      SET 
        fakeSignification1 = JSON_VALUE(content, '$.fakeSignification1'),
        fakeSignification2 = JSON_VALUE(content, '$.fakeSignification2'),
        origine = JSON_VALUE(content, '$.origine'),
        signification = JSON_VALUE(content, '$.signification'),
        video = JSON_VALUE(content, '$.video')
      WHERE id IN (1, 2, 3, 4, 5)
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await Promise.all([
      queryRunner.query(
        "UPDATE game SET content = JSON_SET(content, '$.fakeSignification1', fakeSignification1, '$.fakeSignification2', fakeSignification2, '$.origine', origine, '$.signification', signification, '$.video', video) WHERE id IN (1, 2, 3, 4, 5)",
      ),
      queryRunner.dropColumn('game', 'fakeSignification1'),
      queryRunner.dropColumn('game', 'fakeSignification2'),
      queryRunner.dropColumn('game', 'origine'),
      queryRunner.dropColumn('game', 'signification'),
      queryRunner.dropColumn('game', 'video'),
    ]);
  }
}

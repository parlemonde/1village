import type { MigrationInterface, QueryRunner } from 'typeorm';

export class GameAddJsonColumns1675763011163 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    try {
      // add 5 columns
      const table = await queryRunner.getTable('game');
      if (table) {
        if (!table.findColumnByName('fakeSignification1')) {
          await queryRunner.query(`ALTER TABLE game ADD fakeSignification1 TEXT`);
        }
        if (!table.findColumnByName('fakeSignification2')) {
          await queryRunner.query(`ALTER TABLE game ADD fakeSignification2 TEXT`);
        }
        if (!table.findColumnByName('origine')) {
          await queryRunner.query(`ALTER TABLE game ADD origine TEXT`);
        }
        if (!table.findColumnByName('signification')) {
          await queryRunner.query(`ALTER TABLE game ADD signification TEXT`);
        }
        if (!table.findColumnByName('video')) {
          await queryRunner.query(`ALTER TABLE game ADD video TEXT`);
        }
      }

      // Retrieve all games with value in column "content" and update the 5 colums
      const games = await queryRunner.query(`SELECT * FROM game WHERE content IS NOT NULL`);
      for (const game of games) {
        const { fakeSignification1, fakeSignification2, origine, signification, video } = JSON.parse(game.content);
        await queryRunner.query(`UPDATE game SET fakeSignification1=?, fakeSignification2=?, origine=?, signification=?, video=? WHERE id=?`, [
          fakeSignification1,
          fakeSignification2,
          origine,
          signification,
          video,
          game.id,
        ]);
      }

      // Delete column "content"
      await queryRunner.query(`ALTER TABLE game DROP COLUMN content`);
    } catch (error) {
      console.error('Error during GameAddJsonColumns1675763011163 migration:', error);
    }
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // Add column "content"
    try {
      await queryRunner.query(`ALTER TABLE game ADD content jsonb`);

      // Retrieve all games with value for 5 columns and update the "content" column
      const games = await queryRunner.query(
        `SELECT * FROM game WHERE fakeSignification1 IS NOT NULL OR fakeSignification2 IS NOT NULL OR origine IS NOT NULL OR signification IS NOT NULL OR video IS NOT NULL`,
      );
      for (const game of games) {
        const { fakeSignification1, fakeSignification2, origine, signification, video } = game;
        const content = JSON.stringify({ fakeSignification1, fakeSignification2, origine, signification, video });
        await queryRunner.query(`UPDATE game SET content=$1 WHERE id=$2`, [content, game.id]);
      }

      // Delete 5 columns
      await queryRunner.query(`ALTER TABLE game DROP COLUMN fakeSignification1`);
      await queryRunner.query(`ALTER TABLE game DROP COLUMN fakeSignification2`);
      await queryRunner.query(`ALTER TABLE game DROP COLUMN origine`);
      await queryRunner.query(`ALTER TABLE game DROP COLUMN signification`);
      await queryRunner.query(`ALTER TABLE game DROP COLUMN video`);
    } catch (error) {
      console.error('Error during GameAddJsonColumns1675763011163 rollback:', error);
    }
  }
}

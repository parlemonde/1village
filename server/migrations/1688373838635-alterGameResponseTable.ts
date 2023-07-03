import { MigrationInterface, QueryRunner } from "typeorm"

export class alterGameResponseTable1688373838635 implements MigrationInterface {
    public async up(queryRunner: QueryRunner): Promise<void> {
        try {
            const table = await queryRunner.getTable('game_response');
            if(table) {
                if (!table.findColumnByName('isOldResponse')) {
                    await queryRunner.query(`ALTER TABLE game_response ADD isOldResponse BOOLEAN DEFAULT false`);
                }
            }
        }catch (error) {
            console.error("Error during alterGameResponseTable1688373838635 migration:", error);
            throw error;
        }
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE game_response DROP COLUMN isOldResponse`);
    }
}



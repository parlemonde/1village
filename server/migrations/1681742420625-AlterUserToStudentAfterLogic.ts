import type { MigrationInterface, QueryRunner } from 'typeorm';

export class UserToStudentTriggerExample1681742420626 implements MigrationInterface {
    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
        CREATE TRIGGER user_to_student_after_insert
        AFTER INSERT ON user_to_student
        FOR EACH ROW
        BEGIN
            SELECT '******** Row inserted ********';
        END;
        
        
        `);

        await queryRunner.query(`
        CREATE TRIGGER user_to_student_after_delete
        AFTER DELETE ON user_to_student
        FOR EACH ROW
        BEGIN
            SELECT '******** Row deleted ********';
        END;
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TRIGGER IF EXISTS user_to_student_after_insert ON user_to_student;`);
        await queryRunner.query(`DROP TRIGGER IF EXISTS user_to_student_after_delete ON user_to_student;`);
    }
}

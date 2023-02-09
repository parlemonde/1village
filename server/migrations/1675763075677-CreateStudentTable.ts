import type { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateStudentTable1675763075677 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`CREATE TABLE IF NOT EXISTS "student" (
        "id" int NOT NULL AUTO_INCREMENT,
        "firstname" varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
        "lastname" varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
        "hashedCode" varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
        "numLinkedAccount" tinyint DEFAULT '0',
        "classroomId" int DEFAULT NULL,
        PRIMARY KEY ("id"),
        KEY "FK_426224f5597213259b1d58fc0f4" ("classroomId"),
        CONSTRAINT "FK_426224f5597213259b1d58fc0f4" FOREIGN KEY ("classroomId") REFERENCES "classroom" ("id")
      ) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(``);
  }
}

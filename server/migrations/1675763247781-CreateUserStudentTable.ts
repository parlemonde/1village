import type { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateUserStudentTable1675763247781 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
    CREATE TABLE IF NOT EXISTS "user_to_student" (
        "id" int NOT NULL AUTO_INCREMENT,
        "userId" int DEFAULT NULL,
        "studentId" int DEFAULT NULL,
        PRIMARY KEY ("id"),
        KEY "FK_c4a67eb239df56e50679e238eec" ("userId"),
        KEY "FK_39299bddd62684b6bf55a7a8aec" ("studentId"),
        CONSTRAINT "FK_39299bddd62684b6bf55a7a8aec" FOREIGN KEY ("studentId") REFERENCES "student" ("id"),
        CONSTRAINT "FK_c4a67eb239df56e50679e238eec" FOREIGN KEY ("userId") REFERENCES "user" ("id")
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {}
}

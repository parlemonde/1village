import type { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateClassroomTable1675763051163 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`CREATE TABLE IF NOT EXISTS classroom (
      id int NOT NULL AUTO_INCREMENT,
      \`name\` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
      avatar varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
      delayedDays int DEFAULT '0',
      hasVisibilitySetToClass tinyint DEFAULT '0',
      userId int DEFAULT NULL,
      villageId int DEFAULT NULL,
      PRIMARY KEY (id),
      UNIQUE KEY REL_6f2187911a8faba7c91a83194d (userId),
      KEY FK_ce22c442aec315cd3aa13b69210 (villageId),
      CONSTRAINT FK_6f2187911a8faba7c91a83194d9 FOREIGN KEY (userId) REFERENCES user (id),
      CONSTRAINT FK_ce22c442aec315cd3aa13b69210 FOREIGN KEY (villageId) REFERENCES village (id)
    ) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(``);
  }
}

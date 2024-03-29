import type { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateFeatureFlagTable1679254082345 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      CREATE TABLE IF NOT EXISTS feature_flag (
        id int NOT NULL AUTO_INCREMENT,
        name varchar(255) NOT NULL,
        isEnabled boolean NOT NULL DEFAULT false,
        PRIMARY KEY (id),
        UNIQUE KEY unique_name (name)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
    `);

    await queryRunner.query(`
      CREATE TABLE IF NOT EXISTS user_feature_flags_feature_flag (
        userId int NOT NULL,
        featureFlagId int NOT NULL,
        PRIMARY KEY (userId, featureFlagId)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
    `);

    await queryRunner.query(
      `
      ALTER TABLE user_feature_flags_feature_flag
      ADD CONSTRAINT FK_user
      FOREIGN KEY (userId) REFERENCES user (id) ON DELETE CASCADE;
    `,
      undefined,
      true,
    );

    await queryRunner.query(
      `
      ALTER TABLE user_feature_flags_feature_flag
      ADD CONSTRAINT FK_featureFlag
      FOREIGN KEY (featureFlagId) REFERENCES feature_flag (id) ON DELETE CASCADE;
    `,
      undefined,
      true,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE IF EXISTS user_feature_flags_feature_flag;`);
    await queryRunner.query(`DROP TABLE IF EXISTS feature_flag;`);
  }
}

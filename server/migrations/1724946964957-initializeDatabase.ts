import type { MigrationInterface, QueryRunner } from 'typeorm';

export class InitializeDatabase1724946964957 implements MigrationInterface {
  name = 'InitializeDatabase1724946964957';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE \`feature_flag\` (\`id\` int NOT NULL AUTO_INCREMENT, \`name\` varchar(255) NOT NULL, \`isEnabled\` tinyint NOT NULL DEFAULT 0, UNIQUE INDEX \`IDX_0cb1810eca363db1e0bf13c3cf\` (\`name\`), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`,
    );
    await queryRunner.query(
      `CREATE TABLE \`image\` (\`id\` int NOT NULL AUTO_INCREMENT, \`createDate\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updateDate\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`deleteDate\` datetime(6) NULL, \`userId\` int NOT NULL, \`villageId\` int NOT NULL, \`activityId\` int NOT NULL, \`imageType\` tinyint NOT NULL, \`imageUrl\` text NOT NULL, \`inspiredStoryId\` int NOT NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`,
    );
    await queryRunner.query(
      `CREATE TABLE \`classroom\` (\`id\` int NOT NULL AUTO_INCREMENT, \`name\` varchar(255) NULL, \`avatar\` varchar(255) NULL, \`delayedDays\` int NULL DEFAULT '0', \`countryCode\` varchar(2) NULL, \`hasVisibilitySetToClass\` tinyint NULL DEFAULT 0, \`villageId\` int NOT NULL, \`userId\` int NULL, UNIQUE INDEX \`REL_6f2187911a8faba7c91a83194d\` (\`userId\`), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`,
    );
    await queryRunner.query(
      `CREATE TABLE \`student\` (\`id\` int NOT NULL AUTO_INCREMENT, \`firstname\` varchar(100) NULL, \`lastname\` varchar(255) NOT NULL, \`hashedCode\` varchar(255) NOT NULL, \`numLinkedAccount\` tinyint NULL DEFAULT '0', \`classroomId\` int NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`,
    );
    await queryRunner.query(
      `CREATE TABLE \`user_to_student\` (\`id\` int NOT NULL AUTO_INCREMENT, \`userId\` int NOT NULL, \`studentId\` int NOT NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`,
    );
    await queryRunner.query(
      `CREATE TABLE \`user\` (\`id\` int NOT NULL AUTO_INCREMENT, \`email\` varchar(255) NOT NULL, \`pseudo\` varchar(50) NOT NULL DEFAULT '', \`firstname\` varchar(50) NOT NULL DEFAULT '', \`lastname\` varchar(100) NOT NULL DEFAULT '', \`level\` varchar(50) NOT NULL DEFAULT '', \`school\` varchar(255) NOT NULL DEFAULT '', \`city\` varchar(128) NOT NULL DEFAULT '', \`postalCode\` varchar(20) NOT NULL DEFAULT '', \`address\` varchar(255) NOT NULL DEFAULT '', \`avatar\` text NULL, \`displayName\` varchar(400) NULL, \`hasAcceptedNewsletter\` tinyint NOT NULL DEFAULT 0, \`language\` varchar(400) NOT NULL DEFAULT 'français', \`accountRegistration\` int NOT NULL DEFAULT '0', \`passwordHash\` varchar(300) NOT NULL, \`verificationHash\` varchar(300) NOT NULL DEFAULT '', \`isVerified\` tinyint NOT NULL DEFAULT 0, \`firstLogin\` tinyint NOT NULL DEFAULT '0', \`type\` tinyint NOT NULL DEFAULT '3', \`villageId\` int NULL, \`countryCode\` varchar(2) NULL, \`positionLat\` decimal(11,8) NOT NULL DEFAULT '0.00000000', \`positionLon\` decimal(11,8) NOT NULL DEFAULT '0.00000000', \`hasStudentLinked\` tinyint NOT NULL DEFAULT 0, UNIQUE INDEX \`IDX_e12875dfb3b1d92d7d7c5377e2\` (\`email\`), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`,
    );
    await queryRunner.query(
      `CREATE TABLE \`game_response\` (\`id\` int NOT NULL AUTO_INCREMENT, \`createDate\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updateDate\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`deleteDate\` datetime(6) NULL, \`userId\` int NOT NULL, \`villageId\` int NOT NULL, \`gameId\` int NOT NULL, \`value\` text NOT NULL, \`isOldResponse\` tinyint NOT NULL DEFAULT 0, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`,
    );
    await queryRunner.query(
      `CREATE TABLE \`game\` (\`id\` int NOT NULL AUTO_INCREMENT, \`createDate\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updateDate\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`deleteDate\` datetime(6) NULL, \`userId\` int NOT NULL, \`villageId\` int NOT NULL, \`activityId\` int NOT NULL, \`type\` tinyint NULL, \`fakeSignification1\` text NOT NULL, \`fakeSignification2\` text NOT NULL, \`origine\` text NOT NULL, \`signification\` text NOT NULL, \`video\` text NOT NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`,
    );
    await queryRunner.query(
      `CREATE TABLE \`activity\` (\`id\` int NOT NULL AUTO_INCREMENT, \`type\` tinyint NOT NULL DEFAULT '0', \`subType\` tinyint NULL, \`phase\` tinyint NOT NULL DEFAULT '1', \`phaseStep\` text NULL, \`status\` tinyint NOT NULL DEFAULT '0', \`createDate\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`publishDate\` datetime NOT NULL, \`updateDate\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`deleteDate\` datetime(6) NULL, \`data\` json NOT NULL, \`content\` json NOT NULL, \`userId\` int NOT NULL, \`villageId\` int NOT NULL, \`responseActivityId\` int NULL, \`responseType\` tinyint NULL, \`isPinned\` tinyint NOT NULL DEFAULT 0, \`displayAsUser\` tinyint NOT NULL DEFAULT 0, \`isVisibleToParent\` tinyint NOT NULL DEFAULT 1, INDEX \`IDX_3571467bcbe021f66e2bdce96e\` (\`userId\`), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`,
    );
    await queryRunner.query(
      `CREATE TABLE \`village\` (\`id\` int NOT NULL AUTO_INCREMENT, \`plmId\` int NULL, \`name\` varchar(80) NOT NULL, \`countryCodes\` text NOT NULL, \`activePhase\` tinyint NOT NULL DEFAULT '1', \`anthemId\` int NULL, UNIQUE INDEX \`REL_bb7b5bf4148f0848111511f52d\` (\`anthemId\`), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`,
    );
    await queryRunner.query(
      `CREATE TABLE \`video\` (\`id\` int NOT NULL, \`name\` varchar(64) NOT NULL, \`userId\` int NOT NULL, \`createDate\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`,
    );
    await queryRunner.query(
      `CREATE TABLE \`pelico_presentation\` (\`id\` int NOT NULL AUTO_INCREMENT, \`content\` json NOT NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`,
    );
    await queryRunner.query(
      `CREATE TABLE \`country\` (\`id\` int NOT NULL AUTO_INCREMENT, \`isoCode\` text NOT NULL, \`name\` text NOT NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`,
    );
    await queryRunner.query(
      `CREATE TABLE \`token\` (\`id\` int NOT NULL AUTO_INCREMENT, \`token\` varchar(300) NOT NULL, \`userId\` int NOT NULL, \`date\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`,
    );
    await queryRunner.query(
      `CREATE TABLE \`analytic_session\` (\`id\` varchar(36) NOT NULL, \`uniqueId\` varchar(20) NOT NULL, \`date\` datetime NOT NULL, \`type\` varchar(8) NOT NULL, \`os\` varchar(20) NOT NULL, \`browserName\` varchar(20) NOT NULL, \`browserVersion\` varchar(20) NOT NULL, \`duration\` smallint UNSIGNED NULL, \`width\` smallint UNSIGNED NOT NULL, \`initialPage\` varchar(255) NOT NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`,
    );
    await queryRunner.query(
      `CREATE TABLE \`analytic_page_view\` (\`id\` int NOT NULL AUTO_INCREMENT, \`sessionId\` varchar(36) NOT NULL, \`date\` datetime NOT NULL, \`page\` varchar(255) NOT NULL, \`referrer\` varchar(255) NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`,
    );
    await queryRunner.query(
      `CREATE TABLE \`analytic_performance\` (\`id\` int NOT NULL AUTO_INCREMENT, \`sessionId\` varchar(36) NOT NULL, \`date\` datetime NOT NULL, \`data\` text NOT NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`,
    );
    await queryRunner.query(
      `CREATE TABLE \`comment\` (\`id\` int NOT NULL AUTO_INCREMENT, \`userId\` int NOT NULL, \`activityId\` int NOT NULL, \`createDate\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updateDate\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`text\` text NOT NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`,
    );
    await queryRunner.query(
      `CREATE TABLE \`user_feature_flags_feature_flag\` (\`userId\` int NOT NULL, \`featureFlagId\` int NOT NULL, INDEX \`IDX_c2f1d484510174d826ecc48c07\` (\`userId\`), INDEX \`IDX_daba3b0a0fca8e9f9b30541dd2\` (\`featureFlagId\`), PRIMARY KEY (\`userId\`, \`featureFlagId\`)) ENGINE=InnoDB`,
    );
    await queryRunner.query(
      `ALTER TABLE \`image\` ADD CONSTRAINT \`FK_dc40417dfa0c7fbd70b8eb880cc\` FOREIGN KEY (\`userId\`) REFERENCES \`user\`(\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE \`image\` ADD CONSTRAINT \`FK_113ef388a86b315ee4f69795802\` FOREIGN KEY (\`villageId\`) REFERENCES \`village\`(\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE \`image\` ADD CONSTRAINT \`FK_21b660ac3034e8cd7e2f343a9c4\` FOREIGN KEY (\`activityId\`) REFERENCES \`activity\`(\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE \`classroom\` ADD CONSTRAINT \`FK_6f2187911a8faba7c91a83194d9\` FOREIGN KEY (\`userId\`) REFERENCES \`user\`(\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE \`classroom\` ADD CONSTRAINT \`FK_ce22c442aec315cd3aa13b69210\` FOREIGN KEY (\`villageId\`) REFERENCES \`village\`(\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE \`student\` ADD CONSTRAINT \`FK_426224f5597213259b1d58fc0f4\` FOREIGN KEY (\`classroomId\`) REFERENCES \`classroom\`(\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE \`user_to_student\` ADD CONSTRAINT \`FK_c4a67eb239df56e50679e238eec\` FOREIGN KEY (\`userId\`) REFERENCES \`user\`(\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE \`user_to_student\` ADD CONSTRAINT \`FK_39299bddd62684b6bf55a7a8aec\` FOREIGN KEY (\`studentId\`) REFERENCES \`student\`(\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE \`user\` ADD CONSTRAINT \`FK_2583b4710ea9710eedddb3e7e9f\` FOREIGN KEY (\`villageId\`) REFERENCES \`village\`(\`id\`) ON DELETE SET NULL ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE \`game_response\` ADD CONSTRAINT \`FK_472d93272998bbe1f47ababe76b\` FOREIGN KEY (\`userId\`) REFERENCES \`user\`(\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE \`game_response\` ADD CONSTRAINT \`FK_c2ac9c3907457e9ca456ec6ef98\` FOREIGN KEY (\`villageId\`) REFERENCES \`village\`(\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE \`game_response\` ADD CONSTRAINT \`FK_3a0c737a217bbd6bbd268203fb8\` FOREIGN KEY (\`gameId\`) REFERENCES \`game\`(\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE \`game\` ADD CONSTRAINT \`FK_a8106c0a84d70ecfc3358301c54\` FOREIGN KEY (\`userId\`) REFERENCES \`user\`(\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE \`game\` ADD CONSTRAINT \`FK_da0ecad97069e6dd256857358a7\` FOREIGN KEY (\`villageId\`) REFERENCES \`village\`(\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE \`game\` ADD CONSTRAINT \`FK_eb424044e76957a3b9f814067f3\` FOREIGN KEY (\`activityId\`) REFERENCES \`activity\`(\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE \`activity\` ADD CONSTRAINT \`FK_3571467bcbe021f66e2bdce96ea\` FOREIGN KEY (\`userId\`) REFERENCES \`user\`(\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE \`activity\` ADD CONSTRAINT \`FK_cc60a5bb15f6d08a21e5b7ef27b\` FOREIGN KEY (\`villageId\`) REFERENCES \`village\`(\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE \`activity\` ADD CONSTRAINT \`FK_4913eed2cc74630efeba1114358\` FOREIGN KEY (\`responseActivityId\`) REFERENCES \`activity\`(\`id\`) ON DELETE SET NULL ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE \`village\` ADD CONSTRAINT \`FK_bb7b5bf4148f0848111511f52df\` FOREIGN KEY (\`anthemId\`) REFERENCES \`activity\`(\`id\`) ON DELETE SET NULL ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE \`video\` ADD CONSTRAINT \`FK_74e27b13f8ac66f999400df12f6\` FOREIGN KEY (\`userId\`) REFERENCES \`user\`(\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE \`analytic_page_view\` ADD CONSTRAINT \`FK_f60b860e3691b49e597854bc284\` FOREIGN KEY (\`sessionId\`) REFERENCES \`analytic_session\`(\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE \`analytic_performance\` ADD CONSTRAINT \`FK_b4ae11c38897a5fbe83c6359ef7\` FOREIGN KEY (\`sessionId\`) REFERENCES \`analytic_session\`(\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE \`comment\` ADD CONSTRAINT \`FK_43edbd83eb91401b157f9895ea5\` FOREIGN KEY (\`activityId\`) REFERENCES \`activity\`(\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE \`comment\` ADD CONSTRAINT \`FK_c0354a9a009d3bb45a08655ce3b\` FOREIGN KEY (\`userId\`) REFERENCES \`user\`(\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE \`user_feature_flags_feature_flag\` ADD CONSTRAINT \`FK_c2f1d484510174d826ecc48c071\` FOREIGN KEY (\`userId\`) REFERENCES \`user\`(\`id\`) ON DELETE CASCADE ON UPDATE CASCADE`,
    );
    await queryRunner.query(
      `ALTER TABLE \`user_feature_flags_feature_flag\` ADD CONSTRAINT \`FK_daba3b0a0fca8e9f9b30541dd26\` FOREIGN KEY (\`featureFlagId\`) REFERENCES \`feature_flag\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE \`user_feature_flags_feature_flag\` DROP FOREIGN KEY \`FK_daba3b0a0fca8e9f9b30541dd26\``);
    await queryRunner.query(`ALTER TABLE \`user_feature_flags_feature_flag\` DROP FOREIGN KEY \`FK_c2f1d484510174d826ecc48c071\``);
    await queryRunner.query(`ALTER TABLE \`comment\` DROP FOREIGN KEY \`FK_c0354a9a009d3bb45a08655ce3b\``);
    await queryRunner.query(`ALTER TABLE \`comment\` DROP FOREIGN KEY \`FK_43edbd83eb91401b157f9895ea5\``);
    await queryRunner.query(`ALTER TABLE \`analytic_performance\` DROP FOREIGN KEY \`FK_b4ae11c38897a5fbe83c6359ef7\``);
    await queryRunner.query(`ALTER TABLE \`analytic_page_view\` DROP FOREIGN KEY \`FK_f60b860e3691b49e597854bc284\``);
    await queryRunner.query(`ALTER TABLE \`video\` DROP FOREIGN KEY \`FK_74e27b13f8ac66f999400df12f6\``);
    await queryRunner.query(`ALTER TABLE \`village\` DROP FOREIGN KEY \`FK_bb7b5bf4148f0848111511f52df\``);
    await queryRunner.query(`ALTER TABLE \`activity\` DROP FOREIGN KEY \`FK_4913eed2cc74630efeba1114358\``);
    await queryRunner.query(`ALTER TABLE \`activity\` DROP FOREIGN KEY \`FK_cc60a5bb15f6d08a21e5b7ef27b\``);
    await queryRunner.query(`ALTER TABLE \`activity\` DROP FOREIGN KEY \`FK_3571467bcbe021f66e2bdce96ea\``);
    await queryRunner.query(`ALTER TABLE \`game\` DROP FOREIGN KEY \`FK_eb424044e76957a3b9f814067f3\``);
    await queryRunner.query(`ALTER TABLE \`game\` DROP FOREIGN KEY \`FK_da0ecad97069e6dd256857358a7\``);
    await queryRunner.query(`ALTER TABLE \`game\` DROP FOREIGN KEY \`FK_a8106c0a84d70ecfc3358301c54\``);
    await queryRunner.query(`ALTER TABLE \`game_response\` DROP FOREIGN KEY \`FK_3a0c737a217bbd6bbd268203fb8\``);
    await queryRunner.query(`ALTER TABLE \`game_response\` DROP FOREIGN KEY \`FK_c2ac9c3907457e9ca456ec6ef98\``);
    await queryRunner.query(`ALTER TABLE \`game_response\` DROP FOREIGN KEY \`FK_472d93272998bbe1f47ababe76b\``);
    await queryRunner.query(`ALTER TABLE \`user\` DROP FOREIGN KEY \`FK_2583b4710ea9710eedddb3e7e9f\``);
    await queryRunner.query(`ALTER TABLE \`user_to_student\` DROP FOREIGN KEY \`FK_39299bddd62684b6bf55a7a8aec\``);
    await queryRunner.query(`ALTER TABLE \`user_to_student\` DROP FOREIGN KEY \`FK_c4a67eb239df56e50679e238eec\``);
    await queryRunner.query(`ALTER TABLE \`student\` DROP FOREIGN KEY \`FK_426224f5597213259b1d58fc0f4\``);
    await queryRunner.query(`ALTER TABLE \`classroom\` DROP FOREIGN KEY \`FK_ce22c442aec315cd3aa13b69210\``);
    await queryRunner.query(`ALTER TABLE \`classroom\` DROP FOREIGN KEY \`FK_6f2187911a8faba7c91a83194d9\``);
    await queryRunner.query(`ALTER TABLE \`image\` DROP FOREIGN KEY \`FK_21b660ac3034e8cd7e2f343a9c4\``);
    await queryRunner.query(`ALTER TABLE \`image\` DROP FOREIGN KEY \`FK_113ef388a86b315ee4f69795802\``);
    await queryRunner.query(`ALTER TABLE \`image\` DROP FOREIGN KEY \`FK_dc40417dfa0c7fbd70b8eb880cc\``);
    await queryRunner.query(`DROP INDEX \`IDX_daba3b0a0fca8e9f9b30541dd2\` ON \`user_feature_flags_feature_flag\``);
    await queryRunner.query(`DROP INDEX \`IDX_c2f1d484510174d826ecc48c07\` ON \`user_feature_flags_feature_flag\``);
    await queryRunner.query(`DROP TABLE \`user_feature_flags_feature_flag\``);
    await queryRunner.query(`DROP TABLE \`comment\``);
    await queryRunner.query(`DROP TABLE \`analytic_performance\``);
    await queryRunner.query(`DROP TABLE \`analytic_page_view\``);
    await queryRunner.query(`DROP TABLE \`analytic_session\``);
    await queryRunner.query(`DROP TABLE \`token\``);
    await queryRunner.query(`DROP TABLE \`country\``);
    await queryRunner.query(`DROP TABLE \`pelico_presentation\``);
    await queryRunner.query(`DROP TABLE \`video\``);
    await queryRunner.query(`DROP INDEX \`REL_bb7b5bf4148f0848111511f52d\` ON \`village\``);
    await queryRunner.query(`DROP TABLE \`village\``);
    await queryRunner.query(`DROP INDEX \`IDX_3571467bcbe021f66e2bdce96e\` ON \`activity\``);
    await queryRunner.query(`DROP TABLE \`activity\``);
    await queryRunner.query(`DROP TABLE \`game\``);
    await queryRunner.query(`DROP TABLE \`game_response\``);
    await queryRunner.query(`DROP INDEX \`IDX_e12875dfb3b1d92d7d7c5377e2\` ON \`user\``);
    await queryRunner.query(`DROP TABLE \`user\``);
    await queryRunner.query(`DROP TABLE \`user_to_student\``);
    await queryRunner.query(`DROP TABLE \`student\``);
    await queryRunner.query(`DROP INDEX \`REL_6f2187911a8faba7c91a83194d\` ON \`classroom\``);
    await queryRunner.query(`DROP TABLE \`classroom\``);
    await queryRunner.query(`DROP TABLE \`image\``);
    await queryRunner.query(`DROP INDEX \`IDX_0cb1810eca363db1e0bf13c3cf\` ON \`feature_flag\``);
    await queryRunner.query(`DROP TABLE \`feature_flag\``);
  }
}

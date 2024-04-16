import type { MigrationInterface, QueryRunner } from 'typeorm';

export class CountryUserRelation1713256151738 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    // updating table user to add FK on country
    await queryRunner.query(`ALTER TABLE user
            ADD COLUMN country_id INT;`);
    // updating table user to add FK on country
    await queryRunner.query(`ALTER TABLE user
            ADD CONSTRAINT fk_user_country FOREIGN KEY (country_id)
            REFERENCES country(id);`);
    // updating all users to set them their new country relation
    await queryRunner.query(`UPDATE user u
            INNER JOIN country c ON u.countryCode = c.isoCode
            SET u.country_id = c.id;`);
    // dropping countryCode comumn
    await queryRunner.dropColumn('user', 'countryCode');
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // Add countryCode column
    await queryRunner.query(`ALTER TABLE user
            ADD COLUMN countryCode TINYTEXT;`);
    // updating all users to set them their countryCode base on relation
    await queryRunner.query(`UPDATE user u
            INNER JOIN country c ON u.country_id = c.id
            SET u.countryCode = c.isoCode;`);
    // dropping countryCode comumn
    await queryRunner.dropForeignKey('user', 'fk_user_country');
    await queryRunner.dropColumn('user', 'country_id');
  }
}

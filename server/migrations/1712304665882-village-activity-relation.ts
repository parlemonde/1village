import type { MigrationInterface, QueryRunner } from 'typeorm';

export class VillageActivityRelation1712304665882 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    try {
      const activityTable = await queryRunner.getTable('activity');
      const villageTable = await queryRunner.getTable('village');
      if (!activityTable || !villageTable) {
        throw new Error('activity/village table does not exist ');
      }
      // get activity - village relation data
      const activityData: { id: number; villageId: number | null }[] = await queryRunner.query('SELECT id, villageId FROM activity');
      //   console.warn(activityData);
      const VILLAGE_ACTIVITY = 'village_activity';
      // create village_activity table
      await queryRunner.query(`CREATE TABLE ${VILLAGE_ACTIVITY}(
              id INT NOT NULL AUTO_INCREMENT,
              villageId INT NOT NULL,
              activityId INT NOT NULL,
              PRIMARY KEY (id), 
              FOREIGN KEY (villageId) REFERENCES village(id), 
              FOREIGN KEY (activityId) REFERENCES activity(id) 
            );`);
      // add current relation village - activity to new relation table
      for (const activity of activityData) {
        if (activity.villageId) {
          await queryRunner.query(`INSERT INTO ${VILLAGE_ACTIVITY}(villageId, activityId) VALUES (${activity.villageId}, ${activity.id})`);
        }
      }
      // delete villageId column
      const villageIdForeignKey = activityTable?.foreignKeys.find(
        (fk) => fk.columnNames.includes('villageId') && fk.referencedColumnNames.includes('id'),
      )?.name;
      if (villageIdForeignKey) {
        await queryRunner.query(`ALTER TABLE activity DROP FOREIGN KEY ${villageIdForeignKey}`);
        await queryRunner.query(`ALTER TABLE activity DROP COLUMN villageId`);
      }
    } catch (error) {
      console.error(error);
      throw error;
    }
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    try {
      // WARNING: revert will cause the lost of data (relation between activity and villages)
      console.warn('Data will be lost during this operation');
      const villageActivityTable = await queryRunner.getTable('village_activity');
      if (villageActivityTable) {
        await queryRunner.dropTable('village_activity');
      }
      // delete relation table village - activity

      await queryRunner.query(`
              ALTER TABLE activity
              ADD COLUMN villageId INT,
              ADD FOREIGN KEY (villageId) REFERENCES village (id);
              `);
    } catch (error) {
      console.error(error);
      throw error;
    }
  }
}

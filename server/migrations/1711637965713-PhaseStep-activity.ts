import type { MigrationInterface, QueryRunner } from 'typeorm';

export class PhaseStepActivity1711637965713 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    const activityTable = await queryRunner.getTable('activity');
    if (activityTable) {
      if (!activityTable.findColumnByName('phaseStep')) {
        await queryRunner.query(`ALTER TABLE ${activityTable.name} ADD phaseStep TEXT`);
      }
    }
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    const activityTable = await queryRunner.getTable('activity');
    if (activityTable) {
      if (activityTable.findColumnByName('phaseStep')) {
        await queryRunner.query(`ALTER TABLE ${activityTable.name} DROP COLUMN phaseStep`);
      }
    }
  }
}

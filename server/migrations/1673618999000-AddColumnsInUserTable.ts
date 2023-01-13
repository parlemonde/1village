import type { MigrationInterface, QueryRunner } from 'typeorm';
import { TableColumn } from 'typeorm';

export class AddColumnsInUserTable1673618999000 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.addColumns('user', [
      new TableColumn({
        name: 'firstname',
        type: 'varchar',
        length: '50',
        default: '""',
      }),
      new TableColumn({
        name: 'lastname',
        type: 'varchar',
        length: '100',
        default: '""',
      }),
    ]);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropColumns('user', ['firstname', 'lastname']);
  }
}

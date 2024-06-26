import type { MigrationInterface, QueryRunner } from 'typeorm';

export class UserRelationInAnalyticSession1719401311922 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.addColumn(
      'AnalyticSession',
      new TableColumn({
        name: 'userId',
        type: 'int',
        isNullable: true,
      }),
    );

    await queryRunner.createForeignKey(
      'AnalyticSession',
      new TableForeignKey({
        columnNames: ['userId'],
        referencedColumnNames: ['id'],
        referencedTableName: 'User',
        onDelete: 'CASCADE',
      }),
    );

    await queryRunner.dropColumn('AnalyticSession', 'uniqueId');
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.addColumn(
      'AnalyticSession',
      new TableColumn({
        name: 'uniqueId',
        type: 'varchar',
        length: '20',
        isNullable: false,
      }),
    );

    const table = await queryRunner.getTable('AnalyticSession');
    const foreignKey = table.foreignKeys.find((fk) => fk.columnNames.indexOf('userId') !== -1);
    await queryRunner.dropForeignKey('AnalyticSession', foreignKey);

    await queryRunner.dropColumn('AnalyticSession', 'userId');
  }
}

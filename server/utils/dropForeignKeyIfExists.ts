import type { QueryRunner } from 'typeorm';

export async function dropForeignKeyIfExists(queryRunner: QueryRunner, tableName: string, columnName: string): Promise<void> {
    const table = await queryRunner.getTable(tableName);
    if (table) {
        const foreignKey = table.foreignKeys.find((fk) => fk.columnNames.indexOf(columnName) !== -1);
        if (foreignKey) {
            await queryRunner.dropForeignKey(tableName, foreignKey);
        }
    }
}

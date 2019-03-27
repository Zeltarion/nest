import { MigrationInterface, QueryRunner, Table, TableColumn, TableForeignKey } from 'typeorm';

export class ChangeStatusOfTaskTable1552991005381 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.createTable(new Table({
            name: 'taskStatus',
            columns: [
                {
                    name: 'id',
                    type: 'int',
                    isGenerated: true,
                    isPrimary: true,
                },
                {
                    name: 'name',
                    type: 'varchar',
                    length: '255',
                    isUnique: true,
                    isNullable: false,
                },
            ],
            engine: 'InnoDB',
        }), true);

        await queryRunner.query(`ALTER TABLE "taskStatus"
        ADD COLUMN "createdAt" TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
        ADD COLUMN "updatedAt" TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP`);

        await queryRunner.changeColumn('task', new TableColumn({
            name: 'status',
            type: 'boolean',
        }), new TableColumn({
            name: 'statusId',
            type: 'int',
        }));

        await queryRunner.createForeignKey('task', new TableForeignKey({
            name: 'task_statusId_seq',
            columnNames: ['statusId'],
            referencedColumnNames: ['id'],
            referencedTableName: 'taskStatus',
            onDelete: 'SET NULL',
        }));
    }

    public async down(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.dropForeignKey('task', 'task_statusId_seq');
        await queryRunner.dropTable('taskStatus');
        await queryRunner.changeColumn('task', new TableColumn({
            name: 'statusId',
            type: 'int',
        }), new TableColumn({
            name: 'status',
            type: 'boolean',
        }));
    }

}

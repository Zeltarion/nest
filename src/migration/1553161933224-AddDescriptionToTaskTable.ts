import { MigrationInterface, QueryRunner, TableColumn } from 'typeorm';

export class AddDescriptionToTaskTable1553161933224 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.addColumn('task', new TableColumn({
            name: 'description',
            type: 'text',
            isNullable: true,
        }));
    }

    public async down(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.dropColumn('task', 'description');
    }
}

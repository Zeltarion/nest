import {MigrationInterface, QueryRunner} from 'typeorm';

export class AddStatusesToTaskStatusesTable1553018738379 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.connection
          .createQueryBuilder()
          .insert()
          .into('taskStatus', ['id', 'name'])
          .values([
            { id: 1, name: 'to do' },
            { id: 2, name: 'in progress' },
            { id: 3, name: 'ready for qa' },
            { id: 4, name: 'done' },
          ])
          .execute();
    }

    public async down(queryRunner: QueryRunner): Promise<any> {
      await queryRunner.query(`TRUNCATE TABLE "taskStatus" CASCADE`);
    }

}

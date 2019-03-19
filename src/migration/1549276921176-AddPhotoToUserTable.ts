import {MigrationInterface, QueryRunner, TableColumn} from 'typeorm';

export class AddAvatarToUserTable1549276921176 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<any> {
      await queryRunner.addColumn('user', new TableColumn({
        name: 'avatar',
        type: 'varchar',
        length: '100',
        isNullable: true,
      }));
    }

    public async down(queryRunner: QueryRunner): Promise<any> {
      await queryRunner.dropColumn('user', 'avatar');
    }

}

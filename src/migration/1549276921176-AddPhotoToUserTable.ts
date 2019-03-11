import {MigrationInterface, QueryRunner, TableColumn} from 'typeorm';

export class AddPhotoToUserTable1549276921176 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<any> {
      await queryRunner.addColumn('users', new TableColumn({
        name: 'photo',
        type: 'varchar',
        length: '100',
        isNullable: true,
      }));
    }

    public async down(queryRunner: QueryRunner): Promise<any> {
      await queryRunner.dropColumn('users', 'photo');
    }

}

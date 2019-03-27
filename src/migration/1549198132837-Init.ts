import {MigrationInterface, QueryRunner, Table, TableIndex} from 'typeorm';

export class Init1549198132837 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<any> {
      await queryRunner.createTable(new Table({
        name: 'user',
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
            isNullable: true,
          },
          {
            name: 'email',
            type: 'varchar',
            length: '255',
            isUnique: true,
          },
          {
            name: 'firstName',
            type: 'varchar',
            length: '255',
            default: `''`,
          },
          {
            name: 'lastName',
            type: 'varchar',
            length: '255',
            default: `''`,
          },
          {
            name: 'password',
            type: 'varchar',
            length: '255',
          },
          {
            name: 'phone',
            type: 'varchar',
            length: '255',
            isUnique: true,
            isNullable: true,
          },
        ],
        engine: 'InnoDB',
      }), true);

      await queryRunner.query(`ALTER TABLE "user"
        ADD COLUMN "createdAt" TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
        ADD COLUMN "updatedAt" TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP`);

      await queryRunner.createIndex('user', new TableIndex({
        name: 'user_fname_sname_idx',
        columnNames: ['firstName', 'lastName'],
      }));

      await queryRunner.createTable(new Table({
        name: 'board',
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
          },
        ],
      }), true);

      await queryRunner.query(`ALTER TABLE "board"
        ADD COLUMN "createdAt" TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
        ADD COLUMN "updatedAt" TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP`);

      await queryRunner.createTable(new Table({
        name: 'userBoard',
        columns: [
          {
            name: 'id',
            type: 'int',
            isGenerated: true,
            isPrimary: true,
          },
          {
            name: 'boardId',
            type: 'int',
          },
          {
            name: 'userId',
            type: 'int',
          },
        ],
        foreignKeys: [
          {
            name: 'userBoard_userId_seq',
            columnNames: ['userId'],
            referencedTableName: 'user',
            referencedColumnNames: ['id'],
            onDelete: 'CASCADE',
          },
          {
            name: 'userBoard_boardId_seq',
            columnNames: ['boardId'],
            referencedTableName: 'board',
            referencedColumnNames: ['id'],
            onDelete: 'CASCADE',
          },
        ],
        engine: 'InnoDB',
      }), true);

      await queryRunner.query(`ALTER TABLE "userBoard"
        ADD COLUMN "createdAt" TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
        ADD COLUMN "updatedAt" TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP`);

      await queryRunner.createTable(new Table({
        name: 'task',
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
          },
          {
            name: 'status',
            type: 'boolean',
          },
          {
            name: 'ownerId',
            type: 'int',
          },
          {
            name: 'userId',
            type: 'int',
          },
          {
            name: 'boardId',
            type: 'int',
          },
        ],
        foreignKeys: [
          {
            name: 'task_ownerId_seq',
            columnNames: ['ownerId'],
            referencedTableName: 'user',
            referencedColumnNames: ['id'],
            onDelete: 'SET NULL',
          },
          {
            name: 'task_userId_seq',
            columnNames: ['userId'],
            referencedTableName: 'user',
            referencedColumnNames: ['id'],
            onDelete: 'SET NULL',
          },
          {
            name: 'task_boardId_seq',
            columnNames: ['boardId'],
            referencedTableName: 'board',
            referencedColumnNames: ['id'],
            onDelete: 'CASCADE',
          },
        ],
        engine: 'InnoDB',
      }), true);

      await queryRunner.query(`ALTER TABLE "task"
        ADD COLUMN "createdAt" TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
        ADD COLUMN "updatedAt" TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP`);

      await queryRunner.createTable(new Table({
        name: 'task-comment',
        columns: [
          {
            name: 'id',
            type: 'int',
            isGenerated: true,
            isPrimary: true,
          },
          {
            name: 'taskId',
            type: 'int',
          },
          {
            name: 'userId',
            type: 'int',
          },
          {
            name: 'title',
            type: 'varchar',
            length: '255',
          },
          {
            name: 'comment',
            type: 'text',
          },
        ],
        foreignKeys: [
          {
            name: 'taskComment_taskId_seq',
            columnNames: ['taskId'],
            referencedTableName: 'task',
            referencedColumnNames: ['id'],
            onDelete: 'CASCADE',
          },
          {
            name: 'taskComment_userId_seq',
            columnNames: ['userId'],
            referencedTableName: 'user',
            referencedColumnNames: ['id'],
            onDelete: 'SET NULL',
          },
        ],
        engine: 'InnoDB',
      }), true);

      await queryRunner.query(`ALTER TABLE "taskComment"
        ADD COLUMN "createdAt" TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
        ADD COLUMN "updatedAt" TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP`);
    }

    public async down(queryRunner: QueryRunner): Promise<any> {
      await queryRunner.dropForeignKey('task-comment', 'taskComment_taskId_seq');
      await queryRunner.dropForeignKey('task-comment', 'taskComment_userId_seq');
      await queryRunner.dropForeignKey('task', 'task_ownerId_seq');
      await queryRunner.dropForeignKey('task', 'task_userId_seq');
      await queryRunner.dropForeignKey('userBoard', 'userBoard_userId_seq');

      await queryRunner.dropTable('task-comment');
      await queryRunner.dropTable('task');
      await queryRunner.dropTable('userBoard');
      await queryRunner.dropTable('board');
      await queryRunner.dropTable('user');
    }

}

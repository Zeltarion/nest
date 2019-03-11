import {MigrationInterface, QueryRunner, Table, TableIndex} from 'typeorm';

export class Init1549198132837 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<any> {
      await queryRunner.createTable(new Table({
        name: 'users',
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
            name: 'first_name',
            type: 'varchar',
            length: '255',
            default: `''`,
          },
          {
            name: 'last_name',
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

      await queryRunner.query(`ALTER TABLE users
        ADD COLUMN "createdAt" TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
        ADD COLUMN "updatedAt" TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP`);

      await queryRunner.createIndex('users', new TableIndex({
        name: 'users_fname_sname_idx',
        columnNames: ['first_name', 'last_name'],
      }));

      await queryRunner.createTable(new Table({
        name: 'boards',
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

      await queryRunner.query(`ALTER TABLE boards
        ADD COLUMN "createdAt" TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
        ADD COLUMN "updatedAt" TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP`);

      await queryRunner.createTable(new Table({
        name: 'users_boards',
        columns: [
          {
            name: 'id',
            type: 'int',
            isGenerated: true,
            isPrimary: true,
          },
          {
            name: 'board_id',
            type: 'int',
          },
          {
            name: 'user_id',
            type: 'int',
          },
        ],
        foreignKeys: [
          {
            name: 'usersBoards_userId_seq',
            columnNames: ['user_id'],
            referencedTableName: 'users',
            referencedColumnNames: ['id'],
            onDelete: 'SET NULL',
          },
        ],
        engine: 'InnoDB',
      }), true);

      await queryRunner.query(`ALTER TABLE users_boards
        ADD COLUMN "createdAt" TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
        ADD COLUMN "updatedAt" TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP`);

      await queryRunner.createTable(new Table({
        name: 'tasks',
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
            name: 'owner_id',
            type: 'int',
          },
          {
            name: 'user_id',
            type: 'int',
          },
        ],
        foreignKeys: [
          {
            name: 'tasks_ownerId_seq',
            columnNames: ['owner_id'],
            referencedTableName: 'users',
            referencedColumnNames: ['id'],
            onDelete: 'SET NULL',
          },
          {
            name: 'tasks_userId_seq',
            columnNames: ['user_id'],
            referencedTableName: 'users',
            referencedColumnNames: ['id'],
            onDelete: 'SET NULL',
          },
        ],
        engine: 'InnoDB',
      }), true);

      await queryRunner.query(`ALTER TABLE tasks
        ADD COLUMN "createdAt" TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
        ADD COLUMN "updatedAt" TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP`);

      await queryRunner.createTable(new Table({
        name: 'task_comments',
        columns: [
          {
            name: 'id',
            type: 'int',
            isGenerated: true,
            isPrimary: true,
          },
          {
            name: 'task_id',
            type: 'int',
          },
          {
            name: 'user_id',
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
            name: 'taskComments_taskId_seq',
            columnNames: ['task_id'],
            referencedTableName: 'tasks',
            referencedColumnNames: ['id'],
            onDelete: 'SET NULL',
          },
          {
            name: 'comments_userId_seq',
            columnNames: ['user_id'],
            referencedTableName: 'users',
            referencedColumnNames: ['id'],
            onDelete: 'SET NULL',
          },
        ],
        engine: 'InnoDB',
      }), true);

      await queryRunner.query(`ALTER TABLE task_comments
        ADD COLUMN "createdAt" TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
        ADD COLUMN "updatedAt" TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP`);
    }

    public async down(queryRunner: QueryRunner): Promise<any> {
      await queryRunner.dropForeignKey('task_comments', 'taskComments_taskId_seq');
      await queryRunner.dropForeignKey('task_comments', 'comments_userId_seq');
      await queryRunner.dropForeignKey('tasks', 'tasks_ownerId_seq');
      await queryRunner.dropForeignKey('tasks', 'tasks_userId_seq');
      await queryRunner.dropForeignKey('users_boards', 'usersBoards_userId_seq');

      await queryRunner.dropTable('task_comments');
      await queryRunner.dropTable('tasks');
      await queryRunner.dropTable('users_boards');
      await queryRunner.dropTable('boards');
      await queryRunner.dropTable('users');
    }

}

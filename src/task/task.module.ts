import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TaskService } from './task.service';
import { BoardService } from '../board/board.service';
import { UserService } from '../user/user.service';
import { TaskController } from './task.controller';
import { Task } from './task.entity';
import { User } from '../user/user.entity';
import { Board } from '../board/board.entity';
import { TaskStatus } from '../task-status/task-status.entity';
import { CoreModule } from '../core/core.module';
import { BoardModule } from '../board/board.module';
import { UserModule } from '../user/user.module';
import { TaskStatusModule } from '../task-status/task-status.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Task, Board, User, TaskStatus]),
    CoreModule,
  ],
  providers: [TaskService, BoardService, UserService],
  exports: [TaskService],
  controllers: [TaskController],
})
export class TaskModule { }

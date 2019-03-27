import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Task } from '../task/task.entity';
import { User } from '../user/user.entity';
import { Board } from '../board/board.entity';
import { TaskStatus } from './task-status.entity';
import { CoreModule } from '../core/core.module';
import { TaskService } from '../task/task.service';
import { TaskController } from '../task/task.controller';

@Module({
  imports: [
    TypeOrmModule.forFeature([Task, User, Board, TaskStatus]),
    CoreModule,
  ],
  providers: [],
  exports: [],
  controllers: [],
})
export class TaskStatusModule {}

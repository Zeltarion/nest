import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BoardService } from './board.service';
import { BoardController } from './board.controller';
import { Board } from './board.entity';
import { User } from '../user/user.entity';
import { CoreModule } from '../core/core.module';
import { TaskModule } from '../task/task.module';
import { TaskService } from '../task/task.service';
import { Task } from '../task/task.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Board, Task, User]),
    CoreModule,
    TaskModule,
  ],
  providers: [BoardService, TaskService],
  exports: [BoardService],
  controllers: [BoardController],
})
export class BoardModule { }

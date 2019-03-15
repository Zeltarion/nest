import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BoardService } from './board.service';
import { BoardController } from './board.controller';
import { Board } from './board.entity';
import { User } from '../user/user.entity';
import { CoreModule } from '../core/core.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Board, User]),
    CoreModule,
  ],
  providers: [BoardService],
  exports: [BoardService],
  controllers: [BoardController],
})
export class BoardModule { }

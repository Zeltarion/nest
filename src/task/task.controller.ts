import {
  Get,
  Controller,
  Post,
  UseGuards,
  Body,
  Param,
  Delete,
  Put,
  HttpCode,
  HttpException,
  HttpStatus,
  ClassSerializerInterceptor,
  UseInterceptors,
  Req,
  Query,
  FileInterceptor,
  UploadedFile,
  Headers,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

import { Task } from './task.entity';
import { TaskService } from './task.service';
import { BoardService } from '../board/board.service';
import { UserService } from '../user/user.service';
import { CreateTaskDto } from './dto/create-task.dto';
import { FilterTaskDto } from './dto/filter-task.dto';
import { UploadFileDto } from '../common/dto/uploadfile.dto';

@Controller('')
@UseInterceptors(ClassSerializerInterceptor)
export class TaskController {

  constructor(
    private readonly taskService: TaskService,
    private readonly boardService: BoardService,
    private readonly userService: UserService) {
  }

  @Get('/:id')
  @UseGuards(AuthGuard('jwt'))
  async get(@Param() params): Promise<Task | {}> {
    const { id } = params;
    return this.taskService.findById(id);
  }

  @Post('')
  @UseGuards(AuthGuard('jwt'))
  async create(@Body() taskDto: CreateTaskDto, @Req() req): Promise<Task> {
    const params = {
      ...taskDto,
    };
    const ownerId = req.user.id;
    const board = await this.boardService.findById(params.boardId);
    if (!board) {
      throw new HttpException('Can\'t find board with this id', HttpStatus.BAD_REQUEST);
    }

    const user = await this.userService.findById(params.userId);
    if (!user) {
      throw new HttpException('Can\'t find user with this id', HttpStatus.BAD_REQUEST);
    }

    return this.taskService.create(taskDto, user, board, ownerId);
  }

  @Delete('/:id')
  @HttpCode(204)
  @UseGuards(AuthGuard('jwt'))
  async remove(@Param('id') taskId: number): Promise<any> {
    return this.taskService.remove(taskId);
  }
}

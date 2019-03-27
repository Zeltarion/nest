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

import { Board } from './board.entity';
import { BoardService } from './board.service';
import { TaskService } from '../task/task.service';
import { CreateBoardDto } from './dto/create-board.dto';
import { FilterBoardDto } from './dto/filter-board.dto';

@Controller('')
@UseInterceptors(ClassSerializerInterceptor)
export class BoardController {

  constructor(
    private readonly boardService: BoardService,
    private readonly taskService: TaskService) {
  }

  @Get()
  @UseGuards(AuthGuard('jwt'))
  async fetchAll(@Query() query: FilterBoardDto): Promise<any/*ResponseBoardsDto*/> {
    return this.boardService.findAll(query);
  }

  @Get('/:id/task')
  @UseGuards(AuthGuard('jwt'))
  async getBoardTasks(@Param() params, @Query() query: FilterBoardDto): Promise<any/*ResponseBoardsDto*/> {
    const { id } = params;
    return this.taskService.findBoardTasks(id, query);
  }

  @Get('/:id')
  @UseGuards(AuthGuard('jwt'))
  async get(@Param() params): Promise<Board | {}> {
    const { id } = params;
    const board = await this.boardService.findById(id);
    return board || {};
  }

  @Post('')
  async create(@Body() boardDto: CreateBoardDto): Promise<Board> {
    return this.boardService.create(boardDto);
  }

  // @Put('/:id')
  // @UseGuards(AuthGuard('jwt'))
  // @ApiBearerAuth()
  // @ApiOperation({ title: 'Update an existing user' })
  // @ApiResponse({ status: 200, type: ResponseUserInfoDto })
  // async update(@Body() userDto: UpdateUserDto, @Param('id') userId: number): Promise<User> {
  //   const user = await this.userService.findById(userId);
  //   if (!user) { throw new HttpException('Can\'t find user with this id', HttpStatus.BAD_REQUEST); }
  //   return this.userService.update(userDto);
  // }
  //
  @Delete('/:id')
  @HttpCode(204)
  @UseGuards(AuthGuard('jwt'))
  async remove(@Param('id') boardId: number): Promise<any> {
    return this.boardService.remove(boardId);
  }
}

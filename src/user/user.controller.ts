import {
  Get,
  Controller,
  Post,
  Patch,
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

import { User } from './user.entity';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { FileService } from '../core/file.service';
import { UploadFileDto } from '../common/dto/uploadfile.dto';
import { FileLinkDto } from '../common/dto/filelink.dto';
import { UpdateUserDto } from './dto/update-user.dto';
// import { FilterUserDto } from './dto/filter-user.dto';
// import { ResponseUserDto } from './dto/response-fetch-all-user.dto';
// import { ResponseUserInfoDto } from './dto/response-user.dto';
// import { UserResetPasswordService } from 'user-reset-password/user-reset-password.service';

@Controller('')
@UseInterceptors(ClassSerializerInterceptor)
export class UserController {

  constructor(
    private readonly userService: UserService,
    private readonly fileService: FileService) {
  }

  // @Get()
  // @UseGuards(AuthGuard('jwt'))
  // @ApiBearerAuth()
  // @ApiOperation({ title: 'Get all users' })
  // @ApiResponse({ status: 200, type: ResponseUserDto, isArray: true })
  // async fetchAll(@Query() query: FilterUserDto): Promise<ResponseUserDto> {
  //   return this.userService.filterUsers(query);
  // }

  @Get('/me')
  @UseGuards(AuthGuard('jwt'))
  async fetchUserByToken(@Req() req): Promise<User> {
    const { id } = req.user;
    return this.userService.findById(id);
  }
  // @Get('/:id')
  // @UseGuards(AuthGuard('jwt'))
  // @ApiBearerAuth()
  // @ApiOperation({ title: 'Get user by id' })
  // @ApiResponse({ status: 200, type: ResponseUserInfoDto })
  // async fetchUserById(@Param('id') userId: number): Promise<User> {
  //   const user = await this.userService.findById(userId);
  //   if (!user) { throw new HttpException('Can\'t find user with this id', HttpStatus.BAD_REQUEST); }
  //   return user;
  // }

  @Post()
  async create(@Body() userDto: CreateUserDto, @Headers('origin') origin: string): Promise<User> {
    const user = await this.userService.findByEmail(userDto.email);
    if (user) { throw new HttpException('User with this email already registered', HttpStatus.BAD_REQUEST); }
    return this.userService.create(userDto, origin);
  }

  @Post('/avatar')
  @UseGuards(AuthGuard('jwt'))
  @UseInterceptors(FileInterceptor('file'))
  async uploadFile(@UploadedFile() file: UploadFileDto, @Req() req): Promise<FileLinkDto> {
    const userId = req.user.id;
    if (!file.mimetype) {
      throw new HttpException('Can\'t upload file with undefined format', HttpStatus.BAD_REQUEST);
    }
    if (!userId) {
      throw new HttpException('UserId is undefined!', HttpStatus.BAD_REQUEST);
    }

    const user = await this.userService.findById(userId);
    if (!user) {
      throw new HttpException('Can\'t find user with this id', HttpStatus.BAD_REQUEST);
    }
    const filename = await this.fileService.uploadFile(file);
    if (!filename) {
      throw new HttpException('Can\'t upload file on S3', HttpStatus.BAD_REQUEST);
    }

    const userAvatarData = await this.userService.updateUserAvatar({ userId, filename });
    await this.fileService.removeByKey(user.avatar);
    return userAvatarData;
  }

  @Patch('')
  @UseGuards(AuthGuard('jwt'))
  async update(@Body() userDto: UpdateUserDto, @Req() req): Promise<User> {
    const { id } = req.user;
    return this.userService.update(id, userDto);
  }

  @Delete('/avatar')
  @UseGuards(AuthGuard('jwt'))
  async removeAvatar(@Req() req): Promise<User> {
    const { id } = req.user;
    return this.userService.removeAvatar(id);
  }
}

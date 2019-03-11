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

import { User } from './user.entity';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
// import { UpdateUserDto } from './dto/update-user.dto';
// import { FilterUserDto } from './dto/filter-user.dto';
// import { ResponseUserDto } from './dto/response-fetch-all-user.dto';
// import { ResponseUserInfoDto } from './dto/response-user.dto';
// import { UserResetPasswordService } from 'user-reset-password/user-reset-password.service';

@Controller('')
@UseInterceptors(ClassSerializerInterceptor)
export class UserController {

  constructor(
    private readonly userService: UserService) {
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
  //
  // @Get('/email')
  // @UseGuards(AuthGuard('jwt'))
  // @ApiBearerAuth()
  // @ApiOperation({ title: 'Get user by email' })
  // @ApiResponse({ status: 200, type: ResponseUserInfoDto })
  // async fetchUserByEmail(@Query('email') email: string): Promise<User> {
  //   return this.userService.findByEmail(email);
  // }
  //
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
  // @Delete('/:id')
  // @HttpCode(204)
  // @UseGuards(AuthGuard('jwt'))
  // @ApiBearerAuth()
  // @ApiOperation({ title: 'Delete user' })
  // @ApiResponse({ status: 204, description: 'Successfully deleted user' })
  // async remove(@Param('id') userId: number): Promise<any> {
  //   return this.userService.remove(userId);
  // }
}

import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, getManager, In } from 'typeorm';
import { User } from './user.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { PasswordService } from '../core/password.service';
import { FileService } from '../core/file.service';
import { UpdateUserAvatarDto } from './dto/update-user-avatar.dto';
import { FileLinkDto } from '../common/dto/filelink.dto';
import { UpdateUserDto } from './dto/update-user.dto';

const relations = [];

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly passwordService: PasswordService,
    private readonly fileService: FileService,
  ) { }

  async findAll(): Promise<User[]> {
    return this.userRepository.find({ relations });
  }

  async findById(id: number | string): Promise<User> {
    return this.userRepository.findOne(id, { relations });
  }

  async findByEmail(email: string): Promise<User> {
    return this.userRepository.findOne({ email }, { relations });
  }

  async findByEmailOrPhone(email: string, phone: string) {
    return this.userRepository
      .createQueryBuilder()
      .where('email = :email', { email })
      .orWhere('phone = :phone', { phone })
      .getOne();
  }

  async findByEmailAuth(email: string): Promise<User> {
    return this.userRepository.findOne({ email }, { select: ['password', 'id'] });
  }

  /**
   * Create user with technologies...
   */
  async create(userDto: CreateUserDto, origin: string): Promise<User> {
    const resetToken = await this.passwordService.generateToken();
    const params = {
      ...userDto,
    };

    let user = new User(params as User);
    await getManager().transaction(async transactionalEntityManager => {
      user.password = await this.passwordService.generatePassword(user.password);
      user = await transactionalEntityManager.save(User, user);
    });

    return this.userRepository.findOne(user.id);
  }

  async updateUserAvatar(updateUserAvatarDto: UpdateUserAvatarDto): Promise<FileLinkDto> {
    await this.userRepository.update(updateUserAvatarDto.userId, { avatar: updateUserAvatarDto.filename });
    return { filename: updateUserAvatarDto.filename };
  }

  async update(userId: number, updateDto: UpdateUserDto): Promise<User> {
    await  this.userRepository.update(userId, updateDto);
    return this.findById(userId);
  }

  async removeAvatar(id: number): Promise<any> {
    const user: User = await this.userRepository.findOne(id);
    await this.userRepository.update(id, {avatar: ''});
    await this.fileService.removeByKey(user.avatar);
    return this.userRepository.findOne(id);
  }
}

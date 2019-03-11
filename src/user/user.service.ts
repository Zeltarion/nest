import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, getManager, In } from 'typeorm';
import { User } from './user.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { PasswordService } from '../core/password.service';
// import { UpdateUserDto } from './dto/update-user.dto';
// import { FilterUserDto } from './dto/filter-user.dto';
// import { ResponseUserDto } from './dto/response-fetch-all-user.dto';
// import { City } from 'city/city.entity';
// import { Department } from 'department/department.entity';
// import { Social } from 'social/social.entity';
// import { Position } from 'position/position.entity';
// import { QueryOrder } from 'common/enums/query-order.enum';
// import { UpdateUserPhotoDto } from './dto/update-user-photo.dto';
// import { FileLinkDto } from 'common/dto/filelink.dto';
// import { UserRole } from 'user-role/user-role.entity';
// import { UserEnglishLevel } from 'user-english-level/user-english-level.entity';
// import * as _ from 'lodash';
// import { MAIL_USER } from 'config';
// import { EmailService } from 'core/email.service';
// import { UserResetPassword } from '../user-reset-password/user-reset-password.entity';

const relations = [
  /*'city',
  'role',
  'department',
  'social',
  'position',
  'technologies',
  'english_level',*/
];

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly passwordService: PasswordService,
    // private readonly emailService: EmailService,
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
   *  Filter users by city, position, technologies, user name
   */

  // async filterUsers(query: FilterUserDto): Promise<ResponseUserDto> {
  //   const { technologies, position, city, user, department, level } = query;
  //   const { count = 10, page = 1, orderType = QueryOrder.DESC, orderBy = 'first_name' } = query;
  //   const sqlQuery = getManager().createQueryBuilder().select('user').from(User, 'user');
  //   const userPattern = `%${user}%`;
  //
  //   city ?
  //     sqlQuery.innerJoinAndSelect('user.city', 'city', 'city.id IN (:...city)', { city: city.split(',') }) :
  //     sqlQuery.innerJoinAndSelect('user.city', 'city');
  //
  //   position ?
  //     sqlQuery.innerJoinAndSelect('user.position', 'position', 'position.id IN (:...position)', { position: position.split(',') }) :
  //     sqlQuery.innerJoinAndSelect('user.position', 'position');
  //
  //   department ?
  //     sqlQuery.innerJoinAndSelect('user.department', 'department', 'department.id=:department', { department }) :
  //     sqlQuery.innerJoinAndSelect('user.department', 'department');
  //
  //   if (level) sqlQuery.where('user.level IN (:...level)', { level: level.split(',') });
  //
  //   if (user) {
  //     sqlQuery.where('first_name LIKE :fisrt_name OR last_name LIKE :last_name',
  //       { fisrt_name: userPattern, last_name: userPattern });
  //   }
  //
  //   technologies ?
  //     sqlQuery.innerJoinAndSelect('user.technologies',
  //       'technology',
  //       'technology.id IN (:...tech) ',
  //       { tech: technologies.split(',') }) :
  //     sqlQuery.leftJoinAndSelect('user.technologies', 'technology');
  //
  //   const order = {};
  //   order[`user.${orderBy}`] = orderType || QueryOrder.DESC;
  //   const allUsers = await sqlQuery.getCount();
  //   const users = await sqlQuery
  //     .leftJoinAndSelect('user.social', 'social')
  //     .take(count as number)
  //     .skip(page === 1 ? 0 : count as number * (parseInt(page, 10) as number - 1))
  //     .orderBy(order)
  //     .getMany();
  //
  //   return await Promise.resolve({
  //     count: count as number,        // items per page
  //     page: page as number,          // current page
  //     total: allUsers as number,   // users amount without pagination
  //     data: users as User[],         // could be data, or by entity name(employees, customers)
  //   });
  // }

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

      const tokenParam = {
        reset_token: resetToken,
        expire_date: new Date(Date.now() + 24 * 60 * 60 * 1000),
        used: false,
        user,
      };
      // await transactionalEntityManager.save(UserResetPassword, tokenParam);
    });

    // this.emailService.sendResetPassEmail(MAIL_USER, userDto.email, 'Reset password!', origin, reset_token, userDto.first_name);
    return this.userRepository.findOne(user.id/*, { relations }*/);
  }

  // async update(updateDto: UpdateUserDto): Promise<User> {
  //   const user = {
  //     ...updateDto,
  //     city: { id: updateDto.city } as City,
  //     department: { id: updateDto.department } as Department,
  //     position: { id: updateDto.position } as Position,
  //     role: { id: updateDto.role } as UserRole,
  //     english_level: { id: updateDto.english_level } as UserEnglishLevel,
  //   };
  //
  //   const foundSocial = await this.socialRepository.find({ where: { userId: user.id as number } });
  //   const socialToDelete = _.differenceBy(foundSocial, updateDto.social, 'type');
  //
  //   await getManager().transaction(async transactionalEntityManager => {
  //     await transactionalEntityManager.save(User, user);
  //     socialToDelete.length > 0 && await transactionalEntityManager.delete(Social, { id: In(socialToDelete.map(obj => obj.id)) });
  //     const socialToCreate = updateDto.social.map(socialItem => ({ ...socialItem, userId: user.id }));
  //     await transactionalEntityManager.save(Social, socialToCreate);
  //   });
  //   return this.findById(updateDto.id);
  // }
  //
  // async updateUserPhoto(updateUserPhotoDto: UpdateUserPhotoDto): Promise<FileLinkDto> {
  //   await this.userRepository.update(updateUserPhotoDto.userId, { photo: updateUserPhotoDto.filename });
  //   return { filename: updateUserPhotoDto.filename };
  // }

  async remove(id: number): Promise<any> {
    return this.userRepository.delete({ id });
  }
}

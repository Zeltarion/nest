import { IsString, IsEmail, IsOptional, IsDefined, IsNumber, IsDateString, IsEnum, IsArray, ValidateNested, Min, Max } from 'class-validator';
import { Type } from 'class-transformer';

export class CreateUserDto {
  @IsDefined()
  @IsEmail()
  readonly email: string;

  @IsDefined()
  @IsString()
  readonly password: string;

  @IsString()
  @IsOptional()
  readonly firstName?: string;

  @IsString()
  @IsOptional()
  readonly lastName?: string;

  @IsString()
  @IsOptional()
  readonly name?: string;

  @IsString()
  @IsOptional()
  readonly phone?: string;
}

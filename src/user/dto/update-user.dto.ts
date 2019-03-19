import { IsNumber, IsString, IsEmail, IsDateString, IsEnum, IsOptional, Min, Max, IsArray, ValidateNested } from 'class-validator';

export class UpdateUserDto {
  @IsString() @IsOptional() readonly firstName: string;
  @IsString() @IsOptional() readonly lastName: string;
  @IsString() @IsOptional() readonly phone: string;
  @IsString() @IsOptional() readonly name: string;
}

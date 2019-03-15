import { IsString, IsEmail, IsOptional, IsDefined, IsNumber, IsDateString, IsEnum, IsArray, ValidateNested, Min, Max } from 'class-validator';
import { Type } from 'class-transformer';

export class CreateBoardDto {
  @IsString()
  @IsDefined()
  readonly name: string;

  @ValidateNested()
  @IsOptional()
  @IsArray()
  readonly userIds?: number[];
}

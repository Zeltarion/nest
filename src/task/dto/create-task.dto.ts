import { IsString, IsEmail, IsOptional, IsDefined, IsNumber, IsDateString, IsEnum, IsArray, ValidateNested, Min, Max } from 'class-validator';
import { Type } from 'class-transformer';

export class CreateTaskDto {
  @IsString()
  @IsDefined()
  readonly name: string;

  @IsString()
  @IsOptional()
  readonly description: string;

  @IsDefined()
  readonly userId: number;

  @IsDefined()
  readonly boardId: number;
}

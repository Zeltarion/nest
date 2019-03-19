import { IsString } from 'class-validator';

export class FileLinkDto {
  @IsString() readonly filename: string;
}

import { IsString } from 'class-validator';

export class UpdateUserAvatarDto {
  @IsString() readonly userId: number;
  @IsString() readonly filename: string;
}

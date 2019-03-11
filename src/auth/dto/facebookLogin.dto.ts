import { IsString } from 'class-validator';

export class FacebookLoginDto {
  @IsString() readonly token: string;
}

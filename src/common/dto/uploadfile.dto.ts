import { IsString, IsNumber, IsInstance } from 'class-validator';

export class UploadFileDto {
  @IsString() readonly mimetype: string;
  @IsString() readonly encoding: string;
  @IsInstance(Buffer) readonly buffer: Buffer;
  @IsNumber() readonly size: number;
  @IsString() readonly originalname: string;
}

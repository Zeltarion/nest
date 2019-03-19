import { Module } from '@nestjs/common';
import { PasswordService } from './password.service';
import { FileService } from './file.service';

@Module({
  providers: [PasswordService, FileService],
  exports: [PasswordService, FileService],
  controllers: [],
})
export class CoreModule { }

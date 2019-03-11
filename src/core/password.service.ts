import { Injectable } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import {v4 as uuidv4} from 'uuid';

@Injectable()
export class PasswordService {

  private readonly SALT_ROUNDS: number = 10;

  generatePassword(password: string): Promise<string> {
    return bcrypt.hash(password, this.SALT_ROUNDS);
  }

  comparePassword(password: string, hash: string): Promise<boolean> {
    return bcrypt.compare(password, hash);
  }

  generateToken(): string {
    return uuidv4();
  }
}

import { Req, Res, Injectable, HttpException, HttpStatus } from '@nestjs/common';

import * as fs from 'fs';
import uuid = require('uuid');
import { FILE_STORAGE_PATH, AWS_ACCESS_KEY_ID, AWS_SECRET_ACCESS_KEY, REGION, AWS_S3_BUCKET_NAME, KEY } from '../config';
import * as S3 from 'aws-sdk/clients/s3';
import { UploadFileDto } from '../common/dto/uploadfile.dto';
import promisify from 'util';

@Injectable()
export class FileService {
  s3: S3;
  constructor() {
    this.s3 = new S3(
      {
        accessKeyId: AWS_ACCESS_KEY_ID,
        secretAccessKey: AWS_SECRET_ACCESS_KEY,
        // region: REGION,
      },
    );
  }

  /**
   * remove file by file name from folder `static`
   * @param {string} filename
   */
  async deleteByName(filename: string) {
    await fs.promises.unlink(`${FILE_STORAGE_PATH}/${filename}`);
  }

  /**
   * remove file by file name from folder `static`
   * @param {string} filename
   */
  async removeByKey(filename: string): Promise<any> {
    if (!filename.length) {
      return;
    }
    const pathList = filename.split('/');
    const key = pathList.slice(3).join('/');
    const params = { Bucket: AWS_S3_BUCKET_NAME, Key: key };
    return await this.s3.deleteObject(params).promise();
  }

  async uploadFile(file: UploadFileDto): Promise<string> {
    const format = file.mimetype.replace(/[a-z]*\//, '');
    const filename = `${uuid.v4()}.${format}`;

    return await new Promise((resolve, reject) => {
      const params = {
        Bucket: AWS_S3_BUCKET_NAME,
        Key: KEY + filename,
        Body: file.buffer,
        ACL: 'public-read',
      };

      this.s3.upload(params, (err, data) => {
        if (err) {
          return reject(err);
        }
        resolve(data.Location as string);
      });
    });
  }
}
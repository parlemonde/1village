import AWS, { S3 } from 'aws-sdk';
import fs from 'fs-extra';
import path from 'path';
import { Readable } from 'stream';

import { AppError } from '../middlewares/handleErrors';
import { logger } from '../utils/logger';

const S3_BUCKET_NAME = process.env.S3_BUCKET_NAME || '';

export class AwsS3 {
  private initialized: boolean = false;
  private s3: S3;

  private uploadS3File(filepath: string, file: Buffer | fs.ReadStream): Promise<string> {
    if (!this.initialized) {
      throw new AppError("Can't upload to s3", 0);
    }
    logger.info(`Uploading file to ${filepath}`);
    return new Promise((resolve, reject) => {
      this.s3.upload(
        {
          Body: file,
          Bucket: S3_BUCKET_NAME,
          Key: filepath,
        },
        function (err, data) {
          if (err) {
            reject(err);
          }
          if (data) {
            resolve(data.Key);
          }
        },
      );
    });
  }

  private deleteS3File(key: string): Promise<void> {
    if (!this.initialized) {
      throw new AppError("Can't delete from s3", 0);
    }
    logger.info(`Deleting file from ${key}`);
    return new Promise((resolve, reject) => {
      this.s3.deleteObject(
        {
          Bucket: S3_BUCKET_NAME,
          Key: key,
        },
        function (err, data) {
          if (err) {
            reject(err);
          }
          if (data) {
            resolve();
          }
        },
      );
    });
  }

  constructor() {
    if (!S3_BUCKET_NAME) {
      return;
    }
    const s3config: S3.ClientConfiguration = {
      accessKeyId: process.env.S3_ACCESS_KEY,
      s3ForcePathStyle: true,
      secretAccessKey: process.env.S3_SECRET_KEY,
      sslEnabled: process.env.S3_USE_SSL === 'true',
    };
    if (process.env.USE_MINIO) {
      s3config.endpoint = 'http://minio:9000';
    }
    this.s3 = new AWS.S3(s3config);
    this.initialized = true;
  }

  public getImage(filename: string): Readable {
    return this.s3
      .getObject({
        Bucket: S3_BUCKET_NAME,
        Key: `images/${filename}`,
      })
      .createReadStream();
  }

  public async uploadImage(filename: string): Promise<string> {
    // local dir
    const dir: string = path.join(__dirname, 'images');
    const fileStream = fs.createReadStream(path.join(dir, filename));
    let key = '';

    // upload image on stockage server
    try {
      key = await this.uploadS3File(`images/${filename}`, fileStream);
    } catch (e) {
      logger.error(e);
      logger.error(`File ${filename} could not be sent to aws !`);
      return '';
    }

    // delete local file
    try {
      await fs.remove(path.join(dir, filename));
    } catch (e) {
      logger.error(`File ${filename} not found locally!`);
    }

    return `/api/${key}`;
  }

  public async deleteImage(key: string): Promise<void> {
    try {
      await this.deleteS3File(key);
    } catch (e) {
      logger.error(`File ${key} not found !`);
    }
  }
}

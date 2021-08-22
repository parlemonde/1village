import type { S3 } from 'aws-sdk';
import AWS from 'aws-sdk';
import fs from 'fs-extra';
import path from 'path';
import type { Readable } from 'stream';

import { AppError } from '../middlewares/handleErrors';
import { logger } from '../utils/logger';

const S3_BUCKET_NAME = process.env.S3_BUCKET_NAME || '';

export class AwsS3 {
  private initialized: boolean = false;
  private s3: S3;

  private uploadS3File(filepath: string, file: Buffer | fs.ReadStream, contentType: string): Promise<string> {
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
          ContentType: contentType,
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

  public async getFileData(filename: string): Promise<{
    AcceptRanges: string;
    LastModified: Date;
    ContentLength: number;
    ContentType: string;
  }> {
    const data: S3.HeadObjectOutput | null = await new Promise((resolve) => {
      this.s3.headObject(
        {
          Bucket: S3_BUCKET_NAME,
          Key: filename,
        },
        (error, data) => {
          if (error) {
            resolve(null);
            return;
          }
          resolve(data);
        },
      );
    });
    return {
      AcceptRanges: data?.AcceptRanges || 'bytes',
      LastModified: data?.LastModified || new Date(),
      ContentLength: data?.ContentLength || 0,
      ContentType: data?.ContentType || '',
    };
  }

  public getFile(filename: string, range?: string): Readable {
    return this.s3
      .getObject({
        Bucket: S3_BUCKET_NAME,
        Key: filename,
        Range: range,
      })
      .createReadStream();
  }

  public async uploadFile(filename: string, contentType: string): Promise<string> {
    // local dir
    const fileStream = fs.createReadStream(path.join(__dirname, filename));
    let key = '';

    // upload image on stockage server
    try {
      key = await this.uploadS3File(filename, fileStream, contentType);
    } catch (e) {
      logger.error(e);
      logger.error(`File ${filename} could not be sent to aws !`);
      return '';
    }

    // delete local file
    try {
      await fs.remove(path.join(__dirname, filename));
    } catch (e) {
      logger.error(`File ${filename} not found locally!`);
    }

    return `/api/${key}`;
  }

  public async deleteFile(filename: string): Promise<void> {
    try {
      await this.deleteS3File(filename);
    } catch (e) {
      logger.error(`File ${filename} not found !`);
    }
  }
}

import type { IFileStats, ITemporaryFile, ITemporaryFileStorage, IUser } from '@lumieducation/h5p-server';
import { H5pError } from '@lumieducation/h5p-server';
import type { ReadStream } from 'fs-extra';
import type { Readable } from 'stream';

import { s3 } from '../../fileUpload';
import { logger } from '../../utils/logger';
import { validateFilename } from './S3Util';

export class AwsTemporaryStorage implements ITemporaryFileStorage {
  constructor() {}

  private getS3Key(filename: string): string {
    const key = `h5p/temp/${filename}`;
    if (key.length > 1024) {
      logger.error(`The S3 key for "${filename}" is ${key.length} bytes long, but only 1024 are allowed.`);
      throw new H5pError('content-storage:filename-too-long', { filename }, 400);
    }
    return key;
  }

  public async deleteFile(filename: string): Promise<void> {
    validateFilename(filename);

    if (!filename) {
      throw new H5pError('temporary-storage:file-not-found', {}, 404);
    }

    try {
      await s3.deleteFile(this.getS3Key(filename));
    } catch (error) {
      logger.error(`Error while deleting a file from S3 storage: ${error instanceof Error ? error.message : ''}`);
      throw new H5pError('s3-temporary-storage:deleting-file-error', { filename }, 500);
    }
  }

  public async fileExists(filename: string): Promise<boolean> {
    validateFilename(filename);
    try {
      const result = await s3.getFileData(this.getS3Key(filename));
      return result !== null && result.ContentLength > 0;
    } catch (error) {
      console.error(error);
      return false;
    }
  }

  public async getFileStats(filename: string): Promise<IFileStats> {
    validateFilename(filename);
    try {
      const metadata = await s3.getFileData(this.getS3Key(filename));
      if (!metadata) {
        throw new H5pError('content-file-missing', { filename }, 404);
      }
      return { size: metadata.ContentLength, birthtime: metadata.LastModified };
    } catch (error) {
      console.error(error);
      throw new H5pError('content-file', { filename }, 500);
    }
  }

  public async getFileStream(filename: string, _user: IUser, rangeStart?: number | undefined, rangeEnd?: number | undefined): Promise<Readable> {
    validateFilename(filename);
    return s3.getFile(this.getS3Key(filename), rangeStart && rangeEnd ? `bytes=${rangeStart}-${rangeEnd}` : undefined);
  }

  public async listFiles(): Promise<ITemporaryFile[]> {
    // As S3 files expire automatically, we don't need to return any file here.
    return [];
  }

  public async saveFile(filename: string, dataStream: ReadStream, user: IUser, expirationTime: Date): Promise<ITemporaryFile> {
    validateFilename(filename);
    try {
      await s3.uploadS3File(this.getS3Key(filename), dataStream);
      return {
        filename,
        ownedByUserId: user.id,
        expiresAt: expirationTime,
      };
    } catch (error) {
      logger.error(`Error while uploading file "${filename}" to S3 storage: ${error instanceof Error ? error.message : ''}`);
      throw new H5pError(`content-storage:upload-error`, { filename }, 500);
    }
  }
}

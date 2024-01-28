import type { ContentId, IContentMetadata, IContentStorage, IFileStats, ILibraryName, IUser } from '@lumieducation/h5p-server';
import { H5pError } from '@lumieducation/h5p-server';
import type { ListObjectsV2Output } from 'aws-sdk/clients/s3';
import type { Readable } from 'stream';
import { v4 } from 'uuid';

import { s3 } from '../../fileUpload';
import { logger } from '../../utils/logger';
import { validateFilename } from './S3Util';
import { dynamoDb } from './dynamoDB';

const CONTENT_TABLE_NAME = 'H5P_Content';

export class AwsFileContentStorage implements IContentStorage {
  constructor() {}

  public async init(): Promise<void> {
    await dynamoDb.createTableIfNotExists(CONTENT_TABLE_NAME);
  }

  private getS3Key(contentId: ContentId, filename: string): string {
    const key = `h5p/content/${contentId}/${filename}`;
    if (key.length > 1024) {
      logger.error(`The S3 key for "${filename}" in content object with id ${contentId} is ${key.length} bytes long, but only 1024 are allowed.`);
      throw new H5pError('content-storage:filename-too-long', { filename }, 400);
    }
    return key;
  }

  /**
   * Creates or updates a content object in the repository. Throws an error if
   * something went wrong.
   */
  public async addContent(metadata: IContentMetadata, content: unknown, user: IUser, contentId?: string | undefined): Promise<string> {
    try {
      const newContentId = contentId || v4();
      await dynamoDb.setValue(CONTENT_TABLE_NAME, newContentId, {
        metadata,
        parameters: content,
        creator: user.id,
      });
      return newContentId;
    } catch (error) {
      logger.error(`Error when adding or updating content in MongoDB: ${error instanceof Error ? error.message : ''}`);
      throw new H5pError('content-storage:add-update-error', {}, 500);
    }
  }

  /**
   * Adds a content file to an existing content object. Throws an error if
   * something went wrong.
   */
  public async addFile(contentId: string, filename: string, readStream: Readable): Promise<void> {
    validateFilename(filename);
    try {
      await s3.uploadS3File(this.getS3Key(contentId, filename), readStream);
    } catch (error) {
      logger.error(`Error while uploading file "${filename}" to S3 storage: ${error instanceof Error ? error.message : ''}`);
      throw new H5pError(`content-storage:upload-error`, { filename }, 500);
    }
  }

  /**
   * Checks if a piece of content exists in storage.
   */
  public async contentExists(contentId: string): Promise<boolean> {
    try {
      const result = await dynamoDb.getValue(CONTENT_TABLE_NAME, contentId, '#key', { '#key': 'key' });
      return result !== undefined;
    } catch (error) {
      console.error(error);
      return false;
    }
  }

  /**
   * Deletes a content object and all its dependent files from the repository.
   * Throws errors if something goes wrong.
   */
  public async deleteContent(contentId: string): Promise<void> {
    logger.debug(`Deleting content with id ${contentId}.`);
    try {
      // 1. Delete all files from S3
      // S3 batch deletes only work with 1000 files at a time, so we might have to do this in several requests.
      const filesToDelete = await this.listFiles(contentId);
      while (filesToDelete.length > 0) {
        const next1000Files = filesToDelete.splice(0, 1000);
        if (next1000Files.length > 0) {
          await s3.deleteS3Files(next1000Files.map((f) => this.getS3Key(contentId, f)));
        }
      }

      // 2. Delete the content object from DynamoDB
      await dynamoDb.deleteValue(CONTENT_TABLE_NAME, contentId);
    } catch (error) {
      logger.error(`There was an error while deleting the content object: ${error instanceof Error ? error.message : ''}`);
      throw new H5pError('content-storage:deleting-content-error', {}, 500);
    }
  }

  /**
   * Deletes a file from a content object.
   */
  public async deleteFile(contentId: string, filename: string): Promise<void> {
    validateFilename(filename);
    try {
      await s3.deleteFile(this.getS3Key(contentId, filename));
    } catch (error) {
      logger.error(`Error while deleting a file from S3 storage: ${error instanceof Error ? error.message : ''}`);
      throw new H5pError('content-storage:deleting-file-error', { filename }, 500);
    }
  }

  /**
   * Checks if a file exists.
   */
  public async fileExists(contentId: string, filename: string): Promise<boolean> {
    validateFilename(filename);
    try {
      const result = await s3.getFileData(this.getS3Key(contentId, filename));
      return result !== null && result.ContentLength > 0;
    } catch (error) {
      console.error(error);
      return false;
    }
  }

  /**
   * Returns information about a content file (e.g. image or video) inside a
   * piece of content.
   */
  public async getFileStats(contentId: string, filename: string): Promise<IFileStats> {
    validateFilename(filename);
    try {
      const metadata = await s3.getFileData(this.getS3Key(contentId, filename));
      if (!metadata) {
        throw new H5pError('content-file-missing', { contentId, filename }, 404);
      }
      return { size: metadata.ContentLength, birthtime: metadata.LastModified };
    } catch (error) {
      console.error(error);
      throw new H5pError('content-file', { contentId, filename }, 500);
    }
  }

  /**
   * Returns a readable stream of a content file (e.g. image or video) inside a piece of content
   * Note: Make sure to handle the 'error' event of the Readable! This method
   * does not check if the file exists in storage to avoid the extra request.
   * However, this means that there will be an error when piping the Readable
   * to the response if the file doesn't exist!
   */
  public async getFileStream(
    contentId: string,
    filename: string,
    _user: IUser,
    rangeStart?: number | undefined,
    rangeEnd?: number | undefined,
  ): Promise<Readable> {
    validateFilename(filename);

    if (!contentId) {
      logger.error(`ContentId not set!`);
      throw new H5pError('content-storage:content-not-found', {}, 404);
    }

    return s3.getFile(this.getS3Key(contentId, filename), rangeStart && rangeEnd ? `bytes=${rangeStart}-${rangeEnd}` : undefined);
  }

  /**
   * Returns the metadata of a content object.
   */
  public async getMetadata(contentId: string): Promise<IContentMetadata> {
    try {
      const result = await dynamoDb.getValue(CONTENT_TABLE_NAME, contentId, 'metadata');
      if (!result) {
        throw new H5pError('content-storage:content-not-found', {}, 404);
      }
      return result.metadata as IContentMetadata;
    } catch (error) {
      logger.error(`Could not get content with ${contentId}`);
      throw new H5pError('content-storage:get-content', {});
    }
  }

  /**
   * Returns the content object (=content.json) for a content id
   */
  public async getParameters(contentId: string): Promise<unknown> {
    try {
      const result = await dynamoDb.getValue(CONTENT_TABLE_NAME, contentId, '#parameters', { '#parameters': 'parameters' });
      if (!result) {
        throw new H5pError('content-storage:content-not-found', {}, 404);
      }
      return result.parameters;
    } catch (error) {
      console.error(error);
      logger.error(`Could not get parameters with ${contentId}`);
      throw new H5pError('content-storage:get-content', {});
    }
  }

  /**
   * Calculates how often a library is in use.
   */
  public async getUsage(library: ILibraryName): Promise<{ asDependency: number; asMainLibrary: number }> {
    try {
      const asMainLibraryResults = await dynamoDb.findValues(
        CONTENT_TABLE_NAME,
        'metadata.mainLibrary = :machineName AND contains(metadata.preloadedDependencies, :mainLibrary)',
        {
          ':machineName': library.machineName,
          ':mainLibrary': {
            machineName: library.machineName,
            majorVersion: library.majorVersion,
            minorVersion: library.minorVersion,
          },
        },
        '#key',
        { '#key': 'key' },
      );
      const asDependencyResults = await dynamoDb.findValues(
        CONTENT_TABLE_NAME,
        'metadata.mainLibrary <> :machineName AND (contains(metadata.preloadedDependencies, :library) OR contains(metadata.dynamicDependencies, :library) OR contains(metadata.editorDependencies, :library))',
        {
          ':machineName': library.machineName,
          ':library': {
            machineName: library.machineName,
            majorVersion: library.majorVersion,
            minorVersion: library.minorVersion,
          },
        },
        '#key',
        { '#key': 'key' },
      );
      return { asMainLibrary: asMainLibraryResults.length, asDependency: asDependencyResults.length };
    } catch (error) {
      console.error(error);
      return { asMainLibrary: 0, asDependency: 0 };
    }
  }

  public async listContent(): Promise<string[]> {
    try {
      const result = await dynamoDb.findValues(CONTENT_TABLE_NAME, undefined, undefined, '#key', { '#key': 'key' });
      return result.map((r) => r.key as string);
    } catch (error) {
      console.error(error);
      return [];
    }
  }

  /**
   * Gets the filenames of files added to the content with addContentFile(...) (e.g. images, videos or other files)
   */
  public async listFiles(contentId: string): Promise<string[]> {
    const prefix = this.getS3Key(contentId, '');
    let files: string[] = [];
    try {
      let ret: ListObjectsV2Output | undefined;
      do {
        logger.debug(`Requesting list from S3 storage.`);
        ret = await s3.listObjects(prefix, ret?.NextContinuationToken, 1000);
        if (ret.Contents) {
          files = files.concat(ret.Contents.map((c) => c.Key?.slice(prefix.length)).filter((s): s is string => typeof s === 'string'));
        }
      } while (ret.IsTruncated && ret.NextContinuationToken);
    } catch (error) {
      console.error(error);
      logger.debug(`There was an error while getting list of files from S3.`);
      return [];
    }
    logger.debug(`Found ${files.length} file(s) in S3.`);
    return files;
  }
}

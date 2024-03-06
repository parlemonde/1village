import type {
  IAdditionalLibraryMetadata,
  IInstalledLibrary,
  ILibraryMetadata,
  ILibraryName,
  ILibraryStorage,
  IFileStats,
} from '@lumieducation/h5p-server';
import { InstalledLibrary, streamToString, LibraryName, H5pError } from '@lumieducation/h5p-server';
import type { ListObjectsV2Output } from 'aws-sdk/clients/s3';
import * as path from 'path';
import type { Readable } from 'stream';
import { ReadableStreamBuffer } from 'stream-buffers';

import { s3 } from '../../fileUpload';
import { logger } from '../../utils/logger';
import { validateFilename } from './S3Util';
import { dynamoDb } from './dynamoDB';

const LIBRARY_TABLE_NAME = 'H5P_libraries';

type LibraryDep = {
  dynamicDependencies: ILibraryName[];
  editorDependencies: ILibraryName[];
  machineName: string;
  majorVersion: number;
  minorVersion: number;
  preloadedDependencies: ILibraryName[];
  ubername: string;
};

export class AwsLibraryStorage implements ILibraryStorage {
  constructor() {}

  public async init(): Promise<void> {
    await dynamoDb.createTableIfNotExists(LIBRARY_TABLE_NAME);
  }

  private getS3Key(library: ILibraryName, filename: string): string {
    const key = `h5p/libraries/${LibraryName.toUberName(library)}/${filename}`;
    if (key.length > 1024) {
      logger.error(
        `The S3 key for "${filename}" in library object for library ${LibraryName.toUberName(library)} is ${
          key.length
        } bytes long, but only 1024 are allowed.`,
      );
      throw new H5pError('content-storage:filename-too-long', { filename }, 400);
    }
    return key;
  }

  /**
   * Gets the the metadata of a library. In contrast to getLibrary this is
   * only the metadata.
   */
  private async getMetadata(library: ILibraryName): Promise<ILibraryMetadata> {
    if (!library) {
      throw new Error('You must pass in a library name to getLibrary.');
    }
    let result: Record<string, unknown> | undefined;
    try {
      result = await dynamoDb.getValue(LIBRARY_TABLE_NAME, LibraryName.toUberName(library), 'metadata');
    } catch (error) {
      logger.error(`Error while getting library metadata from DynamoDB: ${error instanceof Error ? error.message : ''}`);
      throw new H5pError('storage:error-getting-library-metadata', { ubername: LibraryName.toUberName(library) });
    }
    if (!result) {
      throw new H5pError('storage:library-not-found', { ubername: LibraryName.toUberName(library) }, 404);
    }
    if (!result.metadata) {
      throw new H5pError('storage:error-getting-library-metadata', { ubername: LibraryName.toUberName(library) });
    }
    return result.metadata as ILibraryMetadata;
  }

  /**
   * Adds a library file to a library. The library metadata must have been installed with addLibrary(...) first.
   * Throws an error if something unexpected happens. In this case the method calling addFile(...) will clean
   * up the partly installed library.
   */
  public async addFile(library: ILibraryName, filename: string, readStream: Readable): Promise<boolean> {
    validateFilename(filename);
    try {
      await s3.uploadS3File(this.getS3Key(library, filename), readStream);
    } catch (error) {
      logger.error(`Error while uploading file "${filename}" to S3 storage: ${error instanceof Error ? error.message : ''}`);
      throw new H5pError(`library-storage:s3-upload-error`, { ubername: LibraryName.toUberName(library), filename }, 500);
    }
    return true;
  }

  /**
   * Adds the metadata of the library to the repository and assigns a new id
   * to the installed library. This id is used later when the library must be
   * referenced somewhere. Throws errors if something goes wrong.
   */
  public async addLibrary(libraryData: ILibraryMetadata, restricted: boolean): Promise<IInstalledLibrary> {
    const ubername = LibraryName.toUberName(libraryData);
    try {
      await dynamoDb.setValue(LIBRARY_TABLE_NAME, ubername, { metadata: libraryData, additionalMetadata: { restricted } });
    } catch (error) {
      console.error(error);
      throw new H5pError('library-storage:error-adding-metadata');
    }
    return InstalledLibrary.fromMetadata({ ...libraryData, restricted });
  }

  /**
   * Removes all files of a library. Doesn't delete the library metadata. (Used when updating libraries.)
   */
  public async clearFiles(library: ILibraryName): Promise<void> {
    if (!(await this.isInstalled(library))) {
      throw new H5pError('library-storage:clear-library-not-found', {
        ubername: LibraryName.toUberName(library),
      });
    }
    const filesToDelete = await this.listFiles(library, {
      withMetadata: false,
    });
    // S3 batch deletes only work with 1000 files at a time, so we
    // might have to do this in several requests.
    try {
      while (filesToDelete.length > 0) {
        const next1000Files = filesToDelete.splice(0, 1000);
        if (next1000Files.length > 0) {
          logger.debug(`Batch deleting ${next1000Files.length} file(s) in S3 storage.`);
          await s3.deleteS3Files(next1000Files);
        }
      }
    } catch (error) {
      logger.error(`There was an error while clearing the files: ${error instanceof Error ? error.message : ''}`);
      throw new H5pError('library-storage:deleting-files-error');
    }
  }

  /**
   * Removes the library and all its files from the repository.
   * Throws errors if something went wrong.
   */
  public async deleteLibrary(library: ILibraryName): Promise<void> {
    if (!(await this.isInstalled(library))) {
      throw new H5pError('library-storage:library-not-found');
    }
    await this.clearFiles(library);

    try {
      await dynamoDb.deleteValue(LIBRARY_TABLE_NAME, LibraryName.toUberName(library));
    } catch (error) {
      console.error(error);
      throw new H5pError('library-storage:error-deleting', {
        ubername: LibraryName.toUberName(library),
      });
    }
  }

  /**
   * Check if the library contains a file.
   */
  public async fileExists(library: ILibraryName, filename: string): Promise<boolean> {
    validateFilename(filename);
    try {
      const result = await s3.getFileData(this.getS3Key(library, filename));
      return result !== null && result.ContentLength > 0;
    } catch (error) {
      console.error(error);
      return false;
    }
  }

  /**
   * Counts how often libraries are listed in the dependencies of other
   * libraries and returns a list of the number.
   *
   * Note: Implementations should not count circular dependencies that are
   * caused by editorDependencies. Example: H5P.InteractiveVideo has
   * H5PEditor.InteractiveVideo in its editor dependencies.
   * H5PEditor.Interactive video has H5P.InteractiveVideo in its preloaded
   * dependencies. In this case H5P.InteractiveVideo should get a dependency
   * count of 0 and H5PEditor.InteractiveVideo should have 1. That way it is
   * still possible to delete the library from storage.
   */
  public async getAllDependentsCount(): Promise<{ [ubername: string]: number }> {
    let libraryDeps: LibraryDep[] = [];
    try {
      const results = await dynamoDb.findValues(
        LIBRARY_TABLE_NAME,
        undefined,
        undefined,
        '#key, metadata.machineName, metadata.majorVersion, metadata.minorVersion, metadata.preloadedDependencies, metadata.editorDependencies, metadata.dynamicDependencies',
        { ['#key']: 'key' },
      );
      libraryDeps = results.map((d) => ({ ...(d.metadata as Record<string, unknown>), ubername: d.key as string } as LibraryDep));
    } catch (error) {
      console.error(error);
      throw new H5pError('library-storage:error-getting-dependents');
    }

    // the dependency map allows faster access to libraries by ubername
    const librariesDepsMap: {
      [ubername: string]: LibraryDep;
    } = libraryDeps.reduce<{
      [ubername: string]: LibraryDep;
    }>((prev, curr) => {
      prev[curr.ubername] = curr;
      return prev;
    }, {});

    // Remove circular dependencies caused by editor dependencies in
    // content types like H5P.InteractiveVideo.
    for (const lib of libraryDeps) {
      for (const dependency of lib.editorDependencies ?? []) {
        const ubername = LibraryName.toUberName(dependency);
        const index = librariesDepsMap[ubername].preloadedDependencies?.findIndex((ln) => LibraryName.equal(ln, lib));
        if (index >= 0) {
          librariesDepsMap[ubername].preloadedDependencies.splice(index, 1);
        }
      }
    }

    // Count dependencies
    const dependencies: Record<string, number> = {};
    for (const lib of libraryDeps) {
      for (const dependency of (lib.preloadedDependencies ?? []).concat(lib.editorDependencies ?? []).concat(lib.dynamicDependencies ?? [])) {
        const ubername = LibraryName.toUberName(dependency);
        dependencies[ubername] = (dependencies[ubername] ?? 0) + 1;
      }
    }

    return dependencies;
  }

  /**
   * Returns the number of libraries that depend on this (single) library.
   */
  public async getDependentsCount(library: ILibraryName): Promise<number> {
    try {
      const results = await dynamoDb.findValues(
        LIBRARY_TABLE_NAME,
        'metadata.preloadedDependencies = :library',
        {
          ':library': library,
        },
        '#key',
        { '#key': 'key' },
      );
      return results.length;
    } catch (error) {
      console.error(error);
      throw new H5pError('library-storage:error-getting-dependents', {
        ubername: LibraryName.toUberName(library),
      });
    }
  }

  public async getFileAsJson(library: ILibraryName, file: string): Promise<unknown> {
    const str = await this.getFileAsString(library, file);
    return JSON.parse(str);
  }

  public async getFileAsString(library: ILibraryName, file: string): Promise<string> {
    const stream: Readable = await this.getFileStream(library, file);
    return streamToString(stream);
  }

  /**
   * Returns a information about a library file.
   * Throws an exception if the file does not exist.
   */
  public async getFileStats(library: ILibraryName, file: string): Promise<IFileStats> {
    validateFilename(file);

    // As the metadata is not S3, we need to get it from MongoDB.
    if (file === 'library.json') {
      const metadata = JSON.stringify(await this.getMetadata(library));
      return { size: metadata.length, birthtime: new Date() };
    }

    try {
      const metadata = await s3.getFileData(this.getS3Key(library, file));
      if (!metadata) {
        throw new H5pError('content-file-missing', { ubername: LibraryName.toUberName(library), filename: file }, 404);
      }
      return { size: metadata.ContentLength, birthtime: metadata.LastModified };
    } catch (error) {
      console.error(error);
      throw new H5pError('content-file', { ubername: LibraryName.toUberName(library), filename: file }, 500);
    }
  }

  /**
   * Returns a readable stream of a library file's contents.
   * Throws an exception if the file does not exist.
   */
  public async getFileStream(library: ILibraryName, file: string): Promise<Readable> {
    validateFilename(file);

    // As the metadata is not S3, we need to get it from MongoDB.
    if (file === 'library.json') {
      const metadata = JSON.stringify(await this.getMetadata(library));
      const readable = new ReadableStreamBuffer();
      readable.put(metadata, 'utf-8');
      readable.stop();
      return readable;
    }

    return s3.getFile(this.getS3Key(library, file));
  }

  /**
   * Returns all installed libraries or the installed libraries that have the
   * machine name.
   */
  public async getInstalledLibraryNames(machineName?: string | undefined): Promise<ILibraryName[]> {
    try {
      const results = await dynamoDb.findValues(
        LIBRARY_TABLE_NAME,
        machineName ? 'metadata.machineName = :machineName' : undefined,
        machineName
          ? {
              ':machineName': machineName,
            }
          : undefined,
        '#key',
        { '#key': 'key' },
      );
      return results.map((d) => LibraryName.fromUberName(d.key as string));
    } catch (error) {
      console.error(error);
      throw new H5pError('library-storage:error-getting-libraries');
    }
  }

  /**
   * Gets a list of installed language files for the library.
   */
  public async getLanguages(library: ILibraryName): Promise<string[]> {
    const prefix = this.getS3Key(library, 'language');
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
      logger.debug(`There was an error while getting list of files from S3. This might not be a problem if no languages were added to the library.`);
      return [];
    }
    logger.debug(`Found ${files.length} file(s) in S3.`);
    return files.filter((file) => path.extname(file) === '.json').map((file) => path.basename(file, '.json'));
  }

  /**
   * Gets the information about an installed library
   */
  public async getLibrary(library: ILibraryName): Promise<IInstalledLibrary> {
    if (!library) {
      throw new Error('You must pass in a library name to getLibrary.');
    }
    let result:
      | {
          metadata?: ILibraryMetadata;
          additionalMetadata?: IAdditionalLibraryMetadata;
        }
      | undefined;

    try {
      result = await dynamoDb.getValue(LIBRARY_TABLE_NAME, LibraryName.toUberName(library), 'metadata, additionalMetadata');
    } catch (error) {
      console.error(error);
      throw new H5pError('library-storage:error-getting-library-metadata', { ubername: LibraryName.toUberName(library) });
    }
    if (!result || !result.metadata || !result.additionalMetadata) {
      throw new H5pError('library-storage:error-getting-library-metadata', { ubername: LibraryName.toUberName(library) });
    }
    return InstalledLibrary.fromMetadata({
      ...result.metadata,
      ...result.additionalMetadata,
    });
  }

  /**
   * Checks if a library is installed.
   */
  public async isInstalled(library: ILibraryName): Promise<boolean> {
    try {
      const found = await dynamoDb.getValue(LIBRARY_TABLE_NAME, LibraryName.toUberName(library), '#key', { '#key': 'key' });
      return found !== undefined;
    } catch (error) {
      console.error(error);
      return false;
    }
  }

  /**
   * Returns a list of library addons that are installed in the system.
   * Addons are libraries that have the property 'addTo' in their metadata.
   * ILibraryStorage implementation CAN but NEED NOT implement the method.
   * If it is not implemented, addons won't be available in the system.
   */
  public async listAddons(): Promise<ILibraryMetadata[]> {
    try {
      const results = await dynamoDb.findValues(LIBRARY_TABLE_NAME, 'attribute_exists(metadata.addTo)', undefined, 'metadata');
      return results.map((d) => d.metadata as ILibraryMetadata);
    } catch (error) {
      console.error(error);
      throw new H5pError('library-storage:error-getting-addons');
    }
  }

  /**
   * Gets a list of all library files that exist for this library.
   */
  public async listFiles(library: ILibraryName, options?: { withMetadata?: boolean }): Promise<string[]> {
    const prefix = this.getS3Key(library, '');
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
      logger.debug(`There was an error while getting list of files from S3. This might not be a problem if no languages were added to the library.`);
      return [];
    }
    logger.debug(`Found ${files.length} file(s) in S3.`);
    return options?.withMetadata ? files.concat('library.json') : files;
  }

  /**
   * Updates the additional metadata properties that is added to the
   * stored libraries. This metadata can be used to customize behavior like
   * restricting libraries to specific users.
   *
   * Implementations should avoid updating the metadata if the additional
   * metadata if nothing has changed.
   */
  public async updateAdditionalMetadata(library: ILibraryName, additionalMetadata: Partial<IAdditionalLibraryMetadata>): Promise<boolean> {
    if (!library) {
      throw new Error('You must specify a library name when calling updateAdditionalMetadata.');
    }
    try {
      await dynamoDb.updateValue(LIBRARY_TABLE_NAME, LibraryName.toUberName(library), 'SET additionalMetadata = :newData', {
        ':newData': additionalMetadata,
      });
    } catch (error) {
      console.error(error);
      throw new H5pError('library-storage:update-additional-metadata-error', {
        ubername: LibraryName.toUberName(library),
      });
    }
    return true;
  }

  /**
   * Updates the library metadata. This is necessary when updating to a new patch version.
   * After this clearFiles(...) is called by the LibraryManager to remove all old files.
   * The next step is to add the patched files with addFile(...).
   */
  public async updateLibrary(libraryMetadata: ILibraryMetadata): Promise<IInstalledLibrary> {
    const ubername = LibraryName.toUberName(libraryMetadata);

    try {
      await dynamoDb.updateValue(LIBRARY_TABLE_NAME, ubername, 'SET metadata = :metadata', { ':metadata': libraryMetadata });
    } catch (error) {
      console.error(error);
      throw new H5pError('library-storage:update-error', {
        ubername,
      });
    }

    let additionalMetadata: IAdditionalLibraryMetadata | undefined;
    try {
      const item = await dynamoDb.getValue(LIBRARY_TABLE_NAME, ubername, 'additionalMetadata');
      additionalMetadata = item?.additionalMetadata as IAdditionalLibraryMetadata | undefined;
    } catch (error) {
      logger.warn(`Could not get additional metadata for library ${ubername}`);
    }
    return InstalledLibrary.fromMetadata({
      ...libraryMetadata,
      ...(additionalMetadata ?? {}),
    });
  }
}

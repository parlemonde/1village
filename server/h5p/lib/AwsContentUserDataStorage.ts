import type { IContentUserData, IContentUserDataStorage, IFinishedUserData, IUser } from '@lumieducation/h5p-server';
import { H5pError } from '@lumieducation/h5p-server';

import { dynamoDb } from './dynamoDB';

const USER_DATA_TABLE = `${process.env.ENV || 'dev'}_H5P_user-data-content`;
const FINISHED_DATA_TABLE = `${process.env.ENV || 'dev'}_H5P_finished-data`;

export class AwsContentUserDataStorage implements IContentUserDataStorage {
  constructor() {}

  public async init(): Promise<void> {
    await dynamoDb.createTableIfNotExists(USER_DATA_TABLE); // TODO: Add indexes on userId, contentId, contextId
    await dynamoDb.createTableIfNotExists(FINISHED_DATA_TABLE); // TODO: Add indexes on userId, contentId
  }

  public async createOrUpdateContentUserData(userData: IContentUserData): Promise<void> {
    if (!userData.contentId || !userData.userId) {
      return;
    }

    await dynamoDb.setValue(
      USER_DATA_TABLE,
      getUserDataKey(userData.contentId, userData.dataType, userData.subContentId, userData.userId, userData.contextId),
      userData as unknown as Record<string, unknown>,
    );
  }

  public async deleteInvalidatedContentUserData(contentId: string): Promise<void> {
    try {
      const keysToDelete = await dynamoDb
        .findValues(
          USER_DATA_TABLE,
          'contentId = :contentId AND invalidate = :invalidate',
          {
            ':contentId': contentId,
            ':invalidate': true,
          },
          '#key',
          {
            '#key': 'key',
          },
        )
        .then((results) => results.map((r) => r.key as string));
      await dynamoDb.deleteValues(USER_DATA_TABLE, keysToDelete);
    } catch (error) {
      console.error(error);
      throw new H5pError('Could not delete content user data');
    }
  }

  public async deleteAllContentUserDataByUser(user: IUser): Promise<void> {
    try {
      const keysToDelete = await dynamoDb
        .findValues(
          USER_DATA_TABLE,
          'userId = :userId',
          {
            ':userId': user.id,
          },
          '#key',
          {
            '#key': 'key',
          },
        )
        .then((results) => results.map((r) => r.key as string));
      await dynamoDb.deleteValues(USER_DATA_TABLE, keysToDelete);
    } catch (error) {
      console.error(error);
      throw new H5pError('Could not delete content user data');
    }
  }

  public async deleteAllContentUserDataByContentId(contentId: string): Promise<void> {
    try {
      const keysToDelete = await dynamoDb
        .findValues(
          USER_DATA_TABLE,
          'contentId = :contentId',
          {
            ':contentId': contentId,
          },
          '#key',
          {
            '#key': 'key',
          },
        )
        .then((results) => results.map((r) => r.key as string));
      await dynamoDb.deleteValues(USER_DATA_TABLE, keysToDelete);
    } catch (error) {
      console.error(error);
      throw new H5pError('Could not delete content user data');
    }
  }

  public async getContentUserData(
    contentId: string,
    dataType: string,
    subContentId: string,
    userId: string,
    contextId?: string | undefined,
  ): Promise<IContentUserData> {
    const result = await dynamoDb.getValue(USER_DATA_TABLE, getUserDataKey(contentId, dataType, subContentId, userId, contextId));
    if (result === undefined) {
      throw new Error('not found');
    }
    return resultsToContentUserData(result);
  }

  public async getContentUserDataByContentIdAndUser(contentId: string, userId: string, contextId?: string | undefined): Promise<IContentUserData[]> {
    if (contextId !== undefined) {
      return dynamoDb
        .findValues(USER_DATA_TABLE, 'contentId = :contentId AND userId = :userId AND contextId = :contextId', {
          ':contentId': contentId,
          ':userId': userId,
          ':contextId': contextId,
        })
        .then((results) => results.map(resultsToContentUserData));
    } else {
      return dynamoDb
        .findValues(USER_DATA_TABLE, 'contentId = :contentId AND userId = :userId', {
          ':contentId': contentId,
          ':userId': userId,
        })
        .then((results) => results.map(resultsToContentUserData));
    }
  }

  public async getContentUserDataByUser(user: IUser): Promise<IContentUserData[]> {
    return dynamoDb
      .findValues(USER_DATA_TABLE, 'userId = :userId', {
        ':userId': user.id,
      })
      .then((results) => results.map(resultsToContentUserData));
  }

  public async createOrUpdateFinishedData(finishedData: IFinishedUserData): Promise<void> {
    if (!finishedData.contentId || !finishedData.userId) {
      return;
    }

    await dynamoDb.setValue(
      FINISHED_DATA_TABLE,
      getFinishedDataKey(finishedData.contentId, finishedData.userId),
      finishedData as unknown as Record<string, unknown>,
    );
  }

  public async getFinishedDataByContentId(contentId: string): Promise<IFinishedUserData[]> {
    return dynamoDb
      .findValues(FINISHED_DATA_TABLE, 'contentId = :contentId', {
        ':contentId': contentId,
      })
      .then((results) => results.map(resultsToFinishedUserData));
  }

  public async getFinishedDataByUser(user: IUser): Promise<IFinishedUserData[]> {
    return dynamoDb
      .findValues(FINISHED_DATA_TABLE, 'userId = :userId', {
        ':userId': user.id,
      })
      .then((results) => results.map(resultsToFinishedUserData));
  }

  public async deleteFinishedDataByContentId(contentId: string): Promise<void> {
    try {
      const keysToDelete = await dynamoDb
        .findValues(
          FINISHED_DATA_TABLE,
          'contentId = :contentId',
          {
            ':contentId': contentId,
          },
          '#key',
          {
            '#key': 'key',
          },
        )
        .then((results) => results.map((r) => r.key as string));
      await dynamoDb.deleteValues(FINISHED_DATA_TABLE, keysToDelete);
    } catch (error) {
      console.error(error);
      throw new H5pError('Could not delete finished data');
    }
  }

  public async deleteFinishedDataByUser(user: IUser): Promise<void> {
    try {
      const keysToDelete = await dynamoDb
        .findValues(
          FINISHED_DATA_TABLE,
          'userId = :userId',
          {
            ':userId': user.id,
          },
          '#key',
          {
            '#key': 'key',
          },
        )
        .then((results) => results.map((r) => r.key as string));
      await dynamoDb.deleteValues(FINISHED_DATA_TABLE, keysToDelete);
    } catch (error) {
      console.error(error);
      throw new H5pError('Could not delete finished data');
    }
  }
}

function getUserDataKey(contentId: string, dataType: string, subContentId: string, userId: string, contextId?: string | undefined): string {
  return `${contentId}_${dataType}_${subContentId}_${userId}_${contextId ?? ''}`;
}

function getFinishedDataKey(contentId: string, userId: string): string {
  return `${contentId}_${userId}`;
}

function resultsToContentUserData(result: Record<string, unknown>): IContentUserData {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { key: _k, ...rest } = result;
  return rest as unknown as IContentUserData;
}

function resultsToFinishedUserData(result: Record<string, unknown>): IFinishedUserData {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { key: _k, ...rest } = result;
  return rest as unknown as IFinishedUserData;
}

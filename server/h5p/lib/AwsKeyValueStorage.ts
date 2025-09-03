import type { IKeyValueStorage } from '@lumieducation/h5p-server';
import { H5pError } from '@lumieducation/h5p-server';

import { dynamoDb } from './dynamoDB';

if (!process.env.ENV) {
  console.warn('ENV is not set, using "dev" as default environment name');
}

const DATA_TABLE_NAME = `${process.env.ENV || 'dev'}_H5P_Data`;

export class AwsKeyValueStorage implements IKeyValueStorage {
  constructor() {}

  public async init(): Promise<void> {
    await dynamoDb.createTableIfNotExists(DATA_TABLE_NAME);
  }

  public async load(key: string): Promise<unknown> {
    try {
      const result = await dynamoDb.getValue(DATA_TABLE_NAME, key, '#value', { '#value': 'value' });
      return result?.value;
    } catch (error) {
      console.error(error);
      throw new H5pError('key-value-storage:load', { key }, 500);
    }
  }
  public async save(key: string, value: unknown): Promise<void> {
    try {
      if (value === undefined) {
        await dynamoDb.deleteValue(DATA_TABLE_NAME, key);
      } else {
        await dynamoDb.setValue(DATA_TABLE_NAME, key, { value });
      }
    } catch (error) {
      console.error(error);
      throw new H5pError('key-value-storage:save', { key }, 500);
    }
  }
}

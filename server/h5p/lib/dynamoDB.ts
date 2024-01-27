import type { DynamoDB } from 'aws-sdk';
import AWS from 'aws-sdk';

type AnyAttributes = Record<string, unknown>;

class AwsDynamoDb {
  private initialized: boolean = false;
  private dynamoDb: DynamoDB;

  constructor() {
    const dynamoDbConfig: AWS.DynamoDB.ClientConfiguration = {
      accessKeyId: process.env.DYNAMODB_ACCESS_KEY || 'local',
      secretAccessKey: process.env.DYNAMODB_SECRET_KEY || 'local',
      region: process.env.DYNAMODB_REGION,
      endpoint: process.env.DYNAMODB_ENDPOINT,
    };
    this.dynamoDb = new AWS.DynamoDB(dynamoDbConfig);
    this.initialized = true;
  }

  public async getValue(
    tableName: string,
    key: string,
    projection?: string,
    projectionNames?: Record<string, string>,
  ): Promise<AnyAttributes | undefined> {
    if (!this.initialized) {
      throw new Error("Can't get from DynamoDB");
    }
    const params: DynamoDB.GetItemInput = {
      TableName: tableName,
      Key: {
        key: {
          S: key,
        },
      },
      ProjectionExpression: projection,
      ExpressionAttributeNames: projectionNames,
    };
    const result = await this.dynamoDb.getItem(params).promise();
    return result.Item ? AWS.DynamoDB.Converter.unmarshall(result.Item) : undefined;
  }

  public async findValues(
    tableName: string,
    expression?: string,
    values?: AnyAttributes,
    projection?: string,
    projectionNames?: Record<string, string>,
  ): Promise<AnyAttributes[]> {
    if (!this.initialized) {
      throw new Error("Can't get from DynamoDB");
    }
    const params: DynamoDB.ScanInput = {
      TableName: tableName,
      FilterExpression: expression,
      ExpressionAttributeValues: values ? AWS.DynamoDB.Converter.marshall(values) : undefined,
      ProjectionExpression: projection,
      ExpressionAttributeNames: projectionNames,
    };
    const result = await this.dynamoDb.scan(params).promise();
    return result.Items?.map((i) => AWS.DynamoDB.Converter.unmarshall(i)) || [];
  }

  public async setValue(tableName: string, key: string, value: AnyAttributes): Promise<void> {
    if (!this.initialized) {
      throw new Error("Can't set to DynamoDB");
    }
    const params: DynamoDB.PutItemInput = {
      TableName: tableName,
      Item: { key: { S: key }, ...AWS.DynamoDB.Converter.marshall(value) },
    };
    await this.dynamoDb.putItem(params).promise();
  }

  public async updateValue(tableName: string, key: string, expression: string, values: AnyAttributes): Promise<void> {
    if (!this.initialized) {
      throw new Error("Can't update DynamoDB");
    }
    const params: DynamoDB.UpdateItemInput = {
      TableName: tableName,
      Key: { key: { S: key } },
      UpdateExpression: expression,
      ExpressionAttributeValues: AWS.DynamoDB.Converter.marshall(values),
    };
    await this.dynamoDb.updateItem(params).promise();
  }

  public async deleteValue(tableName: string, key: string): Promise<void> {
    if (!this.initialized) {
      throw new Error("Can't delete from DynamoDB");
    }
    const params: DynamoDB.DeleteItemInput = {
      TableName: tableName,
      Key: { key: { S: key } },
    };
    await this.dynamoDb.deleteItem(params).promise();
  }

  public async createTableIfNotExists(tableName: string): Promise<void> {
    if (!this.initialized) {
      throw new Error("Can't create table in DynamoDB");
    }

    try {
      await this.dynamoDb.describeTable({ TableName: tableName }).promise();
      return; // table exists
    } catch (e) {
      // continue
    }

    const params: DynamoDB.CreateTableInput = {
      TableName: tableName,
      KeySchema: [
        {
          AttributeName: 'key',
          KeyType: 'HASH',
        },
      ],
      AttributeDefinitions: [
        {
          AttributeName: 'key',
          AttributeType: 'S',
        },
      ],
      BillingMode: 'PAY_PER_REQUEST',
    };
    try {
      await this.dynamoDb.createTable(params).promise();
    } catch (e) {
      console.error(e);
    }
  }
}

export const dynamoDb = new AwsDynamoDb();

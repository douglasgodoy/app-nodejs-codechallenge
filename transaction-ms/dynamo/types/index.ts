import { CreateTableInput } from 'aws-sdk/clients/dynamodb';

export type DatabaseType = {
  startDatabase: () => Promise<unknown>;
  createTableIfNotExists: () => Promise<void>;
  params: CreateTableInput;
};

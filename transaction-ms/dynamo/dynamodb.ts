import { DynamoDB } from 'aws-sdk';
import { DatabaseType } from './types';

const dynamodb: DatabaseType = {
  startDatabase: async () => {
    await dynamodb.createTableIfNotExists();
  },

  createTableIfNotExists: async () => {
    const db = new DynamoDB({
      region: process.env.DB_REGION,
      endpoint: process.env.DB_URI,
    });

    db.createTable(dynamodb.params, (err, data) => {
      if (err) {
        if (err.code === 'ResourceInUseException') {
          console.log('Table already exists');
          return;
        }

        if (err.code === 'ResourceNotFoundException') {
          db.createTable(dynamodb.params, (err, data) => {
            if (err) {
              console.error('Error creating table:', err);
            } else {
              console.log('Table created successfully:', data);
            }
          });
        } else {
          console.error(
            'Error describing table:',
            JSON.stringify(err, null, 2),
          );
        }
      } else {
        console.log(
          'Table already exists. Table description JSON:',
          JSON.stringify(data, null, 2),
        );
      }
    });
  },

  params: {
    TableName: <string>process.env.TABLE_NAME,

    AttributeDefinitions: [
      { AttributeName: 'PK', AttributeType: 'S' },
      { AttributeName: 'SK', AttributeType: 'S' },
    ],
    KeySchema: [
      { AttributeName: 'PK', KeyType: 'HASH' }, // Partition Key
      { AttributeName: 'SK', KeyType: 'RANGE' },
    ],
    GlobalSecondaryIndexes: [
      {
        IndexName: 'GSI-SK',
        KeySchema: [{ AttributeName: 'SK', KeyType: 'HASH' }],
        Projection: {
          ProjectionType: 'ALL',
        },
        ProvisionedThroughput: {
          ReadCapacityUnits: 2,
          WriteCapacityUnits: 2,
        },
      },
    ],
    ProvisionedThroughput: {
      ReadCapacityUnits: 10,
      WriteCapacityUnits: 5,
    },
  },
};

export default dynamodb;

import { ConnectionOptions } from 'typeorm';

const config: ConnectionOptions = {
  type: 'postgres',
  host: 'db', // needs to be db instead of localhost
  port: 5432,
  username: 'postgres',
  password: 'postgres',
  database: 'test',
  logging: true,
  synchronize: true,
  entities: ['src/database/entities/*.ts'],
  // TODO: add migrations here
};

// Needs to be exported like this
export = config;

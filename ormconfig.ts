import { ConnectionOptions } from 'typeorm';

const config: ConnectionOptions = {
  type: 'postgres',
  host: 'db', // needs to be db instead of localhost
  port: 5432,
  username: 'postgres',
  password: 'postgres',
  database: 'test',
  logging: true,
  synchronize: false,
  entities: ['src/database/entities/*.ts'],
  migrations: ['src/database/migrations/*.ts'],
  migrationsRun: true,
  cli: {
    migrationsDir: 'src/database/migrations',
  },
};

// Needs to be exported like this
export = config;

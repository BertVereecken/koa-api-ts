import 'reflect-metadata';
import dotenv from 'dotenv';
dotenv.config();
import express from 'express';
import { ApolloServer } from 'apollo-server-express';
import { buildSchema } from 'type-graphql';
import { HelloResolver } from './graphql/resolvers/hello';
import { winstonLogger } from './core';
import { createConnection } from 'typeorm';
import { Todo } from './entities/Todo';

const logger = winstonLogger('server');

const main = async () => {
  logger.info('Initializing app...');

  // const connection = await createConnection({
  //   type: 'postgres',
  //   database: 'test',
  //   host: 'localhost',
  //   port: 5432,
  //   username: 'postgres',
  //   password: 'postgres',
  //   logging: true,
  //   // TODO: enable symchronize only in dev
  //   synchronize: true,
  //   entities: [Todo],
  // })
  //   .then((connection) => {
  //     console.log('connection', connection);
  //   })
  //   .catch((err) => logger.error(err));

  try {
    await createConnection();
  } catch (err) {
    console.log(err);
  }

  const app = express();

  const apolloServer = new ApolloServer({
    schema: await buildSchema({
      resolvers: [HelloResolver],
      validate: false,
    }),
  });

  apolloServer.applyMiddleware({ app });

  app.listen(process.env.PORT || 3000, () =>
    logger.info(`Server is listening on port ${process.env.PORT}`),
  );
};

main().catch((err) => {
  logger.error(err);
});

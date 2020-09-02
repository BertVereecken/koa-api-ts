import 'reflect-metadata';
import dotenv from 'dotenv';
dotenv.config();
import express from 'express';
import { ApolloServer } from 'apollo-server-express';
import { buildSchema } from 'type-graphql';
import { HelloResolver } from './graphql/resolvers/hello';
import { winstonLogger } from './core';
import { createConnection } from 'typeorm';
import { TodoResolver } from './graphql/resolvers/todo';

const logger = winstonLogger('server');

const main = async () => {
  logger.info('Initializing app...');

  try {
    await createConnection();
  } catch (err) {
    logger.error(err);
  }

  const app = express();

  const apolloServer = new ApolloServer({
    schema: await buildSchema({
      resolvers: [HelloResolver, TodoResolver],
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

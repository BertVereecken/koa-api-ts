import 'reflect-metadata';
import dotenv from 'dotenv';
dotenv.config();
import express from 'express';
import { ApolloServer } from 'apollo-server-express';
import { buildSchema } from 'type-graphql';
import { winstonLogger } from './core';
import { createConnection } from 'typeorm';
import { TodoResolver, UserResolver } from './graphql';

const logger = winstonLogger('server');

// make seperate function for middleware
// use CORS
// add helmet
// add SIGINT, SIGKILL, SIGTERM to cleanly quit docker

const main = async () => {
  logger.info('Initializing app...');

  try {
    await createConnection();
  } catch (err) {
    logger.error(`Error while creating connection ${err}`);
  }

  const app = express();

  const apolloServer = new ApolloServer({
    schema: await buildSchema({
      // TODO: add resolvers via a better way instead of manually
      resolvers: [TodoResolver, UserResolver],
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

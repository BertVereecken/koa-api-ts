import 'reflect-metadata';
import dotenv from 'dotenv';
dotenv.config();
import { winstonLogger, installApolloServer } from './core';
import { createConnection } from 'typeorm';
import koa from 'koa';
import helmet from 'koa-helmet';
import http from 'http';

const logger = winstonLogger('server');

(async () => {
  logger.info('Initializing app...');
  logger.info('Initializing connection with DB');
  try {
    await createConnection();
  } catch (err) {
    logger.error(`Could not create connection with DB: ${err}`);
    throw err;
  }

  const app = new koa();

  // wrapper against 11 smaller middlewares that helps to protect your API
  app.use(helmet());
  // TODO: maybe add CORS ?
  logger.info('Installing apolloServer...');
  try {
    installApolloServer(app);
  } catch (err) {
    logger.error(`Could not apply apolloServer: ${err}`);
    throw err;
  }

  const server = http.createServer(app.callback()).listen(process.env.PORT || 3000, () => {
    logger.info(`Server is listening on ${process.env.HOST}${process.env.PORT}/graphql`);
  });

  // // Graceful shutdown of the server
  const shutdown = (): void => {
    logger.info('Starting shutdown of server...');
    server.close((err) => {
      if (err) {
        logger.error(`Could not gracefully close server: `, err);
        process.exitCode = 1;
      }
      process.exit();
    });
  };

  // SIGINT signal (CTRL-C)
  process.on('SIGINT', () => {
    logger.warn('Received SIGINT signal');
    shutdown();
  });

  // SIGTERM signal (Docker stop)
  process.on('SIGTERM', () => {
    logger.warn('Received SIGTERM signal');
    shutdown();
  });

  process.on('unhandledRejection', (reason, promise) => {
    logger.error('Unhandled rejection: ', JSON.stringify(reason), promise);
    shutdown();
  });
})();

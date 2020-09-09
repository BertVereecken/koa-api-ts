import 'reflect-metadata';
import dotenv from 'dotenv';
dotenv.config();
import express from 'express';
import { winstonLogger, installApolloServer } from './core';
import { createConnection } from 'typeorm';
import helmet from 'helmet';

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

  const app = express();

  // wrapper against 11 smaller middlewares that helps to protect your API
  app.use(
    helmet({
      contentSecurityPolicy: false,
    }),
  );
  // TODO: maybe add CORS ?
  logger.info('Installing apolloServer...');
  try {
    installApolloServer(app);
  } catch (err) {
    logger.error(`Could not apply apolloServer: ${err}`);
    throw err;
  }

  app.listen(process.env.PORT || 3000, () =>
    logger.info(`Server is listening on port ${process.env.PORT}`),
  );

  // // Graceful shutdown of the server
  // const shutdown = (): void => {
  //   logger.info('Starting shutdown of server...');
  //   // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  //   // @ts-ignore
  //   app.close((err) => {
  //     if (err) {
  //       logger.error(`Could not gracefully close server: `, err);
  //       process.exitCode = 1;
  //     }
  //     process.exit();
  //   });
  // };

  // // SIGINT signal (CTRL-C)
  // process.on('SIGINT', () => {
  //   logger.warn('Received SIGINT signal');
  //   shutdown();
  // });

  // // SIGTERM signal (Docker stop)
  // process.on('SIGTERM', () => {
  //   logger.warn('Received SIGTERM signal');
  //   shutdown();
  // });

  // process.on('uncaughtException', (error) => {
  //   logger.error('Uncaught exception: ', error);
  //   shutdown();
  // });

  // process.on('unhandledRejection', (reason, promise) => {
  //   logger.error('Unhandled rejection: ', JSON.stringify(reason), promise);
  //   shutdown();
  // });
})();

import { createLogger, format, transports, Logger } from 'winston';
const { printf, combine, colorize, timestamp, json, prettyPrint } = format;

const consoleTransportFormat = printf(({ level, message, timestamp }) => {
  return `[${timestamp} - ${level.toUpperCase()}] ${message}`;
});

const winstonLogger = (moduleName: string): Logger =>
  createLogger({
    format: combine(
      colorize({ message: true }),
      timestamp({
        format: 'YYYY-MM-DD HH:mm:ss',
      }),
      prettyPrint(),
      // handleExceptions: true, // TODO: Do we need handleExceptions here
      consoleTransportFormat,
    ),
    defaultMeta: { moduleName },
    transports: [
      new transports.Console(),
      new transports.File({
        filename: 'errors.log',
        level: 'error',
        format: combine(
          json(),
          timestamp({
            format: 'YYYY-MM-DD HH:mm:ss',
          }),
        ),
        // handleExceptions: true, // TODO: Do we need handleExceptions here
        maxsize: 5242880, // 5MB
      }),
    ],
    // exitOnError: false // TODO: should we need this
  });

// TODO: check in which node_env we are and disable logging to the console in production ?

export { winstonLogger };

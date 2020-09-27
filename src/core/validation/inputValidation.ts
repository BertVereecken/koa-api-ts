import { Schema } from '@hapi/joi';
import { InputValidationError } from '../error';
import { winstonLogger } from '../logging';

const logger = winstonLogger('inputValidation');

const validateArgsAgainstSchema = async (
  args: Record<string, string | boolean>,
  schema: Schema,
): Promise<string> => {
  return await schema.validateAsync(args, {
    abortEarly: false, // do not stop on first error
    presence: 'required',
    convert: false, // do not try to cast to the target
  });
};

const validateArgs = async (
  args: Record<string, string | boolean>,
  schema: Schema,
): Promise<string> => {
  try {
    return await validateArgsAgainstSchema(args, schema);
  } catch (err) {
    logger.error(err);
    throw new InputValidationError(err);
  }
};

export { validateArgs };

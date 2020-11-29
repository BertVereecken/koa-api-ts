import { Resolver, Arg, Mutation } from 'type-graphql';
import {
  generateHash,
  generateToken,
  comparePassword,
  winstonLogger,
  validateArgs,
  NotFoundError,
  Role,
} from '../../common';
import Joi from '@hapi/joi';
import { AuthenticationError } from 'apollo-server-koa';
import { User } from './user.model';
import { getUserByEmail } from './user.services';

const logger = winstonLogger('userResolver');

@Resolver()
export class UserResolver {
  @Mutation(() => String)
  async register(
    @Arg('email') email: string,
    @Arg('password') password: string,
    // TODO: check if we can omit setting a default value hre because we have a default value set in the DB.
    @Arg('role', { nullable: true }) role: Role = Role.USER,
  ): Promise<string | undefined> {
    const schema = Joi.object({
      email: Joi.string().email().min(10).max(150),
      password: Joi.string().min(10),
      role: Joi.string().valid(Role.ADMIN, Role.USER),
    });

    try {
      // validate user input
      await validateArgs({ email, password, role }, schema);

      // check if user already exists in the DB
      const user = await getUserByEmail(email);

      if (user) {
        throw new AuthenticationError(`User with email: ${email} already exists`);
      }

      // hash the password
      const hashedPassword = await generateHash(password);

      // create the user when validation and password hashing is successful
      const createdUser = await User.create({ email, password: hashedPassword, role }).save();

      // create a JWT token when user is created
      const token = generateToken({ userId: createdUser.id, role: createdUser.role });

      return token;
    } catch (err) {
      logger.error(`Something went wrong while registering: ${err}`);
      throw err;
    }
  }

  @Mutation(() => String)
  async login(
    @Arg('email') email: string,
    @Arg('password') password: string,
  ): Promise<string | undefined> {
    const schema = Joi.object({
      email: Joi.string().email().min(10).max(150),
      password: Joi.string().min(10),
    });

    try {
      await validateArgs({ email, password }, schema);

      const user = await getUserByEmail(email);

      if (!user) throw new NotFoundError(`User with email: ${email} not found`, 'USER_NOT_FOUND');

      const isPasswordValid = await comparePassword(password, user.password);

      if (!isPasswordValid) throw new AuthenticationError('Wrong credentials');

      const token = generateToken({ userId: user.id, role: user.role });

      return token;
    } catch (err) {
      logger.error(`Something went wrong while logging in: ${err}`);
      throw err;
    }
  }
}
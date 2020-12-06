import { Resolver, Arg, Mutation, Authorized } from 'type-graphql';
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
import { getUserByEmail, getUserById, getUserRole } from './user.services';

const logger = winstonLogger('userResolver');

// TODO: Store this in config
const MAX_BAD_LOGIN_ATTEMPTS = 3;
const LOGIN_ATTEMPTS_LOCK_TIME = 60 * 30 * 1000; // 30 minutes in milliseconds
@Resolver()
export class UserResolver {
  @Mutation(() => String)
  async register(
    @Arg('email') email: string,
    @Arg('password') password: string,
    @Arg('role', { nullable: true }) role: Role = Role.USER,
  ): Promise<string | undefined> {
    const schema = Joi.object({
      email: Joi.string().email().min(10).max(150),
      password: Joi.string().min(10),
      role: Joi.string().valid(Role.ADMIN, Role.USER),
    });

    try {
      await validateArgs({ email, password, role }, schema);

      const user = await getUserByEmail(email);

      if (user) {
        throw new AuthenticationError(`User with email: ${email} already exists`);
      }

      const hashedPassword = await generateHash(password);

      const createdUser = await User.create({ email, password: hashedPassword, role }).save();

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
    const now = new Date().getTime();

    try {
      await validateArgs({ email, password }, schema);

      const user = await getUserByEmail(email);

      if (!user) throw new NotFoundError(`User with email: ${email} not found`, 'USER_NOT_FOUND');

      // TODO: what after 3 bad attempts, and the 4th one also bad ... ?
      if (
        user.badLoginAttempts >= MAX_BAD_LOGIN_ATTEMPTS &&
        now - user.lastBadLoginAttempt <= LOGIN_ATTEMPTS_LOCK_TIME
      ) {
        // TODO: make general error
        throw new Error('account locked');
      }

      const isPasswordValid = await comparePassword(password, user.password);

      if (!isPasswordValid) {
        await User.update(
          { id: user.id },
          { lastBadLoginAttempt: now, badLoginAttempts: user.badLoginAttempts + 1 },
        );
        throw new AuthenticationError('Wrong credentials');
      }

      // reset bad login attempts
      await User.update({ id: user.id }, { badLoginAttempts: 0 });

      const token = generateToken({ userId: user.id, role: user.role });

      return token;
    } catch (err) {
      logger.error(`Something went wrong while logging in: ${err}`);
      throw err;
    }
  }

  @Authorized('user')
  @Mutation(() => Boolean)
  async changePassword(
    @Arg('userId') userId: string,
    @Arg('oldPassword') oldPassword: string,
    @Arg('newPassword') newPassword: string,
    @Arg('newPasswordAgain') newPasswordAgain: string,
  ): Promise<boolean> {
    const schema = Joi.object({
      userId: Joi.string().guid({ version: 'uuidv4' }),
      oldPassword: Joi.string().min(10).max(150),
      newPassword: Joi.string().min(10).max(150),
      newPasswordAgain: Joi.string().valid(newPassword).error(new Error('Passwords do not match')),
    });

    try {
      await validateArgs({ userId, oldPassword, newPassword, newPasswordAgain }, schema);

      const user = await getUserById(userId);

      if (!user) throw new NotFoundError(`User with id: ${userId} not found`, 'USER_NOT_FOUND');

      await comparePassword(oldPassword, user.password);

      const newHashedPassword = await generateHash(newPassword);

      User.update({ id: userId }, { password: newHashedPassword });
      return true;
    } catch (err) {
      logger.error(`Something went wrong while changing the password: ${err}`);
      throw err;
    }
  }

  @Authorized('admin')
  @Mutation(() => Boolean)
  async updateUser(@Arg('id') id: string, @Arg('newEmail') newEmail: string): Promise<boolean> {
    const schema = Joi.object({
      id: Joi.string().uuid(),
      newEmail: Joi.string().email().min(10).max(150),
    });

    try {
      await validateArgs({ id, newEmail }, schema);

      const user = await getUserById(id);

      if (!user) throw new NotFoundError(`User with id: ${id} not found`, 'USER_NOT_FOUND');

      const roleOfUser = await getUserRole(id);

      // TODO: improve error here
      if (roleOfUser === Role.ADMIN) throw new Error('Not possible to edit another admin');

      await User.update({ id }, { email: newEmail });

      return true;
    } catch (err) {
      logger.error(`Something went wrong while updating the user: ${err}`);
      throw err;
    }
  }
}

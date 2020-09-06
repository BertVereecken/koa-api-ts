import { Resolver, Arg, Mutation } from 'type-graphql';
import { User, Role } from '../../database';
import { generateHash, generateToken, comparePassword, winstonLogger } from '../../core';

const logger = winstonLogger('userResolver');

@Resolver()
export class UserResolver {
  @Mutation(() => String)
  async register(
    @Arg('email') email: string,
    @Arg('password') password: string,
    @Arg('role', { nullable: true }) role: Role = Role.USER,
  ): Promise<string | undefined> {
    try {
      const hashedPassword = await generateHash(password);

      // TODO: Validate email (unique) and password
      const createdUser = await User.create({ email, password: hashedPassword, role }).save();

      const token = generateToken({ userId: createdUser.id, role: createdUser.role });

      return token;
    } catch (err) {
      logger.error(`Something went wrong while registering: ${err}`);
    }
  }

  @Mutation(() => String)
  async login(
    @Arg('email') email: string,
    @Arg('password') password: string,
  ): Promise<string | undefined> {
    try {
      const user = await User.findOne({ email });

      if (!user) throw new Error('USER_NOT_FOUND');

      const isPasswordValid = await comparePassword(password, user.password);

      if (!isPasswordValid) throw new Error('Wrong credentials');

      const token = generateToken({ userId: user.id, role: user.role });

      return token;
    } catch (err) {
      logger.error(`Something went wrong with the login: ${err}`);
    }
  }
}

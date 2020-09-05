import { Resolver, Query, Arg, Mutation } from 'type-graphql';
import { User } from '../../database';
import { Role } from '../../database/common';

@Resolver()
export class UserResolver {
  @Mutation(() => User)
  async createUser(
    @Arg('email') email: string,
    @Arg('password') password: string,
    @Arg('role', { nullable: true }) role: Role = Role.USER,
  ): Promise<User> {
    console.log('email', email);
    console.log('password', password);
    console.log('role', role);

    // TODO: Validate email en password
    return await User.create({ email, password, role }).save();
  }
}

import { ApolloServer } from 'apollo-server-koa';
import { AuthChecker, buildSchema } from 'type-graphql';
import Koa, { Context } from 'koa';
import { TodoResolver, UserResolver } from '../modules';
import { Role } from './enums';
import { decodeToken } from './auth';

// TODO: move these helper functions to better place later
const extractToken = (context: Context): string | undefined => {
  const authorizationHeaderParts: string[] | undefined = context.headers?.authorization?.split(' ');

  if (authorizationHeaderParts?.length === 2) {
    const [scheme, token] = authorizationHeaderParts;
    if (/^Bearer$/i.test(scheme)) {
      return token;
    }
  }
};

// TODO: move these helper functions to better place later
const doesArrayInclude = (sourceArray: string[], targetArray: string[]): boolean => {
  return sourceArray.some((item: string) => targetArray.includes(item));
};

export const customAuthChecker: AuthChecker<Context, Role> = (
  { context },
  roles = [Role.USER],
): boolean => {
  const extractedToken = extractToken(context);

  if (!extractedToken) return false;

  const { roles: userRoles } = decodeToken(extractedToken);

  if (userRoles.includes(Role.ADMIN)) return true;

  return doesArrayInclude(roles, userRoles);
};
// pass the koa context to the GraphQL context
const returnKoaContext = ({ ctx }: { ctx: Context }) => ctx;

const installApolloServer = async (app: Koa): Promise<void> => {
  const apolloServer = new ApolloServer({
    schema: await buildSchema({
      // TODO: add resolvers via a better way instead of manually
      resolvers: [TodoResolver, UserResolver],
      validate: false,
      authChecker: customAuthChecker,
    }),
    context: returnKoaContext,
  });

  apolloServer.applyMiddleware({ app });
};

export { installApolloServer };

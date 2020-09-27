import { ApolloServer } from 'apollo-server-koa';
import { buildSchema } from 'type-graphql';
import { TodoResolver, UserResolver } from '../graphql';
import Koa, { Context } from 'koa';

// pass the koa context to the GraphQL context
const returnKoaContext = ({ ctx }: { ctx: Context }) => ctx;

const installApolloServer = async (app: Koa): Promise<void> => {
  const apolloServer = new ApolloServer({
    schema: await buildSchema({
      // TODO: add resolvers via a better way instead of manually
      resolvers: [TodoResolver, UserResolver],
      validate: false,
    }),
    context: returnKoaContext,
  });

  // const bool = false;
  // app.use(async (ctx, next) => {
  //   console.log('heeeey', ctx);

  //   if (bool) {
  //     await next();
  //   } else {
  //     throw new AuthenticationError('Not authenticated');
  //   }
  // });

  apolloServer.applyMiddleware({ app });
};

export { installApolloServer };

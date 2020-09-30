import { ApolloServer, AuthenticationError } from 'apollo-server-koa';
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
  //   try {
  //     if (bool) {
  //       console.log('de boolean is is true hahah');
  //     } else {
  //       throw new AuthenticationError('Not authenticated');
  //     }
  //   } catch (err) {
  //     console.log('we zijn in de error');
  //     throw err;
  //   }
  //   return next();
  // });

  apolloServer.applyMiddleware({ app });
};

export { installApolloServer };

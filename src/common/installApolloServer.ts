import { ApolloServer } from 'apollo-server-koa';
import { buildSchema } from 'type-graphql';
import Koa, { Context } from 'koa';
import { TodoResolver, UserResolver } from '../modules';

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

  apolloServer.applyMiddleware({ app });
};

export { installApolloServer };

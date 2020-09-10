import { ApolloServer } from 'apollo-server-koa';
import { buildSchema } from 'type-graphql';
import { TodoResolver, UserResolver } from '../graphql';
import Koa from 'koa';

const installApolloServer = async (app: Koa): Promise<void> => {
  const apolloServer = new ApolloServer({
    schema: await buildSchema({
      // TODO: add resolvers via a better way instead of manually
      resolvers: [TodoResolver, UserResolver],
      validate: false,
    }),
  });

  apolloServer.applyMiddleware({ app });
};

export { installApolloServer };

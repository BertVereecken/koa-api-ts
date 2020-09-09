import { ApolloServer } from 'apollo-server-express';
import { buildSchema } from 'type-graphql';
import { TodoResolver, UserResolver } from '../graphql';
import { Express } from 'express';

const installApolloServer = async (app: Express): Promise<void> => {
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

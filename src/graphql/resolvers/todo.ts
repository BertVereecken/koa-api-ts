import { Resolver, Query } from 'type-graphql';
import { Todo } from '../../entities/Todo';

const data = [
  {
    id: 1,
    title: 'test',
  },
];

@Resolver()
export class TodoResolver {
  @Query(() => [Todo])
  async todos(): Promise<Todo[] | undefined> {
    return undefined;
  }
}

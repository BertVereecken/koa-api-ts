import { Resolver, Query, Mutation, Arg } from 'type-graphql';
import { Todo } from '../../entities/Todo';

@Resolver()
export class TodoResolver {
  @Query(() => [Todo])
  async todos(): Promise<Todo[] | null> {
    return Todo.find();
  }

  @Mutation(() => Todo)
  async createTodo(@Arg('title') title: string): Promise<Todo> {
    return Todo.create({ title, completed: false }).save();
  }

  @Mutation(() => Todo, { nullable: true })
  async updateTodo(
    @Arg('id') id: string,
    @Arg('title', { nullable: true }) title: string,
    @Arg('completed', { nullable: true }) completed: boolean,
  ): Promise<Todo | undefined> {
    const todo = await Todo.findOne(id);

    if (!todo) {
      throw new Error('TODO_NOT_FOUND');
    }

    interface toUpdate {
      title?: string;
      completed?: boolean;
    }
    const toUpdate: toUpdate = {};

    if (title) {
      toUpdate.title = title;
    }

    if (completed !== undefined) {
      toUpdate.completed = completed;
    }

    await Todo.update({ id }, { ...toUpdate });

    const updatedTodo = await Todo.findOne(id);
    return updatedTodo;
  }
}

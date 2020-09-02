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
    return Todo.create({ title }).save();
  }

  @Mutation(() => Todo, { nullable: true })
  async updateTodo(@Arg('id') id: string, @Arg('title') title: string): Promise<Todo | undefined> {
    const todo = await Todo.findOne(id);

    if (!todo) {
      throw new Error('TODO_NOT_FOUND');
    }

    await Todo.update({ id }, { title });

    const updatedTodo = await Todo.findOne(id);
    return updatedTodo;
  }
}

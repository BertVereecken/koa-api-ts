import Joi from '@hapi/joi';
import { Context } from 'koa';
import { Resolver, Query, Mutation, Arg, Ctx } from 'type-graphql';
import { NotFoundError, validateArgs, winstonLogger } from '../../core';
import { Todo } from '../../database';

const logger = winstonLogger('Todo resolver');

@Resolver()
export class TodoResolver {
  @Query(() => [Todo])
  async todos(@Ctx() ctx: Context): Promise<Todo[] | null> {
    console.log('context in todos', ctx);
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
    const schema = Joi.object({
      title: Joi.string().min(2).max(200),
      completed: Joi.boolean(),
    });

    try {
      await validateArgs({ title, completed }, schema);

      const todo = await Todo.findOne(id);

      if (!todo) {
        throw new NotFoundError(`Todo with id: ${id} could not be found`, 'TODO_NOT_FOUND');
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
    } catch (err) {
      logger.error(err);
      throw err;
    }
  }
}

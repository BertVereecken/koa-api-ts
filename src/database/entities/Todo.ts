import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';
import { ObjectType, Field } from 'type-graphql';
import { Common } from '../common';

@ObjectType()
@Entity()
export class Todo extends Common {
  @Field()
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Field(() => String)
  @Column()
  title: string;

  @Field(() => Boolean)
  @Column()
  completed: boolean;
}

import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';
import { ObjectType, Field } from 'type-graphql';
import { BasicModel } from '../basicModel';

@ObjectType()
@Entity()
export class Todo extends BasicModel {
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

import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  BaseEntity,
} from 'typeorm';
import { ObjectType, Field } from 'type-graphql';
// TODO: Fix this import/export later
import { Common } from './User';

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

  @Field(() => String)
  @CreateDateColumn()
  createdAt: Date;

  @Field(() => String)
  @UpdateDateColumn()
  updatedAt: Date;
}

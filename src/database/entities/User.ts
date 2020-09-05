import { ObjectType, Field } from 'type-graphql';
import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';
import { Common, Role } from '../common';

@ObjectType()
@Entity()
export class User extends Common {
  @Field()
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Field()
  @Column()
  email: string;

  @Field()
  @Column()
  password: string;

  @Field()
  @Column({ type: 'enum', enum: Role })
  role: Role;
}

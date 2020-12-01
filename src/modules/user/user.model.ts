import { ObjectType, Field } from 'type-graphql';
import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';
import { Role } from '../../common';
import { BasicModel } from '../basicModel';

@ObjectType()
@Entity()
export class User extends BasicModel {
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

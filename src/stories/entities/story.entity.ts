import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { User } from '@users/entities/user.entity';
import { IUser } from '@users/users.interface';

export enum StoriesOptionType {
  TEXT = 'text',
  IMAGE = 'image',
}

@Entity({ name: 'stories' })
export class Story {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({
    type: 'enum',
    enum: StoriesOptionType,
    default: StoriesOptionType.TEXT,
  })
  type: StoriesOptionType;

  @Column({ nullable: true })
  text: string;

  @Column({ nullable: true })
  bgColor: string;

  @Column({ type: 'text', nullable: true })
  storyUrl: string;

  @ManyToOne(() => User, (user) => user.stories)
  owner: IUser;

  @CreateDateColumn({ nullable: true })
  createdAt: Date;

  @UpdateDateColumn({ nullable: true })
  updatedAt: Date;
}

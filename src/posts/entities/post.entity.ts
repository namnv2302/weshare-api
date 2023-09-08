import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
} from 'typeorm';
import { User } from '@users/entities/user.entity';
import { IUser } from '@users/users.interface';

@Entity({ name: 'posts' })
export class Post {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: true })
  status: string;

  @Column({ nullable: true })
  postUrl: string;

  @ManyToOne(() => User, (user) => user.posts)
  user: IUser;

  @Column({ default: false })
  isDeleted: boolean;

  @Column({ type: Date, nullable: true })
  deletedAt: Date;

  @CreateDateColumn({ nullable: true })
  createdAt: Date;

  @UpdateDateColumn({ nullable: true })
  updatedAt: Date;
}

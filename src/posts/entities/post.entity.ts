import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  ManyToMany,
  JoinTable,
} from 'typeorm';
import { User } from '@users/entities/user.entity';
import { IUser } from '@users/users.interface';

@Entity({ name: 'posts' })
export class Post {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ nullable: true })
  status: string;

  @Column({ nullable: true })
  postUrl: string;

  @ManyToOne(() => User, (user) => user.posts)
  user: IUser;

  @ManyToMany(() => User)
  @JoinTable()
  liked: IUser[];

  addUserLiked(user: IUser) {
    if (this.liked === undefined || this.liked === null) {
      this.liked = new Array<IUser>();
    }
    this.liked.push(user);
  }

  @Column({ default: false })
  isDeleted: boolean;

  @Column({ type: Date, nullable: true })
  deletedAt: Date;

  @CreateDateColumn({ nullable: true })
  createdAt: Date;

  @UpdateDateColumn({ nullable: true })
  updatedAt: Date;
}

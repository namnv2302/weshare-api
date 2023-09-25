import { Post } from '@/posts/entities/post.entity';
import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
  ManyToMany,
  JoinTable,
} from 'typeorm';

@Entity({ name: 'users' })
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column({ unique: true })
  email: string;

  @Column()
  password: string;

  @Column()
  slug: string;

  @Column({ nullable: true })
  age: number;

  @Column({ nullable: true })
  address: string;

  @Column({ nullable: true })
  gender: string;

  @Column({ type: 'text', nullable: true })
  avatar: string;

  @Column({ type: 'enum', enum: ['admin', 'user'], default: 'user' })
  role: string;

  @OneToMany(() => Post, (post) => post.user)
  posts: Post[];

  @ManyToMany(() => User)
  @JoinTable()
  followed: User[];

  addUserToFollowedList(user: User) {
    if (this.followed === undefined || this.followed === null) {
      this.followed = new Array<User>();
    }
    this.followed.push(user);
  }

  @ManyToMany(() => User)
  @JoinTable()
  following: User[];

  addUserToFollowingList(user: User) {
    if (this.following === undefined || this.following === null) {
      this.following = new Array<User>();
    }
    this.following.push(user);
  }

  @ManyToMany(() => User)
  @JoinTable()
  friends: User[];

  addUserToFriendList(user: User) {
    if (this.friends === undefined || this.friends === null) {
      this.friends = new Array<User>();
    }
    this.friends.push(user);
  }

  @Column({ default: true })
  isActive: boolean;

  @Column({ type: 'text', nullable: true })
  refreshToken: string;

  @CreateDateColumn({ nullable: true })
  createdAt: Date;

  @UpdateDateColumn({ nullable: true })
  updatedAt: Date;
}

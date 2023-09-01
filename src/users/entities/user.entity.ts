import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity({ name: 'users' })
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column({ unique: true })
  email: string;

  @Column()
  password: string;

  @Column({ nullable: true })
  age: number;

  @Column({ nullable: true })
  address: string;

  @Column({ nullable: true })
  gender: string;

  @Column({ nullable: true })
  avatar: string;

  @Column({ type: 'enum', enum: ['admin', 'user'], default: 'user' })
  role: string;

  @Column({ default: true })
  isActive: boolean;

  @Column({ nullable: true })
  refreshToken: string;

  @CreateDateColumn({ nullable: true })
  createdAt: Date;

  @UpdateDateColumn({ nullable: true })
  updatedAt: Date;
}

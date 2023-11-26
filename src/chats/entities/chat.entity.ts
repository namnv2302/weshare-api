import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity({ name: 'chats' })
export class Chat {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ nullable: true })
  firstId: string;

  @Column({ nullable: true })
  secondId: string;

  @Column({ default: false })
  isDeleted: boolean;

  @Column({ type: Date, nullable: true })
  sendLastAt: Date;

  @Column({ type: Date, nullable: true })
  deletedAt: Date;

  @CreateDateColumn({ nullable: true })
  createdAt: Date;

  @UpdateDateColumn({ nullable: true })
  updatedAt: Date;
}

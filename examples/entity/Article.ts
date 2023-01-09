import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { User } from './User';

@Entity()
export class Article {
  @PrimaryGeneratedColumn()
  id!: number;
  @Column()
  content: string;
  @CreateDateColumn()
  createdAt: Date;
  @ManyToOne(() => User, { nullable: false })
  @JoinColumn()
  author: User;
  @Column({ default: 0 })
  likeCount: number;

  constructor(author: User, content: string) {
    this.author = author;
    this.content = content;
    this.createdAt = new Date();
    this.likeCount = 0;
  }
}

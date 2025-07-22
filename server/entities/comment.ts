import { Column, Entity, PrimaryGeneratedColumn, ManyToOne, JoinColumn, CreateDateColumn, UpdateDateColumn } from 'typeorm';

import type { Comment as CommentInterface } from '../../types/comment.type';

import { Activity } from './activity';
import { User } from './user';

@Entity()
export class Comment implements CommentInterface {
  @PrimaryGeneratedColumn()
  public id: number;

  // activity
  @ManyToOne(() => Activity, (activity: Activity) => activity.content, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'activityId' })
  public activity: Activity;

  // user relation
  @ManyToOne(() => User, (user: User) => user.activities, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'userId' })
  public user: User | null;

  @Column({ nullable: false })
  public userId: number;

  @Column({ nullable: false })
  public activityId: number;

  @CreateDateColumn()
  public createDate: Date;

  @UpdateDateColumn()
  public updateDate: Date;

  @Column({ type: 'text' })
  public text: string;
}

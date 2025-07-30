import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm';

import type { TeamComment, TeamCommentType } from '../../types/teamComment.type';

@Entity('team_comment')
export class TeamCommentEntity implements TeamComment {
  @PrimaryGeneratedColumn()
  public id: number;

  @Column({ type: 'tinyint' })
  public type: TeamCommentType;

  @CreateDateColumn()
  public createdAt: Date;

  @UpdateDateColumn()
  public updatedAt: Date;

  @Column({ type: 'text' })
  public comment: string;
}

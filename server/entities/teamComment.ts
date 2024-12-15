import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm';

import type { TeamCommentInterface, TeamCommentType } from '../../types/teamComment.type';

@Entity()
export class TeamComment implements TeamCommentInterface {
  @PrimaryGeneratedColumn()
  public id: number;

  @Column({ type: 'tinyint' })
  public type: TeamCommentType;

  @CreateDateColumn()
  public createDate: Date;

  @UpdateDateColumn()
  public updateDate: Date;

  @Column({ type: 'text' })
  public text: string;
}

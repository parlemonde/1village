import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
  ManyToOne,
  OneToMany,
  JoinColumn,
} from 'typeorm';

import type { Challenge as ChallengeInterface } from '../../types/challenge.type';

import { GameResponse } from './GameResponse';
import { Activity } from './activity';
import { User } from './user';
import { Village } from './village';

@Entity()
export class Challenge implements ChallengeInterface {
  @PrimaryGeneratedColumn()
  public id: number;
  @CreateDateColumn()
  public createDate: Date;

  @UpdateDateColumn()
  public updateDate: Date;

  @DeleteDateColumn()
  public deleteDate: Date;

  @ManyToOne(() => User, (user: User) => user.challenges, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'userId' })
  public user: User | null;

  @Column({ nullable: false })
  public userId: number;

  @ManyToOne(() => Village, (village: Village) => village.challenges, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'villageId' })
  public village: Village | null;

  @Column({ nullable: false })
  public villageId: number;

  @ManyToOne(() => Activity, (activity: Activity) => activity.challenges, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'activityId' })
  public activity: Activity | null;

  @Column({ nullable: false })
  public activityId: number;

  @OneToMany(() => MimiqueResponse, (mimiqueResponse: MimiqueResponse) => mimiqueResponse.challenge)
  public responses: MimiqueResponse[];

  @Column({ type: 'int', nullable: false })
  public type: number;
}

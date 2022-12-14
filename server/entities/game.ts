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
  Relation,
} from 'typeorm';

import type { Game as GameInterface } from '../../types/game.type';
import { Activity } from './activity';
import { GameResponse } from './gameResponse';
import { User } from './user';
import { Village } from './village';

@Entity()
export class Game implements GameInterface {
  @PrimaryGeneratedColumn()
  public id: number;
  @CreateDateColumn()
  public createDate: Date;

  @UpdateDateColumn()
  public updateDate: Date;

  @DeleteDateColumn()
  public deleteDate: Date;

  @ManyToOne(() => User, (user: User) => user.games, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'userId' })
  public user: Relation<User> | null;
  @Column({ nullable: false })
  public userId: number;

  @ManyToOne(() => Village, (village: Village) => village.games, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'villageId' })
  public village: Relation<Village> | null;
  @Column({ nullable: false })
  public villageId: number;

  @ManyToOne(() => Activity, (activity: Activity) => activity.games, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'activityId' })
  public activity: Relation<Activity> | null;
  @Column({ nullable: false })
  public activityId: number;

  @OneToMany(() => GameResponse, (gameResponse: GameResponse) => gameResponse.game)
  public responses: Relation<GameResponse>[];

  @Column({ type: 'tinyint', nullable: true })
  public type: number | null;

  @Column({ type: 'text' })
  public content: string;
}

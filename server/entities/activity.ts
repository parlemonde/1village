import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
  ManyToOne,
  JoinColumn,
  OneToMany,
  Index,
} from 'typeorm';

import type { Activity as ActivityInterface, AnyData, ActivityContent } from '../../types/activity.type';
import { ActivityType, ActivityStatus } from '../../types/activity.type';
import { VillagePhase } from '../../types/village.type';
import { Classroom } from './classroom';
import { Game } from './game';
import { Image } from './image';
import { User } from './user';
import { Village } from './village';

@Entity()
export class Activity implements ActivityInterface<AnyData> {
  @PrimaryGeneratedColumn()
  public id: number;

  @Column({
    type: 'tinyint',
    default: ActivityType.PRESENTATION,
    nullable: false,
  })
  public type: number;

  @Column({ type: 'tinyint', nullable: true })
  public subType: number | null;

  @Column({ type: 'tinyint', nullable: false, default: VillagePhase.DISCOVER })
  public phase: number;

  @Column({ type: 'text', nullable: true })
  public phaseStep: string | null;

  @Column({
    type: 'tinyint',
    nullable: false,
    default: ActivityStatus.PUBLISHED,
  })
  public status: number;

  @CreateDateColumn()
  public createDate: Date;

  @Column()
  public publishDate: Date;

  @UpdateDateColumn()
  public updateDate: Date;

  @DeleteDateColumn()
  public deleteDate: Date;

  @Column({ type: 'json', nullable: false })
  public data: AnyData & { draftUrl?: string };

  @Column({ type: 'json', nullable: false })
  public content: ActivityContent[];

  // user relation
  @ManyToOne(() => User, (user: User) => user.activities, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'userId' })
  public user: User | null;

  @Index()
  @Column({ nullable: false })
  public userId: number;

  // village relation
  @ManyToOne(() => Village, (village: Village) => village.activities, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'villageId' })
  public village: Village | null;

  @Column({ nullable: false })
  public villageId: number | undefined;

  // Answer other activity
  @ManyToOne(() => Activity, { onDelete: 'SET NULL' })
  @JoinColumn({ name: 'responseActivityId' })
  public responseActivity: Activity | null;

  @Column({ nullable: true })
  public responseActivityId: number | null;

  @Column({
    type: 'tinyint',
    nullable: true,
  })
  public responseType: number | null;

  @Column({
    type: 'boolean',
    default: false,
  })
  public isPinned: boolean;

  @Column({
    type: 'boolean',
    default: false,
  })
  public displayAsUser?: boolean;

  @Column({
    type: 'boolean',
    default: true,
  })
  public isVisibleToParent?: boolean;

  @Column({
    type: 'tinyint',
    default: null,
  })
  public parentActivityId?: number;

  @Column({
    type: 'boolean',
    default: null,
  })
  public isDisplayed?: boolean;

  public commentCount?: number;

  @OneToMany(() => Game, (game: Game) => game.activity)
  public games: Game[];

  @OneToMany(() => Image, (image: Image) => image.activity)
  public images: Image[];

  @ManyToOne(() => Classroom, (classroom) => classroom.activities)
  @JoinColumn({ name: 'classroomId' })
  public classroom: Classroom;

  @Column({ nullable: true })
  public classroomId: number | null;
}

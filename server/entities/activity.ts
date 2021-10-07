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

import type { Activity as ActivityInterface } from '../../types/activity.type';
import { ActivityType, ActivityStatus } from '../../types/activity.type';

import { ActivityData } from './activityData';
import { User } from './user';
import { Village } from './village';

export { ActivityType, ActivityStatus };

@Entity()
export class Activity implements ActivityInterface {
  @PrimaryGeneratedColumn()
  public id: number;

  @Column({
    type: 'enum',
    enum: ActivityType,
    default: ActivityType.PRESENTATION,
  })
  public type: ActivityType;

  @Column({ type: 'tinyint', nullable: true })
  public subType: number | null;

  @Column({
    type: 'enum',
    enum: ActivityStatus,
    nullable: false,
    default: ActivityStatus.PUBLISHED,
  })
  public status: ActivityStatus;

  @CreateDateColumn()
  public createDate: Date;

  @UpdateDateColumn()
  public updateDate: Date;

  @DeleteDateColumn()
  public deleteDate: Date;

  // data relation
  @OneToMany(() => ActivityData, (d: ActivityData) => d.activity)
  public content: ActivityData[] | null;

  // user relation
  @ManyToOne(() => User, (user: User) => user.activities, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'userId' })
  public user: User | null;

  @Column({ nullable: false })
  public userId: number;

  // village relation
  @ManyToOne(() => Village, (village: Village) => village.activities, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'villageId' })
  public village: Village | null;

  @Column({ nullable: false })
  public villageId: number;

  // Answer other activity
  @ManyToOne(() => Activity, { onDelete: 'SET NULL' })
  @JoinColumn({ name: 'responseActivityId' })
  public responseActivity: Activity | null;

  @Column({ nullable: true })
  public responseActivityId: number | null;

  @Column({
    type: 'enum',
    enum: ActivityType,
    nullable: true,
  })
  public responseType: ActivityType | null;

  @Column({
    type: 'boolean',
    default: false,
  })
  public isPinned: boolean;

  public commentCount?: number;
}

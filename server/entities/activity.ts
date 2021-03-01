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

import { Activity as ActivityInterface, ActivityType } from '../../types/activity.type';

import { ActivityData } from './activityData';
import { User } from './user';
import { Village } from './village';

export { ActivityType };

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

  public commentCount?: number;
}

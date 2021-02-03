import { Column, Entity, PrimaryGeneratedColumn, ManyToOne, JoinColumn } from "typeorm";

import { ActivityData as ActivityDataInterface, ActivityDataType } from "../../types/activityData.type";

import { Activity } from "./activity";

export type { ActivityDataType };

@Entity()
export class ActivityData implements ActivityDataInterface {
  @PrimaryGeneratedColumn()
  public id: number;

  // activity
  @ManyToOne(() => Activity, (activity: Activity) => activity.content, { onDelete: "CASCADE" })
  @JoinColumn({ name: "activityId" })
  public activity: Activity;

  @Column({ nullable: false })
  public activityId: number;

  @Column({ default: 0 })
  public order: number;

  @Column({ type: "varchar", length: "8" })
  public key: ActivityDataType;

  @Column({ type: "text" })
  public value: string;
}

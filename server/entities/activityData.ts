import { Column, Entity, PrimaryGeneratedColumn, ManyToOne, JoinColumn } from "typeorm";

import { ActivityData as ActivityDataInterface } from "../../types/activityData.type";

import { Activity } from "./activity";

@Entity()
export class ActivityData implements ActivityDataInterface {
  @PrimaryGeneratedColumn()
  public id: number;

  // activity
  @ManyToOne(() => Activity, (activity: Activity) => activity.data, { onDelete: "CASCADE" })
  @JoinColumn({ name: "villageId" })
  public activity: Activity;

  @Column({ nullable: false })
  public activityId: number;

  @Column({ default: 0 })
  public order: number;

  @Column({ type: "varchar", length: "8", select: false })
  public key: "text" | "video" | "image" | "json";

  @Column({ type: "varchar", length: 3000, default: "", select: false })
  public value: string;
}

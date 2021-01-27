import { Column, Entity, PrimaryGeneratedColumn, ManyToOne, JoinColumn, OneToMany } from "typeorm";

import { User as UserInterface, UserType } from "../../types/user.type";

import { Activity } from "./activity";
import { Village } from "./village";

export { UserType };

@Entity()
export class User implements UserInterface {
  @PrimaryGeneratedColumn()
  public id: number;

  @Column({ type: "varchar", length: 150, unique: true })
  public email: string;

  @Column({ type: "varchar", length: 50, unique: true })
  public pseudo: string;

  @Column({ type: "varchar", length: 60, default: "" })
  public teacherName: string;

  @Column({ type: "varchar", length: 50, default: "" })
  public level: string;

  @Column({ type: "varchar", length: 200, default: "" })
  public school: string;

  @Column({ default: 0 })
  public accountRegistration: number; // 0 to 3 -> Ok, 4 -> Account blocked, 10 -> Account use PLM SSO

  @Column({ type: "varchar", length: 95, select: false })
  public passwordHash?: string;

  @Column({ type: "varchar", length: 95, default: "", select: false })
  public verificationHash?: string;

  @Column({
    type: "enum",
    enum: UserType,
    default: UserType.TEACHER,
  })
  type: UserType;

  @ManyToOne(() => Village, (village: Village) => village.users, { onDelete: "SET NULL" })
  @JoinColumn({ name: "villageId" })
  public village: Village | null;

  @Column({ nullable: true })
  public villageId: number | null;

  @Column({ type: "varchar", length: 2, nullable: false })
  public countryCode: string;

  @OneToMany(() => Activity, (activity: Activity) => activity.user)
  public activities: Activity[];
}

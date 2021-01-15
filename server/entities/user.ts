import { Column, Entity, PrimaryGeneratedColumn, ManyToOne, JoinColumn } from "typeorm";

import { User as UserInterface, UserType } from "../../types/user.type";

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

  @Column({ type: "varchar", length: 50, default: "" })
  public teacherName: string;

  @Column({ type: "varchar", length: 50, default: "" })
  public level: string;

  @Column({ type: "varchar", length: 200, default: "" })
  public school: string;

  @Column({ default: 0 })
  public accountRegistration?: number;

  @Column({ type: "varchar", length: 95 })
  public passwordHash?: string;

  @Column({ type: "varchar", length: 95, default: "" })
  public verificationHash?: string;

  @Column({
    type: "enum",
    enum: UserType,
    default: UserType.TEACHER,
  })
  type: UserType;

  @ManyToOne(() => Village, (village: Village) => village.users)
  @JoinColumn({ name: "villageId" })
  public village: Village | null;

  @Column({ nullable: true })
  public villageId: number | null;

  @Column({ type: "varchar", length: 2, nullable: false })
  public countryCode: string;

  public withoutPassword(): User {
    delete this.passwordHash;
    delete this.verificationHash;
    delete this.accountRegistration;
    return this;
  }
}

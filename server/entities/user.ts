import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

import { User as UserInterface, UserType } from "../../types/user.type";

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
    default: 0,
  })
  type: UserType;

  public withoutPassword(): User {
    delete this.passwordHash;
    delete this.verificationHash;
    delete this.accountRegistration;
    return this;
  }
}

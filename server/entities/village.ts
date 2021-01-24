import { Column, Entity, PrimaryGeneratedColumn, OneToMany } from "typeorm";

import type { Village as VillageInterface } from "../../types/village.type";

import { User } from "./user";

@Entity()
export class Village implements VillageInterface {
  @PrimaryGeneratedColumn()
  public id: number;

  @Column({ type: "integer", nullable: true })
  public plmId: number | null;

  @Column({ type: "varchar", length: 80, nullable: false })
  public name: string;

  @Column("simple-array")
  countries: string[];

  @OneToMany(() => User, (user: User) => user.village)
  users: User[];
}

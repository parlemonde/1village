import { Column, Entity, CreateDateColumn, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Token {
  @PrimaryGeneratedColumn()
  public id: number;

  @Column({ type: "varchar", length: 95 })
  public token: string;

  @Column()
  public userId: number;

  @CreateDateColumn()
  public date: Date;
}

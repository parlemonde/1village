import { Column, Entity, CreateDateColumn, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Token {
  @PrimaryGeneratedColumn()
  public id: number;

  @Column({ type: "varchar", length: 95 })
  public token: string;

  @Column()
  public userId: number;

  @Column({ type: "varchar", length: 36, nullable: true })
  public clientId: string | null;

  @CreateDateColumn()
  public date: Date;

  @Column({ type: "varchar", length: 100, nullable: true })
  redirectUri: string | null;

  @Column({ type: "varchar", length: 60, nullable: true })
  codeChallenge: string | null;
}

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

import type { Mimique as MimiqueInterface } from '../../types/mimique.type';

import { Activity } from './activity';
import { MimiqueResponse } from './mimiqueResponse';
import { User } from './user';
import { Village } from './village';

@Entity()
export class Mimique implements MimiqueInterface {
  @PrimaryGeneratedColumn()
  public id: number;
  @CreateDateColumn()
  public createDate: Date;

  @UpdateDateColumn()
  public updateDate: Date;

  @DeleteDateColumn()
  public deleteDate: Date;

  @ManyToOne(() => User, (user: User) => user.mimiques, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'userId' })
  public user: User | null;

  @Column({ nullable: false })
  public userId: number;

  @ManyToOne(() => Village, (village: Village) => village.mimiques, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'villageId' })
  public village: Village | null;

  @Column({ nullable: false })
  public villageId: number;

  @ManyToOne(() => Activity, (activity: Activity) => activity.mimiques, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'activityId' })
  public activity: Activity | null;

  @Column({ nullable: false })
  public activityId: number;

  @OneToMany(() => MimiqueResponse, (mimiqueResponse: MimiqueResponse) => mimiqueResponse.mimique)
  public responses: MimiqueResponse[];

  @Column({ type: 'text', nullable: false })
  public origine: string;
  @Column({ type: 'text', nullable: false })
  public signification: string;
  @Column({ type: 'text', nullable: false })
  public fakeSignification1: string;
  @Column({ type: 'text', nullable: false })
  public fakeSignification2: string;
  @Column({ type: 'varchar', length: 255, nullable: false })
  public video: string;
}

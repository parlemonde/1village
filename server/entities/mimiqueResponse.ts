import { Column, Entity, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, DeleteDateColumn, ManyToOne, JoinColumn } from 'typeorm';

import type { MimiqueResponse as MimiqueResponseInterface } from '../../types/mimiqueResponse.type';
import { MimiqueResponseValue } from '../../types/mimiqueResponse.type';

import { Mimique } from './mimique';
import { User } from './user';
import { Village } from './village';

@Entity()
export class MimiqueResponse implements MimiqueResponseInterface {
  @PrimaryGeneratedColumn()
  public id: number;
  @CreateDateColumn()
  public createDate: Date;

  @UpdateDateColumn()
  public updateDate: Date;

  @DeleteDateColumn()
  public deleteDate: Date;

  // user relation
  @ManyToOne(() => User, (user: User) => user.mimiqueResponses, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'userId' })
  public user: User | null;

  @Column({ nullable: false })
  public userId: number;

  @ManyToOne(() => Village, (village: Village) => village.mimiqueResponses, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'villageId' })
  public village: Village | null;

  @Column({ nullable: false })
  public villageId: number;

  @ManyToOne(() => Mimique, (mimique: Mimique) => mimique.responses, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'mimiqueId' })
  public mimique: Mimique | null;

  @Column({ nullable: false })
  public mimiqueId: number;

  @Column({
    type: 'enum',
    enum: MimiqueResponseValue,
  })
  public value: MimiqueResponseValue;
}

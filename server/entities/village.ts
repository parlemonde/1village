import { Column, Entity, PrimaryGeneratedColumn, OneToMany } from 'typeorm';

import type { Village as VillageInterface } from '../../types/village.type';

import { Activity } from './activity';
import { Mimique } from './mimique';
import { MimiqueResponse } from './mimiqueResponse';
import { User } from './user';

enum VillagePhase {
  DISCOVER = 1,
  EXCHANGE = 2,
  IMAGINE = 3,
}

@Entity()
export class Village implements VillageInterface {
  @PrimaryGeneratedColumn()
  public id: number;

  @Column({ type: 'integer', nullable: true })
  public plmId: number | null;

  @Column({ type: 'varchar', length: 80, nullable: false })
  public name: string;

  @Column('simple-array')
  public countries: string[];

  @Column({
    type: 'enum',
    enum: VillagePhase,
    default: VillagePhase.DISCOVER,
  })
  public activePhase: VillagePhase;

  @OneToMany(() => User, (user: User) => user.village)
  public users: User[];

  @OneToMany(() => Activity, (activity: Activity) => activity.village)
  public activities: Activity[];

  @OneToMany(() => Mimique, (mimique: Mimique) => mimique.village)
  public mimiques: Mimique[];

  @OneToMany(() => MimiqueResponse, (mimiqueResponse: MimiqueResponse) => mimiqueResponse.user)
  public mimiqueResponses: MimiqueResponse[];
}

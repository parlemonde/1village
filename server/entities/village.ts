import { Column, Entity, PrimaryGeneratedColumn, OneToMany } from 'typeorm';

import type { Country } from '../../types/country.type';
import type { Village as VillageInterface } from '../../types/village.type';
import { VillagePhase } from '../../types/village.type';
import { countriesMap } from '../utils/countries-map';

import { Activity } from './activity';
import { MimiqueResponse } from './mimiqueResponse';
import { Mimique } from './mimique';
import { User } from './user';

export { VillagePhase };

@Entity()
export class Village implements VillageInterface {
  [x: string]: any;
  @PrimaryGeneratedColumn()
  public id: number;

  @Column({ type: 'integer', nullable: true })
  public plmId: number | null;

  @Column({ type: 'varchar', length: 80, nullable: false })
  public name: string;

  @Column('simple-array')
  set countryCodes(newCountryCodes: string[]) {
    this.countries = newCountryCodes.map((isoCode) => countriesMap[isoCode]).filter((c) => c !== undefined);
  }
  get countryCodes() {
    return this.countries.map((c) => c.isoCode);
  }
  public countries: Country[];

  @Column({
    type: 'tinyint',
    default: VillagePhase.DISCOVER,
  })
  public activePhase: number;

  @OneToMany(() => User, (user: User) => user.village)
  public users: User[];

  @OneToMany(() => Activity, (activity: Activity) => activity.village)
  public activities: Activity[];

  @OneToMany(() => Mimique, (mimique: Mimique) => mimique.village)
  public mimiques: Mimique[];

  @OneToMany(() => MimiqueResponse, (mimiqueResponse: MimiqueResponse) => mimiqueResponse.user)
  public mimiqueResponses: MimiqueResponse[];
}

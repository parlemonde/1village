import { Column, Entity, JoinColumn, PrimaryGeneratedColumn, OneToMany, OneToOne } from 'typeorm';

import type { Country } from '../../types/country.type';
import type { Village as VillageInterface } from '../../types/village.type';
import { VillagePhase } from '../../types/village.type';
import { countriesMap } from '../utils/countries-map';
import { Activity } from './activity';
import { Classroom } from './classroom';
import { Game } from './game';
import { GameResponse } from './gameResponse';
import { Image } from './image';
import { User } from './user';

export { VillagePhase };

@Entity()
export class Village implements VillageInterface {
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

  @OneToOne(() => Activity, { onDelete: 'SET NULL' })
  @JoinColumn({ name: 'anthemId' })
  public anthem: Activity | null;

  @Column({ nullable: true })
  public anthemId: number | null;

  @OneToMany(() => User, (user: User) => user.village)
  public users: User[];

  @OneToMany(() => Activity, (activity: Activity) => activity.village)
  public activities: Activity[];

  @OneToMany(() => Game, (game: Game) => game.village)
  public games: Game[];

  @OneToMany(() => GameResponse, (gameResponse: GameResponse) => gameResponse.user)
  public gameResponses: GameResponse[];

  @OneToMany(() => Image, (image: Image) => image.village)
  public images: Image[];

  @OneToMany(() => Classroom, (classroom: Classroom) => classroom.village)
  public classrooms: Classroom[];
}

import { Column, Entity, PrimaryGeneratedColumn, ManyToOne, JoinColumn, OneToMany } from 'typeorm';

import type { Country } from '../../types/country.type';
import type { User as UserInterface } from '../../types/user.type';
import { UserType } from '../../types/user.type';
import { countriesMap } from '../utils/countries-map';
import { Activity } from './activity';
import { Game } from './game';
import { GameResponse } from './gameResponse';
import { Image } from './image';
import { UserToStudent } from './userToStudent';
import { Village } from './village';

export { UserType };

@Entity()
export class User implements UserInterface {
  @PrimaryGeneratedColumn()
  public id: number;

  @Column({ type: 'varchar', length: 255, unique: true })
  public email: string;

  @Column({ type: 'varchar', length: 50, default: '' })
  public pseudo: string;

  @Column({ type: 'varchar', length: 50, default: '' })
  public firstname: string;

  @Column({ type: 'varchar', length: 100, default: '' })
  public lastname: string;

  @Column({ type: 'varchar', length: 50, default: '' })
  public level: string;

  @Column({ type: 'varchar', length: 255, default: '' })
  public school: string;

  @Column({ type: 'varchar', length: 128, default: '' })
  public city: string;

  @Column({ type: 'varchar', length: 20, default: '' })
  public postalCode: string;

  @Column({ type: 'varchar', length: 255, default: '' })
  public address: string;

  @Column({ type: 'text', nullable: true, default: null })
  public avatar: string | null;

  @Column({ type: 'varchar', length: 400, nullable: true, default: null })
  public displayName: string | null;

  @Column({ default: 0 })
  public accountRegistration: number; // 0 to 3 -> Ok, 4 -> Account blocked, 10 -> Account use PLM SSO

  @Column({ type: 'varchar', length: 300, select: false })
  public passwordHash?: string;

  @Column({ type: 'varchar', length: 300, default: '', select: false })
  public verificationHash?: string;

  @Column({ type: 'tinyint', default: 0 })
  public firstLogin: number;

  @Column({
    type: 'tinyint',
    default: UserType.TEACHER,
  })
  type: UserType;

  @ManyToOne(() => Village, (village: Village) => village.users, { onDelete: 'SET NULL' })
  @JoinColumn({ name: 'villageId' })
  public village: Village | null;

  @Column({ nullable: true })
  public villageId: number | null;

  @Column({ type: 'varchar', length: 2, nullable: true })
  set countryCode(newCountryCode: string) {
    this.country = countriesMap[newCountryCode] || countriesMap['FR'];
  }
  get countryCode() {
    return this.country?.isoCode;
  }
  public country: Country;

  @Column({ type: 'decimal', precision: 11, scale: 8, nullable: false, default: 0 })
  set positionLat(newLat: string) {
    if (!this.position) {
      this.position = { lat: 0, lng: 0 };
    }
    this.position.lat = parseFloat(newLat) || 0;
  }
  get positionLat() {
    return `${this.position?.lat || 0}`;
  }

  @Column({ type: 'decimal', precision: 11, scale: 8, nullable: false, default: 0 })
  set positionLon(newLon: string) {
    if (!this.position) {
      this.position = { lat: 0, lng: 0 };
    }
    this.position.lng = parseFloat(newLon) || 0;
  }
  get positionLon() {
    return `${this.position?.lng || 0}`;
  }

  public position: { lat: number; lng: number };

  @Column({ type: 'boolean', default: false })
  public hasAcceptedNewsletter: boolean;

  @Column({ type: 'varchar', length: 400, default: 'français' })
  public language: string;

  @OneToMany(() => Activity, (activity: Activity) => activity.user)
  public activities: Activity[];

  @OneToMany(() => Game, (game: Game) => game.user)
  public games: Game[];

  @OneToMany(() => GameResponse, (gameResponse: GameResponse) => gameResponse.user)
  public gameResponses: GameResponse[];

  @OneToMany(() => Image, (image: Image) => image.user)
  public images: Image[];

  public mascotteId?: number;

  @OneToMany(() => UserToStudent, (userToStudent) => userToStudent.user)
  public userToStudents: UserToStudent[];
}

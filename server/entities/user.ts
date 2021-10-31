import { Column, Entity, PrimaryGeneratedColumn, ManyToOne, JoinColumn, OneToMany } from 'typeorm';

import type { Country } from '../../types/country.type';
import type { User as UserInterface } from '../../types/user.type';
import { UserType } from '../../types/user.type';
import { countriesMap } from '../utils/countries-map';

import { Activity } from './activity';
import { Village } from './village';

export { UserType };

@Entity()
export class User implements UserInterface {
  @PrimaryGeneratedColumn()
  public id: number;

  @Column({ type: 'varchar', length: 255, unique: true })
  public email: string;

  @Column({ type: 'varchar', length: 50, unique: true })
  public pseudo: string;

  @Column({ type: 'varchar', length: 50, default: '' })
  public level: string;

  @Column({ type: 'varchar', length: 255, default: '' })
  public school: string;

  @Column({ type: 'varchar', length: 128, default: '' })
  public city: string;

  @Column({ type: 'varchar', length: 10, default: '' })
  public postalCode: string;

  @Column({ type: 'varchar', length: 255, default: '' })
  public address: string;

  @Column({ type: 'text', nullable: true, default: null })
  public avatar: string | null;

  @Column({ type: 'varchar', length: 400, nullable: true, default: null })
  public displayName: string | null;

  @Column({ default: 0 })
  public accountRegistration: number; // 0 to 3 -> Ok, 4 -> Account blocked, 10 -> Account use PLM SSO

  @Column({ type: 'varchar', length: 95, select: false })
  public passwordHash?: string;

  @Column({ type: 'varchar', length: 95, default: '', select: false })
  public verificationHash?: string;

  @Column({ type: 'bool', default: true })
  public firstLogin: boolean;

  @Column({
    type: 'enum',
    enum: UserType,
    default: UserType.TEACHER,
  })
  type: UserType;

  @ManyToOne(() => Village, (village: Village) => village.users, { onDelete: 'SET NULL' })
  @JoinColumn({ name: 'villageId' })
  public village: Village | null;

  @Column({ nullable: true })
  public villageId: number | null;

  @Column({ type: 'varchar', length: 2, nullable: false })
  set countryCode(newCountryCode: string) {
    this.country = countriesMap[newCountryCode] || countriesMap['FR'];
  }
  get countryCode() {
    return this.country.isoCode;
  }
  public country: Country;

  @OneToMany(() => Activity, (activity: Activity) => activity.user)
  public activities: Activity[];

  public mascotteId?: number;
}

import { Entity, PrimaryGeneratedColumn, Column, OneToOne, OneToMany, ManyToOne, JoinColumn } from 'typeorm';

import type { Country } from '../../types/country.type';
import { countriesMap } from '../utils/countries-map';
import { Student } from './student';
import { User } from './user';
import { Village } from './village';

@Entity()
export class Classroom {
  @PrimaryGeneratedColumn()
  public id: number;

  @Column({ nullable: true, default: null })
  public name: string;

  @Column({ nullable: true, default: null })
  public avatar: string;

  @Column({ nullable: true, default: 0 })
  public delayedDays: number;

  @Column({ type: 'varchar', length: 2, nullable: true })
  set countryCode(newCountryCode: string) {
    this.country = countriesMap[newCountryCode] || countriesMap['FR'];
  }
  get countryCode() {
    return this.country?.isoCode;
  }
  public country: Country;

  @Column({
    type: 'boolean',
    nullable: true,
    default: false,
  })
  public hasVisibilitySetToClass: boolean;

  @OneToOne(() => User)
  @JoinColumn({ name: 'userId' })
  public user: User;

  @ManyToOne(() => Village, (village: Village) => village.classrooms)
  @JoinColumn({ name: 'villageId' })
  public village: Village;

  @OneToMany(() => Student, (student: Student) => student.classroom)
  public students: Student[];
}

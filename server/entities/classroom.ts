import { Entity, PrimaryGeneratedColumn, Column, OneToOne, OneToMany, ManyToOne, JoinColumn } from 'typeorm';

import { Country } from './country';
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

  @ManyToOne(() => Country, (country: Country) => country)
  public country: Country | null;

  @Column({
    type: 'boolean',
    nullable: true,
    default: false,
  })
  public hasVisibilitySetToClass: boolean;

  @OneToOne(() => User, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'userId' })
  public user: User;

  @ManyToOne(() => Village, (village: Village) => village.classrooms, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'villageId' })
  public village: Village | null;

  @Column({ nullable: false })
  public villageId: number;

  @OneToMany(() => Student, (student: Student) => student.classroom, { onDelete: 'CASCADE' })
  public students: Student[];
}

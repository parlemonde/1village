import { Entity, PrimaryGeneratedColumn, Column, OneToOne, OneToMany, ManyToOne, JoinColumn } from 'typeorm';

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

  @Column({ nullable: true, default: null })
  public delayedDays: number;

  @Column({
    type: 'boolean',
    default: false,
  })
  public hasVisibilitySetToClass?: boolean;

  @OneToOne(() => User)
  public user: User;

  @ManyToOne(() => Village, (village: Village) => village.classrooms)
  @JoinColumn({ name: 'villageId' })
  public village: Village;

  @OneToMany(() => Student, (student: Student) => student.classroom)
  public students: Student[];
}

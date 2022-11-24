import { Entity, PrimaryGeneratedColumn, Column, OneToOne, OneToMany, ManyToOne } from 'typeorm';

import { Student } from './student';
import { User } from './user';
import { Village } from './village';

@Entity()
export class Classroom {
  @PrimaryGeneratedColumn()
  public id!: number;

  @Column()
  public userId!: number;

  @Column()
  public villageId!: number;

  @Column()
  public name!: string;

  @Column()
  public avatar: number;

  @Column()
  public delayedDays: number;

  @OneToOne(() => User, (user) => user.classroom)
  public user!: User;

  @ManyToOne(() => Village, (village) => village.classrooms)
  public village!: Village;

  @OneToMany(() => Student, (student) => student.classroom)
  public students!: Student;
}

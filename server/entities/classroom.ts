import type { Relation } from 'typeorm';
import { Entity, PrimaryGeneratedColumn, Column, OneToOne, OneToMany, ManyToOne, JoinColumn } from 'typeorm';

import { Student } from './student';
import { User } from './user';
import { Village } from './village';

@Entity()
export class Classroom {
  @PrimaryGeneratedColumn()
  public id: number;

  @Column()
  public userId: number;

  @Column()
  public villageId: number;

  @Column({ nullable: true, default: null })
  public name: string;

  @Column({ nullable: true, default: null })
  public avatar: string;

  @Column({ nullable: true, default: null })
  public delayedDays: number;

  @OneToOne(() => User)
  public users: Relation<User>;

  @ManyToOne(() => Village, (village) => village.classrooms)
  @JoinColumn({ name: 'villageId' })
  public village: Relation<Village>;

  @OneToMany(() => Student, (student: Student) => student.classroom)
  public students: Relation<Student>[];
}

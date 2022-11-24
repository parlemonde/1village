import { Entity, Column, ManyToOne, OneToMany, PrimaryGeneratedColumn, JoinColumn } from 'typeorm';

import { Classroom } from './classroom';
import { UserToStudent } from './userToStudent';

@Entity()
export class Student {
  @PrimaryGeneratedColumn()
  public id!: number;

  @Column()
  public classroomId!: number;

  @Column({ type: 'varchar', length: 100 })
  public firstname!: string;

  @Column({ type: 'varchar', length: 255 })
  public lastname!: string;

  //classroom relation
  @ManyToOne(() => Classroom, (classroom) => classroom.students)
  @JoinColumn({ name: 'classroomId' })
  classroom: Classroom | null;

  @OneToMany(() => UserToStudent, (userToStudent) => userToStudent.student)
  public userToStudents!: UserToStudent[] | null;
}

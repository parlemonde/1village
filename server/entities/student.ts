import { Entity, Column, ManyToOne, OneToMany, PrimaryGeneratedColumn, JoinColumn } from 'typeorm';

import { Classroom } from './classroom';
import { UserToStudent } from './userToStudent';

@Entity()
export class Student {
  @PrimaryGeneratedColumn()
  public id: number;

  @Column({ type: 'varchar', length: 100, nullable: true })
  public firstname: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  public lastname: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  public hashedCode: string;

  @Column({ type: 'tinyint', nullable: true })
  public numLinkedAccount: number;

  //classroom relation
  @ManyToOne(() => Classroom, (classroom) => classroom.students)
  @JoinColumn({ name: 'classroomId' })
  classroom: Classroom;

  @OneToMany(() => UserToStudent, (userToStudent) => userToStudent.student, {
    cascade: ['insert', 'update', 'remove'],
  })
  public userToStudents: UserToStudent[];
}

import { Entity, Column, ManyToOne, OneToMany, PrimaryGeneratedColumn, JoinColumn } from 'typeorm';

import { Classroom } from './classroom';
import { UserToStudent } from './userToStudent';

@Entity()
export class Student {
  @PrimaryGeneratedColumn()
  public id: number;

  @Column()
  public classroomId: number;

  @Column({ type: 'varchar', length: 100 })
  public firstname: string;

  @Column({ type: 'varchar', length: 255 })
  public lastname: string;

  @Column({ type: 'varchar', length: 255 })
  public hashedCode: string;

  @Column({ type: 'tinyint', nullable: true })
  public numLinkedAccount: number;

  //classroom relation
  @ManyToOne(() => Classroom, (classroom: Classroom) => classroom.students)
  @JoinColumn({ name: 'classroomId' })
  public classroom: Classroom | null;

  @OneToMany(() => UserToStudent, (userToStudent: UserToStudent) => userToStudent.student)
  public userToStudents: UserToStudent[] | null;
}

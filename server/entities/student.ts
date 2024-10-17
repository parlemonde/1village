import { Entity, Column, ManyToOne, OneToMany, PrimaryGeneratedColumn, JoinColumn, CreateDateColumn } from 'typeorm';

import { Classroom } from './classroom';
import { UserToStudent } from './userToStudent';

@Entity()
export class Student {
  @PrimaryGeneratedColumn()
  public id: number;

  @CreateDateColumn()
  createdAt: Date;

  @Column({ type: 'varchar', length: 100, nullable: true })
  public firstname: string;

  @Column({ type: 'varchar', length: 255 })
  public lastname: string;

  @Column({ type: 'varchar', length: 255 })
  public hashedCode: string;

  @Column({ type: 'tinyint', nullable: true, default: 0 })
  public numLinkedAccount: number;

  //classroom relation
  @ManyToOne(() => Classroom, (classroom: Classroom) => classroom.students, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'classroomId' })
  classroom: Classroom;

  @OneToMany(() => UserToStudent, (userToStudent) => userToStudent.student)
  public userToStudents: UserToStudent[];
}

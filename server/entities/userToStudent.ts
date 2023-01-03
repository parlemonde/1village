import { Entity, Column, ManyToOne, PrimaryGeneratedColumn, JoinColumn } from 'typeorm';

import { Student } from './student';
import { User } from './user';

@Entity()
export class UserToStudent {
  @PrimaryGeneratedColumn()
  public id: number;

  @Column({ nullable: true, default: 0 })
  public userId: number;

  @Column({ nullable: true, default: 0 })
  public studentId: number;

  @ManyToOne(() => User, (user) => user.userToStudents)
  @JoinColumn({ name: 'userId' })
  public user: User;

  @ManyToOne(() => Student, (student) => student.userToStudents)
  @JoinColumn({ name: 'studentId' })
  public student: Student;
}

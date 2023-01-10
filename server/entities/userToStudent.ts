import { Entity, Column, ManyToOne, PrimaryGeneratedColumn, JoinColumn } from 'typeorm';

import { Student } from './student';
import { User } from './user';

@Entity()
export class UserToStudent {
  @PrimaryGeneratedColumn()
  public id!: number;

  @Column()
  public userId!: number;

  @Column()
  public studentId!: number;

  @Column()
  public hashedCode!: string;

  @ManyToOne(() => User, (user) => user.userToStudents)
  @JoinColumn({ name: 'userId' })
  public user!: User;

  @ManyToOne(() => Student, (student) => student.userToStudents)
  @JoinColumn({ name: 'studentId' })
  public student!: Student;
}

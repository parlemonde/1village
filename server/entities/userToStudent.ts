import { Entity, Column, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';

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
  public user!: User;

  @ManyToOne(() => Student, (student) => student.userToStudents)
  public student!: Student;
}

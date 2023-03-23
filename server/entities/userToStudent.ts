import { Entity, ManyToOne, PrimaryGeneratedColumn, JoinColumn } from 'typeorm';

import { Student } from './student';
import { User } from './user';

@Entity()
export class UserToStudent {
  @PrimaryGeneratedColumn()
  public id: number;

  @ManyToOne(() => User, (user) => user.userToStudents, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'userId' })
  public user: User;

  @ManyToOne(() => Student, (student) => student.userToStudents, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'studentId' })
  public student: Student;
}

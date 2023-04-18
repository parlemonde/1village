import type { Repository } from 'typeorm';
import { Entity, ManyToOne, PrimaryGeneratedColumn, JoinColumn, AfterInsert, BeforeRemove } from 'typeorm';

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

  @BeforeRemove()
  public onRemoved() { }

  @AfterInsert()
  public onCreated() {
    console.log('******** Row inserted ********');
  }
}

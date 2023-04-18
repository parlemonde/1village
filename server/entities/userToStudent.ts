import { Entity, ManyToOne, PrimaryGeneratedColumn, JoinColumn, AfterRemove, AfterInsert } from 'typeorm';

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

  @AfterRemove()
  public onRemoved() {
    console.log('********  je suis supprimé  ********');
    // verifier si je peux rendre cette fonction asynchrone (onRemove)
  }

  @AfterInsert()
  public onCreated() {
    console.log('******** Row inserted ********');
  }
}

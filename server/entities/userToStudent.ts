import type { EntityManager } from 'typeorm';
import { BeforeInsert, Not, Entity, ManyToOne, PrimaryGeneratedColumn, JoinColumn, BeforeRemove } from 'typeorm';

import { AppDataSource } from '../utils/data-source';
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
  public async onBeforeRemove() {
    const entityManager: EntityManager = AppDataSource.manager;

    // Fetch the UserToStudent object with the User relation
    const userToStudent = await entityManager.findOne(UserToStudent, { where: { id: this.id }, relations: ['user'] });

    if (userToStudent && userToStudent.user) {
      const otherUserToStudents = await entityManager.find(UserToStudent, {
        where: { user: { id: userToStudent.user.id } },
      });

      if (otherUserToStudents.length === 1) {
        userToStudent.user.hasStudentLinked = false;
        userToStudent.user.villageId = null;
        await entityManager.save(userToStudent.user);
      } else {
        const remainingUserToStudent = await entityManager.findOne(UserToStudent, {
          where: { user: { id: userToStudent.user.id }, id: Not(this.id) },
          relations: ['student', 'student.classroom', 'student.classroom.village'],
        });

        if (
          remainingUserToStudent &&
          remainingUserToStudent.student &&
          remainingUserToStudent.student.classroom &&
          remainingUserToStudent.student.classroom.village
        ) {
          userToStudent.user.villageId = remainingUserToStudent.student.classroom.village.id;
          userToStudent.user.countryCode = remainingUserToStudent.student.classroom.countryCode;
          await entityManager.save(userToStudent.user);
        }
      }
    }
  }

  @BeforeInsert()
  async increaseNumLinkedAccounts() {
    const student = await AppDataSource.getRepository(Student).findOne({ where: { id: this.student.id }, relations: ['userToStudents'] });
    if (student) {
      student.numLinkedAccount += 1;
      await AppDataSource.getRepository(Student).save(student);
    }
  }

  @BeforeRemove()
  async decreaseNumLinkedAccounts() {
    const student = await AppDataSource.getRepository(Student).findOne({ where: { id: this.student.id }, relations: ['userToStudents'] });
    if (student && student.numLinkedAccount > 0) {
      student.numLinkedAccount -= 1;
      await AppDataSource.getRepository(Student).save(student);
    }
  }
}

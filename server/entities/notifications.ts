import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity('notifications')
export class Notifications {
  static findOne(arg0: { userId: string }) {
    throw new Error('Method not implemented.');
  }
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  userId: number;

  @Column({ type: 'boolean', default: true })
  commentary: boolean;

  @Column({ type: 'boolean', default: true })
  reaction: boolean;

  @Column({ type: 'boolean', default: true })
  publicationFromSchool: boolean;

  @Column({ type: 'boolean', default: true })
  publicationFromAdmin: boolean;

  @Column({ type: 'boolean', default: true })
  creationAccountFamily: boolean;

  @Column({ type: 'boolean', default: true })
  openingVillageStep: boolean;
}

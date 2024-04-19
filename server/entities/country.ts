import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';

import { User } from './user';

@Entity()
export class Country {
  @PrimaryGeneratedColumn()
  public id: number;

  @Column({ type: 'text', nullable: false })
  public isoCode: string;

  @Column({ type: 'text', nullable: false })
  public name: string;

  @ManyToOne(() => User, (user: User) => user)
  users: User[];
}

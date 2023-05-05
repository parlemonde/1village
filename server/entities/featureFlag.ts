import { Entity, PrimaryGeneratedColumn, Column, ManyToMany } from 'typeorm';

import { User } from './user';

@Entity()
export class FeatureFlag {
  @PrimaryGeneratedColumn()
  public id: number;

  @Column({ type: 'varchar', length: 255, unique: true })
  public name: string;

  @Column({ type: 'boolean', default: false })
  public isEnabled: boolean;

  @ManyToMany(() => User, (user) => user.featureFlags)
  public users: User[];
}

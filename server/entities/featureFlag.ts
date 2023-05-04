import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';

import { UserToFeatureFlag } from './userToFeatureFlag';

@Entity()
export class FeatureFlag {
  @PrimaryGeneratedColumn()
  public id: number;

  @Column({ type: 'varchar', length: 255, unique: true })
  public name: string;

  @Column({ type: 'boolean', default: false })
  public isEnabled: boolean;

  @OneToMany(() => UserToFeatureFlag, (userToFeatureFlag) => userToFeatureFlag.featureFlag)
  public userToFeatureFlags: UserToFeatureFlag[];
}

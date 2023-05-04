import { Entity, PrimaryGeneratedColumn, ManyToOne } from 'typeorm';

import { FeatureFlag } from './featureFlag';
import { User } from './user';

@Entity()
export class UserToFeatureFlag {
  @PrimaryGeneratedColumn()
  public id: number;

  @ManyToOne(() => User, (user) => user.userToFeatureFlags, { onDelete: 'CASCADE' })
  public user: User;

  @ManyToOne(() => FeatureFlag, (featureFlag) => featureFlag.userToFeatureFlags, { onDelete: 'CASCADE' })
  public featureFlag: FeatureFlag;
}

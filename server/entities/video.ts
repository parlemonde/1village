import { Column, Entity, PrimaryColumn, ManyToOne, JoinColumn, CreateDateColumn } from 'typeorm';

import type { Video as VideoInterface } from '../../types/video.type';
import { User } from './user';

@Entity()
export class Video implements VideoInterface {
  @PrimaryColumn()
  public id: number; // vimeoID <---- !important, used to link with vimeo.

  @Column({ type: 'varchar', length: 64 })
  public name: string;

  // user relation
  @ManyToOne(() => User, (user: User) => user.activities, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'userId' })
  public user: User | null;

  @Column({ nullable: false })
  public userId: number;

  @CreateDateColumn()
  public createDate: Date;
}

import { Column, Entity, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, DeleteDateColumn, ManyToOne, JoinColumn } from 'typeorm';

import type { Image as ImageInterface } from '../../types/story.type';
import { Activity } from './activity';
import { User } from './user';
import { Village } from './village';

@Entity()
export class Image implements ImageInterface {
  @PrimaryGeneratedColumn()
  public id: number;
  @CreateDateColumn()
  public createDate: Date;

  @UpdateDateColumn()
  public updateDate: Date;

  @DeleteDateColumn()
  public deleteDate: Date;

  @ManyToOne(() => User, (user: User) => user.images, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'userId' })
  public user: User | null;

  @Column({ nullable: false })
  public userId: number;

  @ManyToOne(() => Village, (village: Village) => village.images, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'villageId' })
  public village: Village | null;

  @Column({ nullable: false })
  public villageId: number | undefined;

  @ManyToOne(() => Activity, (activity: Activity) => activity.images, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'activityId' })
  public activity: Activity | null;

  @Column({ nullable: false })
  public activityId: number;

  @Column({ type: 'tinyint' })
  public imageType: number;

  @Column({ type: 'text' })
  public imageUrl: string | null;

  @Column({ type: 'int' })
  public inspiredStoryId: number;
}

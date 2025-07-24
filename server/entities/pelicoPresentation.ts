import type { ActivityContent } from '../../types/activity.type';

import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity()
export class PelicoPresentation {
  @PrimaryGeneratedColumn()
  id: number;

  @Column('json')
  content: ActivityContent[];
}

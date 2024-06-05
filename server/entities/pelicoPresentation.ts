import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

import type { ActivityContent } from '../../types/activity.type';

@Entity()
export class PelicoPresentation {
  @PrimaryGeneratedColumn()
  id: number;

  @Column('json')
  content: ActivityContent[];
}

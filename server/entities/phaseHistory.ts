import { Column, CreateDateColumn, DeleteDateColumn, Entity, Index, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';

import type { VillagePhase } from './village';
import { Village } from './village';

@Entity()
@Index(['village', 'phase'], { unique: true })
export class PhaseHistory {
  @PrimaryGeneratedColumn()
  public id: number;

  @ManyToOne(() => Village, (village) => village.phaseHistories)
  village: Village;

  @Column({
    type: 'tinyint',
  })
  phase: VillagePhase;

  @CreateDateColumn()
  public startingOn: Date;

  @DeleteDateColumn()
  public endingOn: Date;
}

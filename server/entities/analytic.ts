import { Column, Entity, ManyToOne, JoinColumn, PrimaryColumn, PrimaryGeneratedColumn } from 'typeorm';

import type {
  AnalyticSession as AnalyticSessionInterface,
  AnalyticPageView as AnalyticPageViewInteface,
  AnalyticPerformance as AnalyticPerformanceInterface,
  NavigationPerf,
  BrowserPerf,
} from '../../types/analytics.type';
import { User } from './user';

@Entity()
export class AnalyticSession implements AnalyticSessionInterface {
  @PrimaryColumn({ type: 'varchar', length: 36 })
  public id: string;

  @Column({ type: 'varchar', length: 20, nullable: false })
  public uniqueId: string; // accross multiple sessions

  @Column({ type: 'datetime' })
  public date: Date;

  @Column({ type: 'varchar', length: 8 })
  type: string; // 'desktop' | 'tablet' | 'mobile' | 'other'

  @Column({ type: 'varchar', length: 20 })
  os: string;

  @Column({ type: 'varchar', length: 20 })
  browserName: string;

  @Column({ type: 'varchar', length: 20 })
  browserVersion: string;

  @Column({ type: 'smallint', unsigned: true, nullable: true })
  duration: number | null;

  @Column({ type: 'smallint', unsigned: true })
  width: number;

  @Column({ type: 'varchar', length: 255 })
  initialPage: string;

  @ManyToOne(() => User, { onDelete: 'SET NULL' })
  @JoinColumn({ name: 'userId' })
  public user: User;

  @Column({ type: 'integer', nullable: true })
  public userId: number | null;
}

@Entity()
export class AnalyticPageView implements AnalyticPageViewInteface {
  @PrimaryGeneratedColumn()
  public id: number;

  @ManyToOne(() => AnalyticSession, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'sessionId' })
  public session: AnalyticSession;

  @Column({ type: 'varchar', length: 36, nullable: false })
  public sessionId: string;

  @Column({ type: 'datetime' })
  public date: Date;

  @Column({ type: 'varchar', length: 255 })
  page: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  referrer: string | null;
}

@Entity()
export class AnalyticPerformance implements AnalyticPerformanceInterface {
  @PrimaryGeneratedColumn()
  public id: number;

  @ManyToOne(() => AnalyticSession, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'sessionId' })
  public session: AnalyticSession;

  @Column({ type: 'varchar', length: 36, nullable: false })
  public sessionId: string;

  @Column({ type: 'datetime' })
  public date: Date;

  @Column('simple-json')
  public data: NavigationPerf | BrowserPerf;
}

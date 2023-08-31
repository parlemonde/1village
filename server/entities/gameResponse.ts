import { Column, Entity, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, DeleteDateColumn, ManyToOne, JoinColumn } from 'typeorm';

import type { GameResponse as GameResponseInterface } from '../../types/gameResponse.type';
import { Game } from './game';
import { User } from './user';
import { Village } from './village';

@Entity()
export class GameResponse implements GameResponseInterface {
  @PrimaryGeneratedColumn()
  public id: number;
  @CreateDateColumn()
  public createDate: Date;

  @UpdateDateColumn()
  public updateDate: Date;

  @DeleteDateColumn()
  public deleteDate: Date;

  // user relation
  @ManyToOne(() => User, (user: User) => user.gameResponses, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'userId' })
  public user: User;

  @Column({ nullable: false })
  public userId: number;

  @ManyToOne(() => Village, (village: Village) => village.gameResponses, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'villageId' })
  public village: Village | null;

  @Column({ nullable: false })
  public villageId: number;

  @ManyToOne(() => Game, (game: Game) => game.responses, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'gameId' })
  public game: Game | null;

  @Column({ nullable: false })
  public gameId: number;

  @Column({ type: 'text' })
  public value: string;

  @Column({ default: false })
  public isOldGame: boolean;
}

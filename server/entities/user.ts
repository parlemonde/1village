import { Column, Entity, PrimaryGeneratedColumn, ManyToOne, JoinColumn, OneToMany, ManyToMany, JoinTable } from 'typeorm';

import { UserType } from '../../types/user.type';
import { Activity } from './activity';
import { Country } from './country';
import { FeatureFlag } from './featureFlag';
import { Game } from './game';
import { GameResponse } from './gameResponse';
import { Image } from './image';
import { UserToStudent } from './userToStudent';
import { Village } from './village';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  public id: number;

  @Column({ type: 'varchar', length: 255, unique: true })
  public email: string;

  @Column({ type: 'varchar', length: 50, default: '' })
  public pseudo: string;

  @Column({ type: 'varchar', length: 50, default: '' })
  public firstname: string;

  @Column({ type: 'varchar', length: 100, default: '' })
  public lastname: string;

  @Column({ type: 'varchar', length: 50, default: '' })
  public level: string;

  @Column({ type: 'varchar', length: 255, default: '' })
  public school: string;

  @Column({ type: 'varchar', length: 128, default: '' })
  public city: string;

  @Column({ type: 'varchar', length: 20, default: '' })
  public postalCode: string;

  @Column({ type: 'varchar', length: 255, default: '' })
  public address: string;

  @Column({ type: 'text', nullable: true, default: null })
  public avatar: string | null;

  @Column({ type: 'varchar', length: 400, nullable: true, default: null })
  public displayName: string | null;

  @Column({ type: 'boolean', default: false })
  public hasAcceptedNewsletter: boolean;

  @Column({ type: 'varchar', length: 400, default: 'français' })
  public language: string;

  @Column({ default: 0 })
  public accountRegistration: number; // 0 to 3 -> Ok, 4 -> Account blocked, 10 -> Account use PLM SSO

  @Column({ type: 'varchar', length: 300, select: false })
  public passwordHash?: string;

  @Column({ type: 'varchar', length: 300, default: '', select: false })
  public verificationHash?: string;

  @Column({ type: 'boolean', default: false })
  public isVerified: boolean;

  @Column({ type: 'tinyint', default: 0 })
  public firstLogin: number;

  @Column({
    type: 'tinyint',
    default: UserType.TEACHER,
  })
  type: UserType;

  @Column({ nullable: true })
  public villageId: number | null;

  @OneToMany(() => Country, (country: Country) => country)
  public country: Country | null;

  @Column({ type: 'decimal', precision: 11, scale: 8, nullable: false, default: 0 })
  public positionLat: number;

  @Column({ type: 'decimal', precision: 11, scale: 8, nullable: false, default: 0 })
  public positionLon: number;

  public mascotteId?: number;

  @Column({ type: 'boolean', default: false })
  //TODO: add trigger to check if hasStudentLink has to be seted whenever a student is deleted.
  //TODO: add migration to add trigger...
  public hasStudentLinked: boolean;

  @ManyToOne(() => Village, (village: Village) => village.users, { onDelete: 'SET NULL' })
  @JoinColumn({ name: 'villageId' })
  public village: Village | null;

  @OneToMany(() => Activity, (activity: Activity) => activity.user)
  public activities: Activity[];

  @OneToMany(() => Game, (game: Game) => game.user)
  public games: Game[];

  @OneToMany(() => GameResponse, (gameResponse: GameResponse) => gameResponse.user)
  public gameResponses: GameResponse[];

  @OneToMany(() => Image, (image: Image) => image.user)
  public images: Image[];

  @OneToMany(() => UserToStudent, (userToStudent) => userToStudent.user)
  public userToStudents: UserToStudent[];

  @ManyToMany(() => FeatureFlag, (featureFlag) => featureFlag.users)
  @JoinTable()
  public featureFlags: FeatureFlag[];
}

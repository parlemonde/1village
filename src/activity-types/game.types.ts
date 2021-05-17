import { GenericExtendedActivity } from './extendedActivity.types';

export type MimiquesData = {
  mimique1: MimiqueData;
  mimique2: MimiqueData;
  mimique3: MimiqueData;
};

export type MimiqueData = {
  origine:string;
  signification:string;
  fakeSignification1:string;
  fakeSignification2:string;
  video:string;
}

export type MonnaieData = {
  theme: number;
};

export type GameMimiqueActivity = GenericExtendedActivity<MimiquesData>;

export type GameMonnaieActivity = GenericExtendedActivity<MonnaieData>;

export type GameActivity = GameMimiqueActivity | GameMonnaieActivity;

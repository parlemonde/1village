import { VillagePhase } from '../../entities/village';

export const phaseWasSelected = (phase: number | undefined): boolean => {
  return phase !== undefined && Object.values(VillagePhase).includes(+phase);
};

import { ActivityType } from '../../../../types/activity.type';
import { getActivityPhase } from '../utils';

// describe('Phase matching test', () => {});
describe('for Mascotte', () => {
  const activePhase = 1;
  it('should return correct phase 1', () => {
    const selectedPhase = 1;
    expect(getActivityPhase(ActivityType.MASCOTTE, activePhase, selectedPhase)).toEqual(selectedPhase);
  });
  it('should return not error phase 1', () => {
    const selectedPhase = 2;
    expect(getActivityPhase(ActivityType.MASCOTTE, activePhase, selectedPhase)).toEqual(1);
  });
});

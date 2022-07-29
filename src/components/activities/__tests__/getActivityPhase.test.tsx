import { getActivityPhase } from '../utils';
import { ActivityType } from 'types/activity.type';

// describe('Phase matching test', () => {});
describe('for Mascotte', () => {
  const activePhase = 1;
  it('should return correct phase 1', () => {
    const selectedPhase = 1;
    expect(getActivityPhase(ActivityType.MASCOTTE, activePhase)).toEqual(selectedPhase);
  });
  it('should return no error in phase 1', () => {
    const selectedPhase = 2;
    expect(getActivityPhase(ActivityType.MASCOTTE, activePhase)).toEqual(1);
  });
});

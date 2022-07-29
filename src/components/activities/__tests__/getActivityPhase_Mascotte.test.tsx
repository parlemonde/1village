// import { getActivityPhase } from '../getActivityPhase';

import { getActivityPhase } from '../utils';
import { ActivityType } from 'types/activity.type';

//https://til.hashrocket.com/posts/lmnsdtce3y-import-absolute-paths-in-typescript-jest-tests
describe('Phase matching test', () => {
  describe('for Mascotte', () => {
    describe('for active Phase 1', () => {
      const activePhase = 1;
      it('should return phase 1 if selectedPhase is 1', () => {
        const selectedPhase = 1;
        expect(getActivityPhase(ActivityType.MASCOTTE, activePhase, selectedPhase)).toEqual(selectedPhase);
      });
      it('should return phase 1 if selectedPhase is 2', () => {
        const selectedPhase = 2;
        expect(getActivityPhase(ActivityType.MASCOTTE, activePhase, selectedPhase)).toEqual(activePhase);
      });
      it('should return phase 1 if selectedPhase is 3', () => {
        const selectedPhase = 3;
        expect(getActivityPhase(ActivityType.MASCOTTE, activePhase, selectedPhase)).toEqual(activePhase);
      });
    });
    describe('for active Phase 2', () => {
      const activePhase = 2;
      it('should return phase 1 if selectedPhase is 1', () => {
        const selectedPhase = 1;
        expect(getActivityPhase(ActivityType.MASCOTTE, activePhase, selectedPhase)).toEqual(selectedPhase);
      });
      it('should return phase 2 if selectedPhase is 2', () => {
        const selectedPhase = 2;
        expect(getActivityPhase(ActivityType.MASCOTTE, activePhase, selectedPhase)).toEqual(selectedPhase);
      });
      it('should return phase 2 if selectedPhase is 3', () => {
        const selectedPhase = 3;
        expect(getActivityPhase(ActivityType.MASCOTTE, activePhase, selectedPhase)).toEqual(activePhase);
      });
    });
    describe('for active Phase 3', () => {
      const activePhase = 3;
      it('should return phase 1 if selectedPhase is 1', () => {
        const selectedPhase = 1;
        expect(getActivityPhase(ActivityType.MASCOTTE, activePhase, selectedPhase)).toEqual(selectedPhase);
      });
      it('should return phase 2 if selectedPhase is 2', () => {
        const selectedPhase = 2;
        expect(getActivityPhase(ActivityType.MASCOTTE, activePhase, selectedPhase)).toEqual(selectedPhase);
      });
      it('should return phase 3 if selectedPhase is 3', () => {
        const selectedPhase = 3;
        expect(getActivityPhase(ActivityType.MASCOTTE, activePhase, selectedPhase)).toEqual(selectedPhase);
      });
    });
  });
});

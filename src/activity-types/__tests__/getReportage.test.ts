import { getReportage } from '../reportage.constants';
import type { ReportageData } from '../reportage.types';

describe('Test getReportage from reportage constants', () => {
  it('should return the correct reportage if activitySubType is different from -1', () => {
    const activitySubType = 1;
    const activityData: ReportageData = {
      reportage: 'Nos arts',
    };
    const expected = {
      title: 'Arts',
      step1: 'Nos arts',
    };
    expect(getReportage(activitySubType, activityData)).toEqual(expected);
  });

  it('should return a custom reportage if the activitySubType is -1', () => {
    const activitySubType = -1;
    const activityData: ReportageData = {
      reportage: 'New reportage',
    };
    const expected = {
      title: 'New reportage',
      step1: 'New reportage',
    };
    expect(getReportage(activitySubType, activityData)).toEqual(expected);
  });
});

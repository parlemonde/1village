import { isFirstStepValid, isThirdStepValid } from '../defiChecksCooking';
import type { CookingDefiData } from 'src/activity-types/defi.types';

const validData = {
  name: 'Lorem ipsum dolor',
  history: 'sit amet consectetur',
  explanation: 'Debitis quas enim porro vitae possimus architecto minus fuga consequuntur',
};

describe('Test isFirstStepValid from DefiCheckCooking', () => {
  it('should be true with data not empty', () => {
    const defiCooking = {
      ...validData,
      defiIndex: 0,
    };
    expect(isFirstStepValid(defiCooking)).toBe(true);
  });
  it('should be false with incomplete data', () => {
    const defiCooking = {
      name: 'Lorem ipsum dolor',
      history: '',
      explanation: 'Debitis quas enim porro vitae possimus architecto minus fuga consequuntur',
      defiIndex: 0,
    };
    expect(isFirstStepValid(defiCooking)).toBe(false);
  });
  it('should be false with empty data', () => {
    const defiCooking = {
      name: '',
      history: '',
      explanation: '',
      defiIndex: 0,
    };
    expect(isFirstStepValid(defiCooking)).toBe(false);
  });
});
describe('Test isThirdStepValid from DefiCheckCooking', () => {
  it('should be true with index not null', () => {
    const defiCooking = {
      ...validData,
      defiIndex: 0,
    };
    expect(isThirdStepValid(defiCooking)).toBe(true);
  });
  it('should be false if index is null ', () => {
    const defiCooking = {
      ...validData,
      defiIndex: null,
    };
    expect(isThirdStepValid(defiCooking as unknown as CookingDefiData)).toBe(false);
  });
});

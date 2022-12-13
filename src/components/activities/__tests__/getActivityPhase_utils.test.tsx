import { specificActivityPhase, getActivityPhase } from '../utils';

// it.each([
//   { a: 1, b: 1, expected: 2 },
//   { a: 1, b: 2, expected: 3 },
//   { a: 2, b: 1, expected: 3 },
// ])('.add($a, $b)', ({ a, b, expected }) => {
//   expect(a + b).toBe(expected);
// });
describe('Test function getActivityPhase', () => {
  describe('for active phase 1 and selectedPhase 1', () => {
    const activePhase = 1;
    // it('should return Mascotte, Presentation, Contenu Libre, Indice, Symbol, ', () => {});
    const activitiesArray = Object.entries(specificActivityPhase);
    const selectedPhase = 1;

    it.each(activitiesArray)('.add($a, $b)', ([type]) => {
      expect(type).toBe('1');
      //   expect(getActivityPhase(Number(type), activePhase, selectedPhase)).toEqual(one);
    });
  });
});

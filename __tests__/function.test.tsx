// On récupère la fonction à tester
import { addition, multiply } from './function';

// describe permet de grouper les tests concernant une même fonctionnalité.
describe('test addition function', () => {
  // test permet de définir un test à faire
  test('add number', () => {
    // expect va permettre de gérer l'égalité que l'on souhaite
    expect(addition(1, 2)).toBe(3);
    expect(addition(-1, -2)).toBe(-3);
    expect(addition(1, -2)).toBe(-1);
    expect(addition(-1, 2)).toBe(1);
  });

  test('add string', () => {
    // expect va permettre de gérer l'égalité que l'on souhaite
    expect(() => addition(1, 'toto')).toThrowError('Bad value in parameters');
  });

  test('add string number', () => {
    // expect va permettre de gérer l'égalité que l'on souhaite
    expect(addition(1, '1')).toBe(2);
  });
});

describe('Test on multiply function', () => {
  test('multiply number', () => {
    expect(multiply(2, 3)).toBe(6);
    expect(multiply(-2, 3)).toBe(-6);
    expect(multiply(100, 50)).toBe(5000);
    expect(multiply(100, -50)).toBe(-5000);
    expect(multiply(-100, -50)).toBe(5000);
  });

  test('multiply return number', () => {
    // On peux tester si le résultat est un Nombre (ou n'importe quel type) avec un toEqual et un expect.any(MonType)
    expect(multiply(-100, -50)).toEqual(expect.any(Number));

    expect(multiply('-100', -50)).toEqual(expect.any(Number));
  });

  test('multiply with bad parameters', () => {
    expect(() => multiply(1, 'toto')).toThrowError('Bad value in parameters');
  });

  test('multiply expect two parameter', () => {
    expect(multiply).toThrowError('Bad value in parameters');

    // Pour tester le throw de fonction il faut passé une fonction au except que lui executera. Comme l'on souhaite passé un argument on utilise une fonction fléché que jest appelera de son côté
    expect(() => multiply(50)).toThrowError('Bad value in parameters');
  });
});

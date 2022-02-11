export const addition = (number1, number2) => {
  const num1 = Number(number1);
  const num2 = Number(number2);

  if (Number.isNaN(num1) || Number.isNaN(num2)) {
    throw new Error('Bad value in parameters');
  }

  return num1 + num2;
};

// Faire une fonction qui va multiplier deux nombres entre eux.
// Vérifier que les paramètres soient bien des nombres
// Vérifier que si je multiplie un nombre positif par un négatif, le résultat est inférieur à 0.
// Essayer de trouver vous même des tests à faire =)

export const multiply = (number1, number2) => {
  const num1 = Number(number1);
  const num2 = Number(number2);

  if (Number.isNaN(num1) || Number.isNaN(num2)) {
    throw new Error('Bad value in parameters');
  }

  return num1 * num2;
};

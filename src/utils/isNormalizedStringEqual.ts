// Normalise les chaînes de caractères et les compare pour retourner un boolean

export const isNormalizedStringEqual = (str1: string, str2: string): boolean => {
  const strNorm1 = str1.normalize('NFD').replace(/[\u0300-\u036f]/g, '');
  const strNorm2 = str2.normalize('NFD').replace(/[\u0300-\u036f]/g, '');

  return strNorm1.toLocaleLowerCase() === strNorm2.toLocaleLowerCase();
};

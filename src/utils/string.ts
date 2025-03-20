export const normalizeString = (data: string): string => {
  return data.normalize('NFD').replace(/[\u0300-\u036f]/g, '');
};

export const isNormalizedStringEqual = (str1: string, str2: string): boolean => {
  const strNorm1 = str1.normalize('NFD').replace(/[\u0300-\u036f]/g, '');
  const strNorm2 = str2.normalize('NFD').replace(/[\u0300-\u036f]/g, '');

  return strNorm1.toLocaleLowerCase() === strNorm2.toLocaleLowerCase();
};

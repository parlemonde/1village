import { zxcvbn, zxcvbnOptions } from '@zxcvbn-ts/core';
import * as zxcvbnCommonPackage from '@zxcvbn-ts/language-common';
import * as zxcvbnEnPackage from '@zxcvbn-ts/language-en';

const regexpassword = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*])(.{12,})$/;
export function isPasswordValid(password: string): boolean {
  // librairie a ajouté ici Mettre a jour l'export de cette fonction dans tous les fichier
  return password !== undefined && password !== null && password.length >= 12 && regexpassword.test(password) && isPasswordStrong(password);
}

export function isPasswordStrong(password: string): boolean {
  const options = {
    translations: zxcvbnEnPackage.translations,
    dictionary: {
      ...zxcvbnCommonPackage.dictionary,
      ...zxcvbnEnPackage.dictionary,
    },
    // The next line is now recommended to get a good scoring.
    graphs: zxcvbnCommonPackage.adjacencyGraphs,
  };
  zxcvbnOptions.setOptions(options);

  const { score } = zxcvbn(password);
  console.log(typeof score);
  return score > 4;
}

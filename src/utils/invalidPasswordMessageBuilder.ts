export function invalidPasswordMessageBuilder(password: string) {
  let badLengthMessage = '';
  let missingDigitMessage = '';

  const missingDigitErrors = [];

  if (password !== '') {
    if (!password.match(/\d/)) {
      missingDigitErrors.push('un chiffre');
    }
    if (!password.match(/[A-Z]/)) {
      missingDigitErrors.push('une lettre majuscule');
    }
    if (!password.match(/[a-z]/)) {
      missingDigitErrors.push('une lettre minusucle');
    }
    if (!password.match(/[#?!@$%^&*-]/)) {
      missingDigitErrors.push(' un caractère spécial');
    }

    if (missingDigitErrors.length > 0) {
      missingDigitMessage += 'Le mot de passe doit contenir au moins ';
      for (let i = 0; i < missingDigitErrors.length; i++) {
        missingDigitMessage += missingDigitErrors[i];
        switch (i) {
          case missingDigitErrors.length - 1:
            missingDigitMessage += '.';
            break;
          case missingDigitErrors.length - 2:
            missingDigitMessage += ' et ';
            break;
          default:
            missingDigitMessage += ', ';
            break;
        }
      }
    }
    if (password.length < 12) {
      badLengthMessage += 'Le mot de passe doit faire au moins 12 caractères.';
    }
  }

  return { badLengthMessage, missingDigitMessage };
}

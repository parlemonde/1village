import { axiosRequest } from "./axiosRequest";

const emailRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/i;
const strongPassword = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.{8,})/;

export async function isPseudoValid(pseudo: string, userPseudo: string): Promise<boolean> {
  if (pseudo.length === 0) {
    return false;
  }
  if (pseudo.toLowerCase() === userPseudo.toLowerCase()) {
    return true;
  }
  const response = await axiosRequest({
    method: "GET",
    url: `/users/pseudo/${pseudo}`,
  });
  if (response.error) {
    return true;
  }
  return !!response.data.available;
}

export function isEmailValid(email: string): boolean {
  return emailRegex.test(email);
}

export function isPasswordValid(password: string): boolean {
  return strongPassword.test(password);
}

export function isConfirmPasswordValid(password: string, confirmPassword: string): boolean {
  return password.length === 0 || password === confirmPassword;
}

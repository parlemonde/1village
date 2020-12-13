import { Request } from "express";
import fs from "fs";

/**
 * Pause the program for x milliseconds.
 * @param ms
 */
export function sleep(ms: number): Promise<void> {
  return new Promise<void>((resolve) => {
    setTimeout(() => {
      resolve();
    }, ms);
  });
}

export function getHeader(req: Request, header: string): string | undefined {
  const headers: string | string[] | undefined = req.headers[header];
  if (typeof headers === "string") {
    return headers;
  } else if (headers !== undefined) {
    return headers[0] || undefined;
  }
  return undefined;
}

export function isPasswordValid(password: string): boolean {
  return password !== undefined && password !== null && password.length >= 8 && /\d+/.test(password) && /[a-z]+/.test(password) && /[A-Z]+/.test(password);
}

export function generateTemporaryPassword(length: number): string {
  const pwdChars = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz";
  return Array(length)
    .fill(pwdChars)
    .map(function (x) {
      return x[Math.floor(Math.random() * x.length)];
    })
    .join("");
}

export function getBase64File(path: string): string {
  return fs.readFileSync(path).toString("base64");
}

export function serializeToQueryUrl(obj: { [key: string]: string | number | boolean }): string {
  if (Object.keys(obj).length === 0) {
    return "";
  }
  const str =
    "?" +
    Object.keys(obj)
      .reduce<string[]>(function (a, k) {
        a.push(`${k}=${encodeURIComponent(obj[k])}`);
        return a;
      }, [])
      .join("&");
  return str;
}

import md5 from 'md5';

import type { User } from 'types/user.type';
import { UserType } from 'types/user.type';

/**
 * Returns a query string with the given parameters.
 */
export function serializeToQueryUrl(obj: { [key: string]: string | number | boolean | null | undefined }): string {
  if (Object.keys(obj).length === 0) {
    return '';
  }
  const str =
    '?' +
    Object.keys(obj)
      .reduce(function (a, k) {
        if (obj[k] !== undefined) {
          a.push(k + '=' + encodeURIComponent(obj[k]));
        }
        return a;
      }, [])
      .join('&');
  return str;
}

export function getQueryString(q: string | string[]): string {
  if (Array.isArray(q)) {
    return q[0];
  }
  return q;
}

/**
 * Returns a function, that, as long as it continues to be invoked, will not
 * be triggered. The function will be called after it stops being called for
 * N milliseconds. If `immediate` is passed, trigger the function on the
 * leading edge, instead of the trailing.
 */
export function debounce<T extends (args: unknown | unknown[]) => void>(func: T, wait: number, immediate: boolean): T {
  let timeout: NodeJS.Timeout;
  return function () {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    /*@ts-ignore */ //eslint-disable-next-line @typescript-eslint/no-this-alias, @typescript-eslint/no-explicit-any
    const context: any = this;
    // eslint-disable-next-line prefer-rest-params
    const args = arguments;
    const later = function () {
      timeout = null;
      if (!immediate) func.apply(context, args);
    };
    const callNow = immediate && !timeout;
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
    if (callNow) func.apply(context, args);
  } as unknown as T;
}

export function throttle<T extends (args: unknown | unknown[]) => void>(func: T, wait: number): T {
  let lastFunc: number;
  let lastRan: number;

  return function () {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    /*@ts-ignore */ //eslint-disable-next-line @typescript-eslint/no-this-alias, @typescript-eslint/no-explicit-any
    const context: any = this;
    // eslint-disable-next-line prefer-rest-params
    const args = arguments;
    if (!lastRan) {
      func.apply(context, args);
      lastRan = Date.now();
    } else {
      window.clearTimeout(lastFunc);
      lastFunc = window.setTimeout(function () {
        if (Date.now() - lastRan >= wait) {
          func.apply(context, args);
          lastRan = Date.now();
        }
      }, wait - (Date.now() - lastRan));
    }
  } as unknown as T;
}

export const clamp = (n: number, min: number, max: number): number => Math.max(min, Math.min(max, n));

// ISO 3166-1 alpha-2
// ⚠️ No support for IE 11
export function countryToFlag(isoCode: string): string {
  return typeof String.fromCodePoint !== 'undefined'
    ? isoCode.toUpperCase().replace(/./g, (char) => String.fromCodePoint(char.charCodeAt(0) + 127397))
    : isoCode;
}

/**
 * Returns a random token. Browser only!
 * @param length length of the returned token.
 */
export function generateTemporaryToken(length: number = 40): string {
  const validChars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  const cryptoObj = !process.browser
    ? null
    : window.crypto || 'msCrypto' in window
    ? (window as Window & typeof globalThis & { msCrypto: Crypto }).msCrypto
    : null; // for IE 11
  if (!cryptoObj) {
    return Array(length)
      .fill(validChars)
      .map(function (x) {
        return x[Math.floor(Math.random() * x.length)];
      })
      .join('');
  }
  let array = new Uint8Array(length);
  cryptoObj.getRandomValues(array);
  array = array.map((x) => validChars.charCodeAt(x % validChars.length));
  const randomState = String.fromCharCode.apply(null, array);
  return randomState;
}

export function isValidHttpUrl(value: string): boolean {
  if (value.slice(0, 11) === '/api/images' || value.slice(0, 10) === '/api/audio') {
    return true;
  }

  let url;
  try {
    url = new URL(value);
  } catch (_) {
    return false;
  }
  return url.protocol === 'http:' || url.protocol === 'https:';
}

export const getGravatarUrl = (email: string): string => {
  const hash = md5(email.trim().toLowerCase());
  return `https://www.gravatar.com/avatar/${hash}?s40&r=g&d=identicon`;
};

export const toDate = (date: string): string => {
  return Intl.DateTimeFormat('fr', { year: 'numeric', month: 'numeric', day: 'numeric' }).format(new Date(date));
};

function addDotToElement(element: HTMLElement): void {
  const innerText = element.innerText || '';
  if (innerText.length > 0 && !/\W/im.test(innerText.slice(-1))) {
    element.innerText = `${innerText}.`;
  }
}
export function htmlToText(html: string): string {
  const tmp = document.createElement('DIV');
  tmp.innerHTML = html;
  [...tmp.children].forEach(addDotToElement);
  return tmp.textContent || tmp.innerText || '';
}

export function naturalJoin(array: Array<string>): string {
  return array
    .map((element: string, index: number) => {
      if (array.length < 2) {
        return element;
      }
      if (index === array.length - 2) {
        return element + ' et ';
      }
      if (index === array.length - 1) {
        return element;
      }
      return element + ', ';
    })
    .join('');
}

export function pluralS(value: number): string {
  return value > 1 ? 's' : '';
}

export const capitalize = (s: string): string => {
  if (!s) {
    return s;
  }
  return s.charAt(0).toUpperCase() + s.slice(1);
};

export function getUserDisplayName(user: User, isSelf: boolean): string {
  const userIsPelico = user.type >= UserType.MEDIATOR;
  if (userIsPelico) {
    return 'Pelico';
  }
  if (isSelf) {
    return 'Votre classe';
  }
  return capitalize(user.displayName || `La classe${user.level ? ' de ' + user.level : ''} à ${user.city ?? user.countryCode}`);
}

const optionsRegex = /{{(.+?)}}/gm;
export function replaceTokens(s: string, tokens: { [key: string]: string }): string {
  return s.replace(optionsRegex, (_match: string, group: string) => (tokens[group] !== undefined ? tokens[group] : group));
}

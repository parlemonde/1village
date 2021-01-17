/**
 * Returns a query string with the given parameters.
 */
export function serializeToQueryUrl(obj: { [key: string]: string | number | boolean }): string {
  if (Object.keys(obj).length === 0) {
    return "";
  }
  const str =
    "?" +
    Object.keys(obj)
      .reduce(function (a, k) {
        a.push(k + "=" + encodeURIComponent(obj[k]));
        return a;
      }, [])
      .join("&");
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
export function debounce<T extends (args: unknown | unknown[]) => unknown | unknown[]>(
  func: T,
  wait: number,
  immediate: boolean,
  ...args: unknown[]
): T {
  let timeout: NodeJS.Timeout;
  return (function () {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    /*@ts-ignore */ //eslint-disable-next-line @typescript-eslint/no-this-alias, @typescript-eslint/no-explicit-any
    const context: any = this;
    const later = function () {
      timeout = null;
      if (!immediate) func.apply(context, args);
    };
    const callNow = immediate && !timeout;
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
    if (callNow) func.apply(context, args);
  } as unknown) as T;
}

// ISO 3166-1 alpha-2
// ⚠️ No support for IE 11
export function countryToFlag(isoCode: string): string {
  return typeof String.fromCodePoint !== "undefined"
    ? isoCode.toUpperCase().replace(/./g, (char) => String.fromCodePoint(char.charCodeAt(0) + 127397))
    : isoCode;
}

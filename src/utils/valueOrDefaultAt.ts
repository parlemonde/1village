export const valueOrDefault = <T>(value: T | undefined, defaultValue: T): T => {
  return value !== undefined ? value : defaultValue;
};

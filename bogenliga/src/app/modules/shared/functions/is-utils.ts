export function isNullOrUndefined(value) {
  return value === undefined || value === null;
}

export function isNullOrEmpty(value: string) {
  return isNullOrUndefined(value) || value.length === 0;
}

export function isNull(value) {
  return value === null;
}

export function isUndefined(value) {
  return value === undefined;
}

export function isNumber(value) {
  return typeof value === 'number';
}

export function isString(value) {
  return typeof value === 'string';
}

export function isBoolean(value) {
  return typeof value === 'boolean';
}

export function isObject(value) {
  return value !== null && typeof value === 'object';
}

export function isPrimitive(value) {
  return (typeof value !== 'object' && typeof value !== 'function') || value === null;
}

export function isArray(value) {
  return Array.isArray(value);
}


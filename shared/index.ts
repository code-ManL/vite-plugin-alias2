export const isFunction = (val: unknown): val is Function => typeof val === 'function'

export const isArray = Array.isArray

export const isString = (val: unknown): val is string => typeof val === 'string'

export const isRegExp = (val: unknown): val is RegExp => Object.prototype.toString.call(val) === '[object RegExp]';

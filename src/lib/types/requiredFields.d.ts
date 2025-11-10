export type IsPlainObject<T> = T extends object
  ? T extends (...args: unknown[]) => unknown
    ? false
    : T extends Array<unknown>
      ? false
      : T extends Date
        ? false
        : true
  : false

export type RequiredFields<T> = T extends object
  ? {
      [K in keyof T]: RequiredFields<T[K]>
    }
  : boolean

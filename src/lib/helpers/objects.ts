export const deepCompare = <T extends object>(obj1: T, obj2: T) => {
  const obj1Keys = Object.keys(obj1)
  const obj2Keys = Object.keys(obj2)

  if (obj1Keys.length !== obj2Keys.length) return false

  return obj1Keys.every((key): boolean => {
    const value1 = obj1[key as keyof T]
    const value2 = obj2[key as keyof T]
    if (typeof value1 === 'object' && typeof value2 === 'object' && value1 !== null && value2 !== null) {
      return deepCompare(value1 as object, value2 as object)
    }
    return value1 === value2
  })
}

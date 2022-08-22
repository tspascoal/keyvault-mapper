export class CaseInsensitiveMap<T, U> extends Map<T, U> {
  get(key: T): U | undefined {
    if (typeof key === 'string') {
      for (const k of super.keys()) {
        if ((k as unknown as string).toLowerCase() === key.toLowerCase()) {
          return super.get(k)
        }
      }
    }
    return super.get(key)
  }
}

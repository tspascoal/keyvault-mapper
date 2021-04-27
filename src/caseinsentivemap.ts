export class CaseInsensitiveMap<T, U> extends Map<T, U> {
  set(key: T, value: U): this {
    if (typeof key === 'string') {
      key = (key.toLowerCase() as any) as T // eslint-disable-line @typescript-eslint/no-explicit-any
    }
    return super.set(key, value)
  }
}

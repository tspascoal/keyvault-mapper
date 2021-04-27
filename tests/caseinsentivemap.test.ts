import {CaseInsensitiveMap} from '../src/caseinsentivemap'

test('same casing', async () => {
  let map = new CaseInsensitiveMap<string, string>()

  map.set('a', 'b')

  expect(map.get('a')).toBe('b')
})

test('different casing', async () => {
  let map = new CaseInsensitiveMap<string, string>()
  map.set('a', 'b')

  expect(map.get('A')).toBe('b')
})

test('non existant key', async () => {
  let map = new CaseInsensitiveMap<string, string>()
  map.set('a', 'b')

  expect(map.get('c')).toBe(undefined)
})

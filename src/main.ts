import * as core from '@actions/core'
import {CaseInsensitiveMap} from './caseinsentivemap'

function getSecretsFromJson(json: string): CaseInsensitiveMap<string, string> {
  core.debug(`getSecretsFromJson JSON ${json}`)

  const elems: {} = JSON.parse(json)
  const secrets = new CaseInsensitiveMap<string, string>()

  for (const [key, value] of Object.entries(elems)) {
    secrets.set(key, value as string)
  }
  return secrets
}

function getMapFromJson(json: string): CaseInsensitiveMap<string, string> {
  core.debug(`getMapFromJson JSON ${json}`)

  const elems: [{}] = JSON.parse(json)

  const map = new CaseInsensitiveMap<string, string>()

  for (const e of elems) {
    const keys = Object.keys(e)

    if (keys.length !== 1)
      throw new Error('Invalid element in json. Only one attribute is allowed')

    map.set(keys[0], Object.values(e)[0] as string)
  }

  return map
}

async function run(): Promise<void> {
  try {
    const operation: string = core.getInput('operation', {required: true})
    const mapString: string = core.getInput('map', {required: true})

    core.debug(`operation=${operation}`)
    core.debug(`map=${mapString}`)

    const map = getMapFromJson(mapString)

    switch (operation.toLowerCase()) {
      case 'keys': {
        const keys = Array.from(map.keys()).join(',')

        core.setOutput('keys', keys)

        break
      }
      case 'map': {
        const secretsString: string = core.getInput('secrets', {required: true})
        const secrets = getSecretsFromJson(secretsString)

        for (const mapKey of map.keys()) {
          const secretValue = secrets.get(mapKey)
          if (secretValue) {
            const newKey = map.get(mapKey) as string

            core.debug(`setting key for ${newKey} from ${mapKey}`)
            core.setOutput(newKey, secretValue)
          } else {
            core.warning(`${mapKey} not found in secrets. Ignoring`)
          }
        }
        break
      }
      default:
        core.setFailed(
          `Invalid operation ${operation}. Only keys or map are accepted.`
        )
    }
  } catch (error) {
    core.setFailed(error.message)
  }
}

run()

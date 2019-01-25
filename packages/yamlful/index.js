const { existsSync, readdirSync, readFileSync } = require('fs')
const { join } = require('path')
const yaml = require('js-yaml')
const serialize = require('serialize-javascript')

function loadYAML (yamlFile) {
  if (existsSync(yamlFile)) {
    return yaml.safeLoad(readFileSync(yamlFile, 'utf8'))
  }
}

function loadResources (srcDir) {
  const resourcesPath = join(srcDir)
  if (!existsSync(resourcesPath)) {
    throw new Error(`No resources found.`)
  }
  const api = readdirSync(resourcesPath)
    .filter((file) => file.match(/\.ya?ml$/))
    .reduce((obj, file) => {
      const yamlConfig = loadYAML(join(resourcesPath, file))
      for (const resource in yamlConfig) {
        if (obj[resource]) {
          obj[resource].push(...yamlConfig[resource])
        } else {
          obj[resource] = yamlConfig[resource]
        }
      }
      return obj
    }, {})
  return api
}

function formatRaw (raw) {
  raw = raw.trim().split(/\r?\n/)
  for (let i = 1; i < raw.length; i++) {
    raw[i] = `    ${raw[i]}`
  }
  return raw.join('\n')
}

function generateMethod (methodConfig) {
  const keys = Object.keys(methodConfig)
  const verb = ['get', 'post', 'put', 'delete']
    .find((verb) => keys.includes(verb))
  const args = []
  const params = []
  if (verb in methodConfig) {
    let endpoint = methodConfig[verb]
      .replace(/:([\w\d_$]+)/g, (_, param) => {
        args.push(param)
        return `\${${param}}`
      })
    if (endpoint.includes('${')) {
      endpoint = `\`${endpoint}\``
    } else {
      endpoint = `'${endpoint}'`
    }
    if (['post', 'put'].includes(verb)) {
      args.push('payload')
      params.push('payload')
    }
    const queryParams = methodConfig.params
      ? serialize(methodConfig.params, {spaces: 2})
      : undefined
    return {
      verb,
      endpoint,
      queryParams,
      name: methodConfig.method,
      args: args.join(', '),
      params: params.length > 0
        ? `, ${params.join(', ')}`
        : ''
    }
  } else if ('raw' in methodConfig) {
    return {
      name: methodConfig.method,
      raw: formatRaw(methodConfig.raw)
    }
  } else {
    throw new Error(`Method configuration invalid: ${
      JSON.stringify(methodConfig, null, 2)
    }`)
  }
}

module.exports = function yamlfu (srcDir) {
  const api = loadResources(srcDir)
  const tree = {}
  for (const resource in api) {
    tree[resource] = api[resource].map(generateMethod)
  }
  return tree
}

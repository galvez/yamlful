import { resolve } from 'path'
import yamlful from 'yamlful'

export default function (userOptions = {}) {
  // Apply default options
  userOptions = Object.assign({
    srcDir: this.options.srcDir,
    fileName: 'api.js'
  }, userOptions)

  // Add yamlful plugin
  this.addPlugin({
    src: resolve(__dirname, 'templates/plugin.js'),
    fileName: 'yamlful/plugin.js'
  })
  
  // Add yamlful API template
  this.addTemplate({
    src: resolve(__dirname, 'templates/api.js'),
    fileName: 'yamlful/api.js',
    options: { api: yamlful(userOptions.srcDir) }
  })

  this.requireModule('@nuxtjs/axios')
}

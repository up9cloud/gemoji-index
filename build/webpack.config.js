const path = require('path')
const fs = require('fs')

const _ = require('lodash')

// const { name } = require('../package.json')

let configs = []
for (let file of fs.readdirSync(path.join(__dirname, '..', 'src'))) {
  if (file === 'index.js') {
    continue
  }
  let basename = path.basename(file, '.js')
  configs.push({
    entry: path.join(__dirname, '..', 'src', file),
    output: {
      filename: file,
      path: path.resolve(__dirname, '..', 'dist'),
      library: ['gemoji', _.camelCase(basename)]
    }
  })
}

module.exports = configs

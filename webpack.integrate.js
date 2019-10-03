const merge = require('webpack-merge')
const common = require('./webpack.common.js')

const GenerateJsonPlugin = require('generate-json-webpack-plugin')

module.exports = merge(common, {
  devtool: 'source-map',
  plugins: [
    new GenerateJsonPlugin('package.json', {
      name: 'mapwize-ui',
      version: require('./package.json').version,
      description: 'Mapwize ui Javascript SDK',
      main: 'mapwizeui.js',
      author: 'Mapwize',
      dependencies: {},
      homepage: 'https://www.mapwize.io/',
      license: '©2018 - Mapwize is a registered trademark of Contexeo SAS - All rights reserved'
    }, null, 3)
  ]
})

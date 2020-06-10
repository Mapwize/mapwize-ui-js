const merge = require('webpack-merge')
const common = require('./webpack.common.js')

const { CleanWebpackPlugin } = require('clean-webpack-plugin')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const GenerateJsonPlugin = require('generate-json-webpack-plugin')
const CopyWebpackPlugin = require('copy-webpack-plugin')
const LicenseWebpackPlugin = require('license-webpack-plugin').LicenseWebpackPlugin

module.exports = merge(common, {
  mode: 'production',
  devtool: false,
  plugins: [
    new CleanWebpackPlugin(),
    new GenerateJsonPlugin('package.json', {
      name: 'mapwize-ui',
      version: require('./package.json').version,
      description: require('./package.json').description,
      main: 'mapwizeui.js',
      author: require('./package.json').author,
      dependencies: {},
      homepage: require('./package.json').homepage,
      license: require('./package.json').license,
      repository: require('./package.json').repository
    }, null, 3),
    new CopyWebpackPlugin({
      patterns: [
        { from: 'README.md', to: 'README.md' },
        { from: 'CHANGELOG.md', to: 'CHANGELOG.md' }
      ]
    }),
    new LicenseWebpackPlugin({
      pattern: /.*/
    }),
    new HtmlWebpackPlugin({
      filename: 'index.html',
      template: './src/index.html'
    })
  ]
})

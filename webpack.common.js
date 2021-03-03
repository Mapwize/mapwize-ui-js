const path = require( 'path' )
const webpack = require('webpack')

module.exports = {
  mode: 'development',
  entry: {
    mapwizeui: './src/index.ts'
  },
  output: {
    path: path.resolve(__dirname, 'dist'),
    library: {
      type: 'umd',
      name: 'MapwizeUI'
    },
    umdNamedDefine: true
  },
  plugins: [
    new webpack.DefinePlugin({
      VERSION: JSON.stringify(require("./package.json").version)
    })
  ],
  module: {
    noParse: /(mapwize)\.js$/,
    rules: [ {
      test: /\.tsx?$/,
      use: 'ts-loader',
      exclude: /node_modules/,
    }, {
      test: /\.s[ac]ss$/i,
      use: [
        "style-loader",
        "css-loader",
        "sass-loader"
      ]
    } ]
  },
  resolve: {
    extensions: [ '.tsx', '.ts', '.js' ]
  }
}

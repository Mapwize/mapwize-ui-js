const path = require( 'path' )
const { merge } = require( 'webpack-merge' )
const common = require( './webpack.common.js' )
const HtmlWebpackPlugin = require( 'html-webpack-plugin' )

module.exports = merge( common, {
  devtool: 'inline-source-map',
  devServer: {
    host: '0.0.0.0',
    static: [
      path.resolve(__dirname, 'dist'),
    ],
    compress: true,
    port: 8080
  },
  module: {
    noParse: /(mapwize)\.js$/,
    rules: [ {
      test: /\.js$/,
      exclude: /node_modules\/mapwize/,
      use: [ "source-map-loader" ],
      enforce: "pre"
    } ]
  },
  plugins: [
    new HtmlWebpackPlugin( {
      title: 'Mapwize js',
      filename: 'index.html',
      template: './src/index.html'
    } )
  ],
  optimization: {
    splitChunks: {
      chunks: 'all'
    }
  }
} )

const path = require('path')
const webpack = require('webpack')

module.exports = {
  mode: 'development',
  entry: {
    mapwizeui: './src/index.ts'
  },
  plugins: [
    new webpack.NamedModulesPlugin()
  ],
  node: {
    fs: 'empty',
    net: 'empty',
    tls: 'empty',
    dns: 'empty'
  },
  output: {
    filename: '[name].js',
    path: path.resolve(__dirname, 'dist'),
    library: 'MapwizeUI',
    libraryTarget: 'umd'
  },
  module: {
    noParse: /(mapwize)\.js$/,
    rules: [{
      test: /bootstrap\/js\/dist\/(.*).js$/,
      use: [{
        loader: path.resolve('./bootstrap-js-loader.js')
      }]
    }, {
      test: /\.tsx?$/,
      exclude: /node_modules/,
      use: {
        loader: 'babel-loader',
        options: {
          presets: [['@babel/preset-env', {
            useBuiltIns: 'usage',
            corejs: { version: 3, proposals: true }
          }], '@babel/preset-typescript']
        }
      }
    }, {
      test: /\.css$/,
      use: [
        'style-loader',
        'css-loader'
      ]
    }, {
      test: /bootstrap-custom\.(scss)$/,
      use: [{
        loader: 'style-loader', // inject CSS to page
      }, {
        loader: 'css-loader', // translates CSS into CommonJS modules
      }, {
        loader: path.resolve('./bootstrap-css-loader.js')
      }, {
        loader: 'postcss-loader', // Run post css actions
        options: {
          plugins: function () { // post css plugins, can be exported to postcss.config.js
            return [
              require('precss'),
              require('autoprefixer')
            ];
          }
        }
      }, {
        loader: 'sass-loader' // compiles Sass to CSS
      }]
    }, {
      test: /\.(scss)$/,
      exclude: /bootstrap-custom\.(scss)$/,
      use: [{
        loader: 'style-loader', // inject CSS to page
      }, {
        loader: 'css-loader', // translates CSS into CommonJS modules
      }, {
        loader: 'postcss-loader', // Run post css actions
        options: {
          plugins: function () { // post css plugins, can be exported to postcss.config.js
            return [
              require('precss'),
              require('autoprefixer')
            ];
          }
        }
      }, {
        loader: 'sass-loader' // compiles Sass to CSS
      }]
    }, {
      test: /\.html$/,
      exclude: /(index\.html)/,
      loader: "html-loader"
    }]
  },
  resolve: {
    extensions: ['.tsx', '.ts', '.js']
  }
}

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
      test: /\.tsx?$/,
      exclude: /node_modules/,
      use: {
        loader: 'babel-loader',
        options: {
          presets: ['@babel/preset-env', '@babel/preset-typescript']
        }
      }
    }, {
      test: /\.css$/,
      use: [
        'style-loader',
        'css-loader'
      ]
    }, {
      test: /\.(scss)$/,
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
      extensions: [ '.tsx', '.ts', '.js' ]
    }
  }

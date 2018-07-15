const path = require('path')
const webpack = require('webpack')

const HTMLWebpackPlugin = require("html-webpack-plugin")

module.exports = {

  devtool: 'cheap-module-source-map',

  entry: {
    qingdao: './src/page/qingdao.js'
  },

  mode: 'development',

  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['react', 'env'],
            plugins: ['transform-runtime', 'transform-class-properties']
          }
        }
      },
      {
        test: /\.(less|css)$/,
        exclude: /node_modules/,
        use: [
          'css-loader',
          'less-loader',
          'postcss-loader'
        ]
      }
    ]
  },

  plugins: [
    new HTMLWebpackPlugin({
      template: 'src/page/qingdao.html',
      filename: 'qingdao.html',
      chunks: {
        cnd_domain: 'daily.yuantutech.com'
      }
    }),
    new webpack.HotModuleReplacementPlugin()
  ],

  devServer: {
    contentBase: path.join(__dirname, 'dist'),
    port: 9000,
    compress: true, // 一切服务都启用gzip 压缩
    hot: true,
    inline: true,
    stats:{
      assets: false,
      chunks: false,
      chunkGroups: false,
      chunkModules: false,
      chunkOrigins: false,
      modules: false,
      moduleTrace: false,
      source: false,
      builtAt: false,
      children: false,
      hash:false,
    },
  },
}

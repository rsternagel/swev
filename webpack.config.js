
// DRY
var pkg = require('./package.json')
var dirs = pkg['swev-configs'].dirs

var webpack = require('webpack')

module.exports = {
  entry: './' + dirs.src + '/js/app.js',
  output: {
    path: '/' + dirs.dist + '/js/',
    publicPath: '/js/',
    filename: 'bundle.js'
  },
  module: {
    loaders: [
      { test: /\.vue$/, loader: 'vue' },
      { test: /\.jpe?g$|\.gif$|\.png$/i, loader: "file-loader" }
      /*
      {
        // edit this for additional asset file types
        test: /\.(png|jpg|gif)$/,
        loader: 'file?name=[name].[ext]?[hash]'
      }
      */
    ]
  }
}

if (process.env.NODE_ENV === 'production') {
  module.exports.plugins = [
    new webpack.DefinePlugin({
      'process.env': {
        NODE_ENV: '"production"'
      }
    }),
    new webpack.optimize.UglifyJsPlugin({
      compress: {
        warnings: false
      }
    }),
    new webpack.optimize.OccurenceOrderPlugin()
  ]
} else {
  module.exports.devtool = '#source-map'
}

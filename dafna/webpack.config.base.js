const path = require('path');

module.exports = {
  entry: {
    main: [path.resolve(__dirname, './src/javascripts/entry.js')]
  },
  output: {
    path: path.resolve(__dirname, './dist'),
    filename: 'js/[name].js'
  },
  module: {
    rules: [
      {
        test: /\.(js)$/,
        exclude: /node_modules/,
        loader: 'babel-loader'
      },
      {
        test: /\.pug$/,
        use: [
          {
            loader: 'file-loader',
            options: { name: '[name].html' }
          },
          'extract-loader',
          {
            loader: 'html-loader',
            options: {
              attrs: ['img:src', ':data-src']
            }
          },
          {
            loader: 'pug-html-loader',
            options: {
              pretty: true
            }
          }
        ]
      },
      {
        test: /\.(jpg|png|gif|svg)$/,
        use: [
          {
            loader: 'file-loader',
            options: {
              name: '[name].[ext]',
              outputPath: 'static/',
              publicPath: (url) => './static/' + url
            }
          }
        ]
      },
      {
        test: /\.(ttf|woff|woff2|eot|otf)$/,
        use: [
          {
            loader: 'file-loader',
            options: {
              name: '[name].[ext]',
              outputPath: 'static/',
              publicPath: (url) => './static/' + url
            },
          }
        ]
      },
    ]
  },
  // resolve: {
  //   extensions: ['.js', '.png', '.jpg', '.css', '.scss'],
  //   alias: {
  //     static: path.resolve(__dirname, 'src/static'),
  //     components: path.resolve(__dirname, 'src/pug/components')
  //   }
  // },
  plugins: [
  ]
};

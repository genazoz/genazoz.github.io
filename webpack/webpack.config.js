const path = require('path')
const HTMLWebpackPlugin = require('html-webpack-plugin')
const {CleanWebpackPlugin} = require('clean-webpack-plugin')
const CopyWebpackPlugin = require('copy-webpack-plugin')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const OptimizeCssAssetsWebpackPlugin = require('optimize-css-assets-webpack-plugin')
const TerserWebpackPlugin = require('terser-webpack-plugin')// We need Nodes fs module to read directory contents
const fs = require('fs')

// isDev = production
// isProd = development
const isDev = process.env.NODE_ENV === 'development'
const isProd = !isDev

const optimization = () => {
  const config = {
    splitChunks: {
      chunks: 'all'
    }
  }

  if(isProd) {
    config.minimizer = [
      new OptimizeCssAssetsWebpackPlugin(),
      new TerserWebpackPlugin()
    ]
  }

  return config
}
const cssLoaders = extra => {
  const loaders = [
    {
      loader: MiniCssExtractPlugin.loader,
      options: {}
    }, 
    'css-loader'
  ]

  if(extra){
    loaders.push(extra)
  }

  return loaders
}
const cssCash = () => {
  return isProd ? {filename: 'assets/css/[name].css'} : {filename: 'assets/css/[name].[contenthash].css'};
}
const jsCash = () => {
  return isProd ? 'assets/js/[name].js' : 'assets/js/[name].[contenthash].js'
}

// Our function that generates our html plugins
function generateHtmlPlugins (templateDir) {
  // Read files in template directory
  const templateFiles = fs.readdirSync(path.resolve(__dirname, templateDir))
  return templateFiles.map(item => {
    // Split names and extension
    const parts = item.split('.')
    const name = parts[0]
    const extension = parts[1]

    // Create new HTMLWebpackPlugin with options
    return new HTMLWebpackPlugin({
      filename: `${name}.html`,
      template: path.resolve(__dirname, `${templateDir}/${name}.${extension}`),
      minify: {
          collapseWhitespace: isDev
      }
    })
  })
}
// Call our function on our views directory.
const htmlPlugins = generateHtmlPlugins('./src/views/')


module.exports = {
  context: path.resolve(__dirname,'src'),
  mode: 'development',
  entry: {
    main: ['@babel/polyfill', '@/js/main.js'],
  },
  output: {
    filename: jsCash(),
    path: path.resolve(__dirname, 'dist')
  },
  resolve: {
    extensions: ['.js', '.json', '.css', '.scss', '.less', '.sass', '.png', '.jpg', '.jpeg', '.gif'],
    alias: {
      '@models': path.resolve(__dirname, 'src/models'),
      '@': path.resolve(__dirname, 'src'),
      images: path.resolve(__dirname, 'src/assets/img/'),
      js: path.resolve(__dirname, 'src/assets/js/'),
      fonts: path.resolve(__dirname, 'src/assets/fonts/'),
    }
  },
  optimization: optimization(),
  devServer: {
    port: 8080,
    historyApiFallback: true,
    contentBase: path.resolve(__dirname, './dist'),
    open: true,
    hot: isDev,
    hotOnly: true,
    inline: true
  },
  devtool: isDev ? 'source-map' : false,
  plugins: [
    // new HTMLWebpackPlugin({
    //   filename: 'index.html',
    //   template: './index.html'
    // }),
    // new HTMLWebpackPlugin({
    //   filename: 'card.html',
    //   template: './card.html'
    // }),
    new CopyWebpackPlugin({
      patterns: [
        {
          from: path.resolve(__dirname, 'src/assets/img/'),
          to: path.resolve(__dirname, 'dist/assets/img')
        }
      ]
    }),
    new CleanWebpackPlugin(),
    new MiniCssExtractPlugin(
      cssCash()
    )
  ]
  // We join our htmlPlugin array to the end
  // of our webpack plugins array.
  .concat(htmlPlugins)
  ,
  module: {
    rules: [
      {
          test: /\.js$/,
          exclude: /node_modules/,
          use: [
            {
              loader: 'babel-loader',
              options: {
                presets: [
                  '@babel/preset-env'
                ],
                plugins: [
                  '@babel/plugin-proposal-class-properties'
                ]
              }
            }
          ]
      },
      {
        test: /\.css$/,
        use: cssLoaders()
      },
      {
        test: /\.css$/i,
        loader: 'file-loader',
        options: {
          name: '[path][name].[ext]'
        }
      },
      {
        test: /\.(scss|sass)$/,
        use: cssLoaders('sass-loader'),
      },
      {
        test: /\.less$/,
        use: cssLoaders('less-loader')
      },
      {
        test: /\.(png|jpg|svg|jpeg|gif)$/,
        loader: 'file-loader',
        options: {
          name: 'assets/img/[name].[ext]',
        },
      },
      {
        test: /\.(ttf|woff|woff2|eot)$/,
        loader: 'file-loader',
        options: {
          name: 'assets/fonts/[name].[ext]',
        },
      },
      {
        test: /\.svg$/,
        use: [
          'svg-sprite-loader',
        ]
      }
      // {
      //   test: /\.xml$/,
      //   use: ['xml-loader'],
      // },
      // {
      //   test: /\.svg/,
      //   use: {
      //     loader: "svg-url-loader",
      //     options: {
      //     },
      //   },
      // },
      // {
      //   test: /\.svg$/i,
      //   use: [
      //     {
      //       loader: 'url-loader',
      //       options: {
      //         encoding: 'utf8',
      //       },
      //     },
      //   ],
      // },
    ]
  }
}
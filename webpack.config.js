const path = require('path');
const Dotenv = require('dotenv-webpack');

module.exports = { 
  entry: {
    'backend/dist/bundle': './es5/backend/index.js',
},
plugins: [
  new Dotenv()
],

  output: {
    path: path.resolve(__dirname, ''),
    filename: '[name].js'
  },
  resolve: {
    fallback: {
      "fs": false,
      "os": false,
      "path": false
    }
  },

  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['@babel/preset-env', '@babel/preset-react'],
          },
        },
      },
      {
        test: /\.(sa|sc|c)ss$/, // styles files
        use: ["style-loader", "css-loader"],
      },
    ],
  },
  devServer: {
    contentBase: './backend/dist',
  },
};
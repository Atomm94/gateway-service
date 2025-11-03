const CopyWebpackPlugin = require('copy-webpack-plugin');
const path = require('path');

module.exports = {
  target: 'node',
  entry: './src/main.ts',
  output: {
    path: path.resolve(__dirname, '../../dist/apps/gateway'),
    filename: 'main.js',
  },
  module: {
    rules: [
      {
        test: /\.ts$/,
        loader: 'ts-loader',
        exclude: /node_modules/,
      },
    ],
  },
  resolve: {
    extensions: ['.ts', '.js'],
  },
  plugins: [
    new CopyWebpackPlugin({
      patterns: [
        { from: path.resolve(__dirname, 'src/lib'), to: 'lib' }
      ],
    }),
  ],
};

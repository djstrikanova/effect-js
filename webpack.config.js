const path = require('path');

module.exports = {
  entry: './src/index.ts',
  devtool: 'inline-source-map',
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: 'ts-loader',
        exclude: /node_modules/,
      },
    ],
  },
  resolve: {
    extensions: ['.tsx', '.ts', '.js'],
    fallback: {
        "http": require.resolve("stream-http"),
        // npm install these modules
        "stream": require.resolve("stream-browserify"),
        "crypto": require.resolve("crypto-browserify"),
        "assert": require.resolve("assert"),
        "https": require.resolve("https-browserify"),
        "url": require.resolve("url"),
        "os": require.resolve("os-browserify/browser"),
        "zlib": require.resolve("browserify-zlib")
    }
  },
  output: {
    filename: 'bundle.js',
    path: path.resolve(__dirname, 'dist'),
  },
};
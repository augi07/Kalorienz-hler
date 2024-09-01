module.exports = {
  entry: ['./src/index.js'],
  devtool: 'inline-source-map',
  output: {
    filename: 'bundle.js',
  },
  devServer: {
    static: './src',
    compress: true,
    port: 9000,
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['@babel/preset-env'],
          },
        },
      },
    ],
  },
};

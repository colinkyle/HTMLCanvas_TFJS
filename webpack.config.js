const path = require('path');
const TerserPlugin = require('terser-webpack-plugin');

module.exports = {
  entry: {
    slide0: './src/slide0/slide0.ts',
    slide1: './src/slide1/slide1.ts',
    slide2: './src/slide2/slide2.ts',
    slide3: './src/slide3/slide3.ts',
    slide4: './src/slide4/slide4.ts',
    slide5: './src/slide5/slide5.ts',
    slide6: './src/slide6/slide6.ts',
    slide7: './src/slide7/slide7.ts',
    slide8: './src/slide8/slide8.ts',
    slide9: './src/slide9/slide9.ts',
    slide10: './src/slide10/slide10.ts',
    slide11: './src/slide11/slide11.ts',
    slide12: './src/slide12/slide12.ts',
    slide13: './src/slide13/slide13.ts',
    slide14: './src/slide14/slide14.ts',
    slide15: './src/slide15/slide15.ts',
    slide16: './src/slide16/slide16.ts',
    slide17: './src/slide17/slide17.ts',
  },
  module: {
    rules: [
      {
        test: /\.js|\.jsx|\.tsx?$/,
        use: ['ts-loader'],
        exclude: /node_modules/,
      },
    ],
  },
  resolve: {
    extensions: ['.tsx', '.ts', '.js'],
    alias: {
      '@utils': path.resolve(__dirname, 'src/utils'),
    },
  },
  output: {
    filename: '[name].js',
    chunkFilename: '[name].[contenthash].js',
    path: path.resolve(__dirname, 'dist'),
    publicPath: '/',
  },
  optimization: {
    moduleIds: 'deterministic',
    minimize: true,
    minimizer: [new TerserPlugin()],
    splitChunks: {
      chunks: 'all',
      minSize: 20000,
      minChunks: 1,
      maxAsyncRequests: 30,
      maxInitialRequests: 30,
      cacheGroups: {
        vendor: {
          test: /[\\/]node_modules[\\/]/,
          name: 'vendors',
          chunks: 'all',
        },
        common: {
          name: 'common',
          minChunks: 2,
          chunks: 'all',
          priority: -20,
          reuseExistingChunk: true,
          enforce: true
        }
      },
    },
  },
  performance: {
    hints: 'warning',
    maxEntrypointSize: 250000,
    maxAssetSize: 250000
  },
  cache: {
    type: 'filesystem',
    cacheDirectory: path.resolve(__dirname, '.webpack_cache')
  },
//   plugins: [
//     new webpack.DefinePlugin({
//       'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV),
//       'process.env.MY_ENV': JSON.stringify(process.env.MY_ENV),
//     })
// ],
};

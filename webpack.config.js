const path = require('path');

module.exports = {
  entry: './src/index.js',
  output: {
    filename: 'bundle.js',
    path: path.resolve(__dirname, 'dist'),
  },
  devtool: false,
  module: {
    rules: [
      {
        test: /\.js$/,
        use: ["source-map-loader"],
        enforce: "pre",
        exclude: /node_modules\/(@walletconnect|eth-rpc-errors|json-rpc-engine|@metamask|@account-abstraction)/
    }
    ]
  }
};

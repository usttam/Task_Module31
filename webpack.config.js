const path = require("path");
const HTMLPlugin = require("html-webpack-plugin");
const { CleanWebpackPlugin } = require("clean-webpack-plugin");
const webpack = require("webpack");
module.exports = {
  entry: "./src/app.js",
  output: {
    filename: "bundle.[chunkhash].js",
    path: path.resolve(__dirname, "public"),
  },
  devServer: {
    port: 3000,
  },
  plugins: [
    new HTMLPlugin({
      template: "./src/index.html",
    }),
 
    new webpack.ProvidePlugin({       
        $: "jquery/dist/jquery.min.js",
        jQuery: "jquery/dist/jquery.min.js",
        "window.jQuery": "jquery/dist/jquery.min.js"
    }),

    
    new CleanWebpackPlugin(),
  ],
  module: {
    rules: [
      {
        test: /\.css$/i,
        use: ["style-loader", "css-loader"],
      },
      {
        test: /\.html$/,
        use: [
          {
            loader: "html-loader",
            options: {
              minimize: true,
            },
          },
        ],
      },
    ],
  },
};

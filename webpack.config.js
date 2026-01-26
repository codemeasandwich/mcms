const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
  // Entry point: where Webpack starts building the dependency graph
  // This is the first file that gets executed when your app loads
  entry: './src/index.js',

  // Output: where Webpack puts the bundled files
  output: {
    path: path.resolve(__dirname, 'dist'),  // Output directory (absolute path)
    filename: 'bundle.js',                   // Name of the bundled file
    clean: true,                             // Clean the dist folder before each build
  },

  // Mode: 'development' enables useful dev features like better error messages
  // Use 'production' when building for deployment (enables minification)
  mode: 'development',

  // Module rules: tell Webpack how to handle different file types
  module: {
    rules: [
      {
        test: /\.(js|jsx)$/,        // Apply this rule to .js and .jsx files
        exclude: /node_modules/,    // Don't process files in node_modules
        use: {
          loader: 'babel-loader',   // Use Babel to transform these files
        },
      },
      {
        test: /\.css$/,             // Apply this rule to .css files
        use: ['style-loader', 'css-loader'],  // Process CSS and inject into DOM
      },
    ],
  },

  // Resolve: configure how Webpack resolves module imports
  resolve: {
    extensions: ['.js', '.jsx'],    // Allow importing without file extensions
  },

  // Plugins: extend Webpack's functionality
  plugins: [
    new HtmlWebpackPlugin({
      template: './public/index.html',  // Use our HTML file as a template
    }),
  ],

  // DevServer: configuration for the development server
  devServer: {
    static: {
      directory: path.join(__dirname, 'public'),  // Serve static files from public/
    },
    port: 3000,           // Run on port 3000
    open: true,           // Automatically open browser when server starts
    hot: true,            // Enable Hot Module Replacement (HMR)
    historyApiFallback: true,  // Support for single-page app routing
  },
};

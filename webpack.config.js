const path = require('path');
//import path from 'path';

module.exports = {

    mode: 'development',

    devtool: "eval-cheap-module-source-map",

    entry: './src/client/index.jsx',

    output: {
        path: path.resolve(__dirname, './public/'),
        filename: 'bundle.js'
    },

    module: {
        rules: [
            {
                test: /\.jsx$/,
                include: path.resolve(__dirname, './src/'),
                loader: "babel-loader"
            }
        ]
    }

};
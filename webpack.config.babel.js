//const path = require('path');
import path from 'path';

export default {

    mode: 'development',

    devtool: "eval-cheap-module-source-map",

    entry: './src/client/index.js',

    output: {
        path: path.resolve(__dirname, './public/'),
        filename: 'bundle.js'
    },

    module: {
        rules: [
            {
                test: /\.js$/,
                include: path.resolve(__dirname, './src/'),
                loader: "babel-loader"
            }
        ]
    }

};
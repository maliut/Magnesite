const path = require('path');
//import path from 'path';

module.exports = {

    //mode: 'development',

    //devtool: "eval-cheap-module-source-map",

    entry: './dist/client/index.js',

    output: {
        path: path.resolve(__dirname, './public/'),
        filename: 'bundle.js'
    },

    /*module: {
        rules: [
            {
                test: /\.jsx$/,
                include: path.resolve(__dirname, './dist/'),
                loader: "babel-loader"
            },
            {
                include: path.resolve(__dirname, './dist/common/components/'),
                loader: "babel-loader"
            },
            {
                test: /^Component.js$/,
                include: path.resolve(__dirname, './dist/common/components/'),
                loader: path.resolve(__dirname, './dist/common/components/componentLoader.js')
            }
        ]
    },*/

    externals: {
        "react": 'React',
        "react-dom": "ReactDOM",
        "superagent": "superagent",
        "three": 'THREE',
        "crypto-js": "CryptoJS"
    },

    node: {
        fs: "empty"
    }

};
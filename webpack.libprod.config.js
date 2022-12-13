const webpack = require('webpack');
const path = require('path');
const buildFileName = `nuroplayer-api`;

module.exports = {
    mode: 'production',
    entry: './src/nurolib.js',
    output: {
        libraryTarget: 'var',
        library: 'nurolib',
        path: path.resolve(__dirname, 'player/beta'),
        filename: `${buildFileName}.min.js`,
    },
    module: {
        rules: [
            {
                test: /\.(js|jsx)$/,
                loader: 'babel-loader',
                exclude: /(node_modules)/,
            },
            {
                test: [/\.css$/, /\.scss$/],
                use: ["style-loader", "css-loader"],
            }
        ],

    },
    // externals: {
    //     react: "react",
    //     'react-dom': "react-dom"
    // },
};
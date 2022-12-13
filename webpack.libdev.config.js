const path = require('path');

module.exports = {
    mode: 'development',
    // devtool: 'cheap-module-source-map',
    entry: './src/nurolib.js',
    output: {
        libraryTarget: 'var',
        library: 'nurolib',
        path: path.resolve(__dirname, 'player/beta'),
        filename: 'nuro-player.js',
    },
    module: {
        rules: [
            {
                test: /\.(js|jsx)$/,
                loader: 'babel-loader',
                exclude: /(node_modules)/,
            },
            {
                test: [/\.css$/,/\.scss$/],
                use: ["style-loader", "css-loader"],
            },
        ],
    }, 
    // externals: {
    //     react: "react",
    //     'react-dom': "react-dom"
    // },
};


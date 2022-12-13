const rewire = require('rewire');
const defaults = rewire('react-scripts/scripts/build.js');
let config = defaults.__get__('config');

config.optimization.splitChunks = {
    cacheGroups: {
        default: false,
    },
};

config.optimization.runtimeChunk = false;
const buildFileName = `nuroplayer`;
//JS Overrides
config.output.filename = `${buildFileName}.min.js`;

// Change the CSS output file name and path, from 'static/css/[name].[contenthash:8].css' to `static/${buildFileName}.css`
config.plugins.map((plugin, i) => {
    if (plugin.filename && plugin.filename.includes('static/css')) {
        config.plugins[i].filename = `${buildFileName}.min.css`;
    }
});

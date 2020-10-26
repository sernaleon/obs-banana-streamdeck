const path = require('path');

module.exports = {
    entry: './WebSrc/index.js',
    output: {
        filename: 'main.js',
        path: __dirname
    },
    optimization: {
        minimize: false
    },
}
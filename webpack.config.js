const path = require('path');

module.exports = {
    entry: {
        index: './src/frontend/controllers/index.js',
        admin: './src/frontend/controllers/admin.js'
    },
    output: {
        path: path.resolve(__dirname, './public'),
        filename: 'js/[name].js'
    }
}
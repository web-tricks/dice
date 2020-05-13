const path = require('path');

module.exports = {
    entry: ['./src/frontend/controllers/index.js'],
    output: {
        path: path.resolve(__dirname, './public'),
        filename: 'js/app.js'
    }
}
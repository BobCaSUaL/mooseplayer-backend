require('babel-register')({
    // Ignore everything in node_modules except node_modules/rcomponents.
    ignore: /node_modules\/(?!pueblo)/
})
require('babel-polyfill')
require('./src')

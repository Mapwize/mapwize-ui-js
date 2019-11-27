var glob = require('glob')
var path = require('path')

glob.sync('./tests/**/*.test.js').forEach(function (file) {
  require(path.resolve(file))
})

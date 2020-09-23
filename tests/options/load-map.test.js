const { mwzDescribe, mwzTest } = require('../core/utils')

const testSuites = 'Displaying a map'
mwzDescribe(testSuites, function () {
  mwzTest('Simple example (only apiKey)', function (callbackTest) {
    MapwizeUI.map({
      apiKey: APIKEY
    }).then(function (map) {
      callbackTest(null);
    }).catch(function (e) { callbackTest(e.toString()); });
  })
})

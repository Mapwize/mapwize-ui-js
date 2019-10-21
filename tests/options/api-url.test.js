const { mwzDescribe, mwzTest } = require('../core/utils')

const testSuites = 'Api url'
mwzDescribe(testSuites, () => {
  mwzTest('Simple example with dev url', (callbackTest) => {
    var apiUrl = 'https://contexeo-dev-develop.herokuapp.com'
      MapwizeUI.map({
        apiUrl: apiUrl,
        apiKey: APIKEY
      }).then((map) => {
        callbackTest(MapwizeUI.apiUrl() === apiUrl ? null : new Error('Api url must be ' + apiUrl + '. but ' + MapwizeUI.apiUrl() + ' found'))
      }).catch(e => callbackTest(e))
  })
})

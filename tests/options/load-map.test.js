const { mwzDescribe, mwzTest } = require('../core/utils')

const testSuites = 'Displaying a map'
mwzDescribe(testSuites, () => {
  mwzTest('Simple example (only apiKey)', (callbackTest) => {
    MapwizeUI.map({
      apiKey: APIKEY
    }).then((map) => {
      callbackTest(null)
    }).catch(callbackTest)
  })
})

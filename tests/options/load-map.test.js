const { mwzDescribe, mwzTest } = require('../core/utils')

const testSuites = 'Displaying a map'
mwzDescribe(testSuites, () => {
  mwzTest(testSuites, 'Simple example (only apiKey)', (page) => {
    return () => {
      MapwizeUI.map({
        apiKey: '89a2695d7485fda885c96b405dcc8a25'
      }).then((map) => {
        window.callbackTest(null)
      }).catch(window.callbackTest)
    }
  })
})

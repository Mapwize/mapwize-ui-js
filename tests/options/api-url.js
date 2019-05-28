const { mwzDescribe, mwzTest } = require('../core/utils')

const testSuites = 'Api url'
mwzDescribe(testSuites, () => {
  mwzTest(testSuites, 'Simple example with dev url', (page) => {
    return () => {
      MapwizeUI.map({
        apiUrl: 'https://contexeo-dev-develop.herokuapp.com/v1',
        apiKey: '89a2695d7485fda885c96b405dcc8a25'
      }).then((map) => {
        window.callbackTest(null)
      }).catch(window.callbackTest)
    }
  })
})

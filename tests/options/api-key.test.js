const { mwzDescribe, mwzTest, initBrowser, killBrowser } = require('../core/utils')

const testSuites = 'Apikey'
mwzDescribe(testSuites, () => {
  mwzTest(testSuites, 'With correct apikey', (page) => {
    return () => {
      MapwizeUI.map({
        apiKey: '89a2695d7485fda885c96b405dcc8a25',
      }).then((map) => {
        if ($('#mapwize').hasClass('mapwizeui') == true) {
          window.callbackTest(null)
        } else {
          window.callbackTest("#mapwize don't have mapwizeui css class")
        }
      }).catch(window.callbackTest)
    }
  })
})

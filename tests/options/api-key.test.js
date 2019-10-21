const { mwzDescribe, mwzTest } = require('../core/utils')

const testSuites = 'Apikey'
mwzDescribe(testSuites, () => {
  mwzTest('With correct apikey', (callbackTest) => {
    MapwizeUI.map({
      apiKey: APIKEY,
    }).then((map) => {
      if ($('#mapwize').hasClass('mapwizeui') == true) {
        callbackTest(null)
      } else {
        callbackTest('#mapwize don\'t have mapwizeui css class')
      }
    }).catch(e => callbackTest(e))
  })
})

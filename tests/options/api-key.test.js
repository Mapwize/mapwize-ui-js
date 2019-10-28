const { mwzDescribe, mwzTest } = require('../core/utils')

const testSuites = 'Apikey'
mwzDescribe(testSuites, function () {
  mwzTest('With correct apikey', function (callbackTest) {
    MapwizeUI.map({
      apiKey: APIKEY,
    }).then(function (map) {
      if ($('#mapwize').hasClass('mapwizeui') == true) {
        callbackTest(null)
      } else {
        callbackTest('#mapwize don\'t have mapwizeui css class')
      }
    }).catch(function (e) { callbackTest(e) })
  })
})

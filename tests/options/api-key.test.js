const { mwzDescribe, mwzTest } = require('../core/utils')

const testSuites = 'Apikey'
mwzDescribe(testSuites, function () {
  mwzTest('With correct apikey', function (callbackTest) {
    MapwizeUI.map({
      apiKey: APIKEY,
    }).then(function (map) {
      if ($('#mapwize').hasClass('mwz-ui-container') == true) {
        callbackTest(null)
      } else {
        callbackTest('#mapwize don\'t have mwz-ui-container css class')
      }
    }).catch(function (e) { callbackTest(e.toString()) })
  })
})

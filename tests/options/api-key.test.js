const { mwzDescribe, mwzTest } = require('../core/utils')

const testSuites = 'Apikey'
mwzDescribe(testSuites, function () {
  mwzTest('With correct apikey', function (callbackTest) {
    MapwizeUI.map({
      apiKey: APIKEY,
    }).then(function (map) {
      if ($('#mapwize').find('.mwz-ui-container').length) {
        callbackTest(null)
      } else {
        callbackTest('Don\'t find mwz-ui-container css class in #mapwize container')
      }
    }).catch(function (e) { callbackTest(e.toString()) })
  })
})

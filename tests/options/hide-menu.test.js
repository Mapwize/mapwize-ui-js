const { mwzDescribe, mwzTest } = require('../core/utils')

const testSuites = 'Hide menu'
mwzDescribe(testSuites, function () {
  mwzTest('hideMenu: true', function(callbackTest) {
    MapwizeUI.map({
      apiKey: APIKEY,
      hideMenu: true
    }).then(function (map) {
      if ($('#menuBar').hasClass('d-none') == true) {
        callbackTest(null)
      } else {
        callbackTest('#menuBar don\'t have d-none css class')
      }
    }).catch(function (e) { callbackTest(e) })
  })
})

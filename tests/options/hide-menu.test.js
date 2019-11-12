const { mwzDescribe, mwzTest } = require('../core/utils')

const testSuites = 'Hide menu'
mwzDescribe(testSuites, function () {
  mwzTest('hideMenu: true', function(callbackTest) {
    MapwizeUI.map({
      apiKey: APIKEY,
      hideMenu: true
    }).then(function (map) {
      if ($('#mwz-menu-button').length) {
        callbackTest('#mwz-menu-button does not exist when hideMenu is set to true')
      } else {
        callbackTest(null)
      }
    }).catch(function (e) { callbackTest(e) })
  })
})

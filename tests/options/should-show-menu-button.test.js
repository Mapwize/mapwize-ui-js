const { mwzDescribe, mwzTest } = require('../core/utils')

const testSuites = 'Menu button'
mwzDescribe(testSuites, function () {
  mwzTest('show menu button ', function (callbackTest) {
    MapwizeUI.map({
      apiKey: APIKEY,
      onMenuButtonClick: function (e) {
      },
    }).then(function (map) {
      if ($('#mwz-menu-button').length == 0) {
        callbackTest('#mwz-menu-button does not exist when onMenuButtonClick function is set')
      } else {
        callbackTest(null)
      }
    }).catch(function (e) { callbackTest(e) })
  })
})

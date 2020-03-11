const { mwzDescribe, mwzTest } = require('../core/utils')

const testSuites = 'Menu button'
mwzDescribe(testSuites, function () {
  mwzTest('show menu button ', function (callbackTest) {
    MapwizeUI.map({
      apiKey: APIKEY,
      onMenuButtonClick: function (e) {
      },
    }).then(function (map) {
      if ($('#mwz-menu-button').length !== 1) {
        callbackTest('#mwz-menu-button should exist when onMenuButtonClick function is set')
      } else {
        callbackTest(null)
      }
    }).catch(function (e) { callbackTest(e) })
  })

  mwzTest('menu button hidden by default ', function (callbackTest) {
    MapwizeUI.map({
      apiKey: APIKEY,
    }).then(function (map) {
      if ($('#mwz-menu-button').length !== 0) {
        callbackTest('#mwz-menu-button should not exist when onMenuButtonClick function is not set')
      } else {
        callbackTest(null)
      }
    }).catch(function (e) { callbackTest(e) })
  })
})

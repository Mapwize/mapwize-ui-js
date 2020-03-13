const { mwzDescribe, mwzTest } = require('../core/utils')

const testSuites = 'Location control'
mwzDescribe(testSuites, function () {
  mwzTest('show location control button ', function (callbackTest) {
    MapwizeUI.map({
      apiKey: APIKEY,
      locationControl: true
    }).then(function (map) {
      if ($('.mwz-ctrl-location').length !== 1) {
        callbackTest('.mwz-ctrl-location should exist when locationControl is true')
      } else {
        callbackTest(null)
      }
    }).catch(function (e) { callbackTest(e) })
  })

  mwzTest('location control button hidden by default ', function (callbackTest) {
    MapwizeUI.map({
      apiKey: APIKEY
    }).then(function (map) {
      if ($('.mwz-ctrl-location').length !== 0) {
        callbackTest('.mwz-ctrl-location should not exist when locationControl is false')
      } else {
        callbackTest(null)
      }
    }).catch(function (e) { callbackTest(e) })
  })
})

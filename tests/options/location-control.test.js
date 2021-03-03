const { mwzDescribe, mwzTest } = require('../core/utils')

const testSuites = 'Location control'
mwzDescribe(testSuites, function () {
  mwzTest('show location control button ', function (callbackTest) {
    MapwizeUI.map({
      apiKey: APIKEY,
      locationControl: true
    }).then(function (map) {
      if ($('.mwz-follow-user-button').length !== 1) {
        callbackTest('.mwz-follow-user-button should exist when locationControl is true')
      } else {
        callbackTest(null)
      }
    }).catch(function (e) { callbackTest(e.toString()) })
  })

  mwzTest('location control button hidden by default ', function (callbackTest) {
    MapwizeUI.map({
      apiKey: APIKEY
    }).then(function (map) {
      if ($('.mwz-follow-user-button').length !== 0) {
        callbackTest('.mwz-follow-user-button should not exist when locationControl is false')
      } else {
        callbackTest(null)
      }
    }).catch(function (e) { callbackTest(e.toString()) })
  })
})

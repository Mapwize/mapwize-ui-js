const { mwzDescribe, mwzTest } = require('../core/utils')

const testSuites = 'Set selected'
mwzDescribe(testSuites, function () {
  mwzTest('With place id', function (callbackTest) {
    MapwizeUI.map({
      apiKey: APIKEY,
    }).then(function (map) {
      return map.setSelected(MAPWIZEPLACEID).then(function () {
        callbackTest(null)
      })
    }).catch(function (e) { callbackTest(e) })
  })

  mwzTest('With placeList id', function (callbackTest) {
    MapwizeUI.map({
      apiKey: APIKEY,
    }).then(function (map) {
      return map.setSelected(BATHROOMPLACELISTID).then(function () {
        callbackTest(null)
      })
    }).catch(function (e) { callbackTest(e) })
  })

  mwzTest('With unexisting id', function (callbackTest) {
    MapwizeUI.map({
      apiKey: APIKEY,
    }).then(function (map) {
      return map.setSelected('5d08d8a8efe1d200128092g8').then(function () {
        callbackTest('setSelected must failed with unexisting id')
      }).catch(function () {
        callbackTest(null)
      })
    }).catch(function (e) { callbackTest(e) })
  })
})

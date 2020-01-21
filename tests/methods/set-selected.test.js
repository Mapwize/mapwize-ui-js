const { mwzDescribe, mwzTest } = require('../core/utils')

const testSuites = 'Set selected'
mwzDescribe(testSuites, function () {
  mwzTest('With place id', function (callbackTest) {
    MapwizeUI.map({
      apiKey: APIKEY,
      onSelectedChange: function (e) {
        if (e._id !== MAPWIZEPLACEID) {
          callbackTest('Selected element must be mapwize place. Found id: ' + e._id)
        } else {
          callbackTest(null)
        }
      }
    }).then(function (map) {
      return map.setSelected(MAPWIZEPLACEID)
    }).catch(function (e) { callbackTest(e) })
  })

  mwzTest('With placeList id', function (callbackTest) {
    MapwizeUI.map({
      apiKey: APIKEY,
      onSelectedChange: function (e) {
        if (e._id !== BATHROOMPLACELISTID) {
          callbackTest('Selected element must be bathroom placeList. Found id: ' + e._id)
        } else {
          callbackTest(null)
        }
      }
    }).then(function (map) {
      return map.setSelected(BATHROOMPLACELISTID)
    }).catch(function (e) { callbackTest(e) })
  })

  mwzTest('With unexisting id', function (callbackTest) {
    MapwizeUI.map({
      apiKey: APIKEY,
    }).then(function (map) {
      return map.setSelected('5d08d8a8efe1d200128092g8').then(function () {
        callbackTest('setSelected must fail with unexisting id')
      }).catch(function () {
        callbackTest(null)
      })
    }).catch(function (e) { callbackTest(e) })
  })
})

var { mwzDescribe, mwzTest } = require('../core/utils')

var testSuites = 'Set direction mode'
mwzDescribe(testSuites, function () {
  mwzTest('Must failed outside venue', function (callbackTest) {
    MapwizeUI.map({
      apiKey: APIKEY,
    }).then(function (map) {
      map.setDirectionMode().then(function () {
        callbackTest('Direction mode must not be setted outside venue')
      }).catch(function (e) { callbackTest(null) })
    }).catch(function (e) { callbackTest(e) })
  })
  
  mwzTest('Must pass inside venue', function (callbackTest) {
    MapwizeUI.map({
      apiKey: APIKEY,
      mapwizeOptions: {
        centerOnVenueId: EURATECHNOLOGIESVENUEID
      },
    }).then(function (map) {
      map.on('mapwize:venueenter', function () {
        map.setDirectionMode().then(function () {
          callbackTest(null)
        }).catch(function () {
          callbackTest('Direction must be visible inside venue')
        })
      });
    }).catch(function (e) { callbackTest(e) })
  })
})

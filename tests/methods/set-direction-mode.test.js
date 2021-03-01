var { mwzDescribe, mwzTest } = require('../core/utils')

var testSuites = 'Set direction mode'
mwzDescribe(testSuites, function () {
  mwzTest('Must failed outside venue', function (callbackTest) {
    MapwizeUI.map({
      apiKey: APIKEY,
    }).then(function (map) {
      map.on('mapwize:error', function(e) {
        console.log(e);
        if (e.error.message === 'Must be inside venue to enter in direction') {
          callbackTest(null)
        }
      })
      map.setDirectionMode()
    }).catch(function (e) { callbackTest(e.toString()) })
  })
  
  // mwzTest('Must pass inside venue', function (callbackTest) {
  //   MapwizeUI.map({
  //     apiKey: APIKEY,
  //     centerOnVenueId: EURATECHNOLOGIESVENUEID
  //   }).then(function (map) {
  //     map.on('mapwize:venueenter', function () {
  //       map.setDirectionMode()
  //     });
  //   }).catch(function (e) { callbackTest(e.toString()) })
  // })
})

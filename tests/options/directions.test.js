const { mwzDescribe, mwzTest } = require('../core/utils')

const testSuites = 'Direction option'
mwzDescribe(testSuites, function () {
  mwzTest('With correct direction object', function (callbackTest) {
    MapwizeUI.map({
      apiKey: APIKEY,
      mapwizeOptions: {
        centerOnVenueId: EURATECHNOLOGIESVENUEID
      },
      direction: {
        from: RECEPTIONPLACEID,
        to: MAPWIZEPLACEID
      },
    }).then(function (map) {
      map.on('mapwize:directionstart', function (e) {
        if (e.direction.from.placeId === RECEPTIONPLACEID && e.direction.to.placeId === MAPWIZEPLACEID) {
          callbackTest(null)
        } else {
          callbackTest('Bad direction found. Expected from ' + RECEPTIONPLACEID + ' to ' + MAPWIZEPLACEID + '. Found from ' + e.from.placeId + ' to ' + e.to.placeId)
        }
      })
    }).catch(function (e) { callbackTest(e) })
  })
})

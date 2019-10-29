const { mwzDescribe, mwzTest } = require('../core/utils')

const testSuites = 'Set direction from and to'
mwzDescribe(testSuites, function () {
  mwzTest('Form reception to mapwize', function (callbackTest) {
    MapwizeUI.map({
      apiKey: APIKEY,
      centerOnVenueId: EURATECHNOLOGIESVENUEID
    }).then(function (map) {
      map.on('mapwize:directionstart', function (e) {
        if (e.direction.from.placeId === RECEPTIONPLACEID && e.direction.to.placeId === MAPWIZEPLACEID) {
          callbackTest(null)
        } else {
          callbackTest('Bad direction found. Expected from ' + RECEPTIONPLACEID + ' to ' + MAPWIZEPLACEID + '. Found from ' + e.direction.from.placeId + ' to ' + e.direction.to.placeId)
        }
      })
      map.on('mapwize:venueenter', function () {
        setTimeout(function () {
          map.setDirectionMode()
          MapwizeUI.Api.getPlace(RECEPTIONPLACEID).then(function (from) {
            map.setFrom(_.set(from, 'objectClass', 'place'))
          })
          MapwizeUI.Api.getPlace(MAPWIZEPLACEID).then(function (to) {
            map.setTo(_.set(to, 'objectClass', 'place'))
          })
        }, 0)
      })
    }).catch(function (e) { callbackTest(e) })
  })
})

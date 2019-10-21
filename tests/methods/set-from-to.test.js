const { mwzDescribe, mwzTest } = require('../core/utils')

const testSuites = 'Set direction from and to'
mwzDescribe(testSuites, () => {
  mwzTest('Form reception to mapwize', (callbackTest) => {
    MapwizeUI.map({
      apiKey: APIKEY,
      mapwizeOptions: {
        centerOnVenueId: EURATECHNOLOGIESVENUEID
      },
    }).then((map) => {
      map.on('mapwize:directionstart', e => {
        if (e.direction.from.placeId === RECEPTIONPLACEID && e.direction.to.placeId === MAPWIZEPLACEID) {
          callbackTest(null)
        } else {
          callbackTest('Bad direction found. Expected from ' + RECEPTIONPLACEID + ' to ' + MAPWIZEPLACEID + '. Found from ' + e.direction.from.placeId + ' to ' + e.direction.to.placeId)
        }
      })
      map.on('mapwize:venueenter', () => {
        setTimeout(() => {
          map.setDirectionMode()
          MapwizeUI.Api.getPlace(RECEPTIONPLACEID).then(from => {
            map.setFrom(_.set(from, 'objectClass', 'place'))
          })
          MapwizeUI.Api.getPlace(MAPWIZEPLACEID).then(to => {
            map.setTo(_.set(to, 'objectClass', 'place'))
          })
        }, 0)
      })
    }).catch(e => callbackTest(e))
  })
})

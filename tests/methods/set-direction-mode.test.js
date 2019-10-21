const { mwzDescribe, mwzTest } = require('../core/utils')

const testSuites = 'Set direction mode'
mwzDescribe(testSuites, () => {
  mwzTest('Must failed outside venue', (callbackTest) => {
    MapwizeUI.map({
      apiKey: APIKEY,
    }).then((map) => {
      map.setDirectionMode().then(() => {
        callbackTest('Direction mode must not be setted outside venue')
      }).catch(e => callbackTest(null))
    }).catch(e => callbackTest(e))
  })
  
  mwzTest('Must pass inside venue', (callbackTest) => {
    MapwizeUI.map({
      apiKey: APIKEY,
      mapwizeOptions: {
        centerOnVenueId: EURATECHNOLOGIESVENUEID
      },
    }).then((map) => {
      map.on('mapwize:venueenter', () => {
        map.setDirectionMode().then(() => {
          callbackTest(null)
        }).catch(() => {
          callbackTest('Direction must be visible inside venue')
        })
      });
    }).catch(e => callbackTest(e))
  })
})

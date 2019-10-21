const { mwzDescribe, mwzTest } = require('../core/utils')
const testSuites = 'Set language'

mwzDescribe(testSuites, () => {
  mwzTest('language: fr', (callbackTest) => {
    MapwizeUI.map({
      apiKey: APIKEY,
      locale: 'fr',
      mapwizeOptions: {
        centerOnVenueId: EURATECHNOLOGIESVENUEID
      }
    }).then((map) => {
      map.on('mapwize:venueenter', venue => {
        if ($('#mwz-mapwizeSearch').attr('placeholder').includes('Rechercher dans')) {
          callbackTest(null)
        } else {
          callbackTest('#mwz-mapwizeSearch placeholder expected: "Rechercher dans EuraTechnologies" received: ' + $('#mwz-mapwizeSearch').attr('placeholder'))
        }
      })
    }).catch(callbackTest)
  })
  
  mwzTest('language: en', (callbackTest) => {
    MapwizeUI.map({
      apiKey: APIKEY,
      locale: 'en',
      mapwizeOptions: {
        centerOnVenueId: EURATECHNOLOGIESVENUEID
      }
    }).then((map) => {
      map.on('mapwize:venueenter', venue => {
        if ($('#mwz-mapwizeSearch').attr('placeholder').includes('Search in')) {
          callbackTest(null)
        } else {
          callbackTest('#mwz-mapwizeSearch placeholder expected: "Search in EuraTechnologies" received: ' + $('#mwz-mapwizeSearch').attr('placeholder'))
        }
      })
    }).catch(callbackTest)
  })
  
  mwzTest('language: null', (callbackTest) => {
    MapwizeUI.map({
      apiKey: APIKEY,
      mapwizeOptions: {
        centerOnVenueId: EURATECHNOLOGIESVENUEID
      }
    }).then((map) => {
      map.on('mapwize:venueenter', venue => {
        if ($('#mwz-mapwizeSearch').attr('placeholder').includes('Search in')) {
          callbackTest(null)
        } else {
          callbackTest('#mwz-mapwizeSearch placeholder expected: "Search in EuraTechnologies" received: ' + $('#mwz-mapwizeSearch').attr('placeholder'))
        }
      })
    }).catch(callbackTest)
  })
})

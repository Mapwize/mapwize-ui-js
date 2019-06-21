const { mwzTest, initBrowser, killBrowser } = require('../core/utils')
const testSuites = 'Set language'
describe(testSuites, () => {
  beforeAll(() => {
    return initBrowser(testSuites)
  })

  afterAll(() => {
    return killBrowser(testSuites)
  })
  mwzTest(testSuites, 'language: fr', (page) => {
    return () => {
      MapwizeUI.map({
        apiKey: 'ContexeoDevAppAPIKEY',
        language: 'fr',
        centerOnVenue: '56b20714c3fa800b00d8f0b5'
      }).then((map) => {
        map.on('mapwize:venueenter', venue => {
          if ($('#mwz-mapwizeSearch').attr('placeholder') == "Rechercher dans EuraTechnologies") {
            window.callbackTest(null)
          } else {
            window.callbackTest("#mwz-mapwizeSearch placeholder expected: 'Rechercher dans EuraTechnologies' received: " + $('#mwz-mapwizeSearch').attr('placeholder'))
          }
        });

      }).catch(window.callbackTest)
    }
  })

  mwzTest(testSuites, 'language: en', (page) => {
    return () => {
      MapwizeUI.map({
        apiKey: 'ContexeoDevAppAPIKEY',
        language: 'en',
        centerOnVenue: '56b20714c3fa800b00d8f0b5'
      }).then((map) => {

        map.on('mapwize:venueenter', venue => {
          if ($('#mwz-mapwizeSearch').attr('placeholder') == "Search in EuraTechnologies") {
            window.callbackTest(null)
          } else {
            window.callbackTest("#mwz-mapwizeSearch placeholder expected: 'Search in EuraTechnologies' received: " + $('#mwz-mapwizeSearch').attr('placeholder'))
          }
        });

      }).catch(window.callbackTest)
    }
  })

  mwzTest(testSuites, 'language: null', (page) => {
    return () => {
      MapwizeUI.map({
        apiKey: 'ContexeoDevAppAPIKEY',
        centerOnVenue: '56b20714c3fa800b00d8f0b5'
      }).then((map) => {

        map.on('mapwize:venueenter', venue => {
          if ($('#mwz-mapwizeSearch').attr('placeholder') == "Search in EuraTechnologies") {
            window.callbackTest(null)
          } else {
            window.callbackTest("#mwz-mapwizeSearch placeholder expected: 'Search in EuraTechnologies' received: " + $('#mwz-mapwizeSearch').attr('placeholder'))
          }
        });

      }).catch(window.callbackTest)
    }
  })

})

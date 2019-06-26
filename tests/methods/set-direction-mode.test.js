const { mwzTest, initBrowser, killBrowser } = require('../core/utils')

const testSuites = 'Set direction mode'
describe(testSuites, () => {
  beforeAll(() => {
    return initBrowser(testSuites)
  })
  
  afterAll(() => {
    return killBrowser(testSuites)
  })
  
  mwzTest(testSuites, 'Must failed outside venue', (page) => {
    return () => {
      MapwizeUI.map({
        apiKey: 'YOUR_MAPWIZE_API_KEY_HERE',
      }).then((map) => {
        map.setDirectionMode()
        if (!$('#mwz-searchDirection').is(':visible')) {
          window.callbackTest(null)
        } else {
          window.callbackTest("#mwz-searchDirection must not be visible outside venue")
        }
      }).catch(window.callbackTest)
    }
  })

  mwzTest(testSuites, 'Must pass inside venue', (page) => {
    return () => {
      MapwizeUI.map({
        apiKey: 'YOUR_MAPWIZE_API_KEY_HERE',
        centerOnVenue: '56b20714c3fa800b00d8f0b5',
      }).then((map) => {
        map.on('mapwize:venueenter', () => {
          map.setDirectionMode()
          if ($('#mwz-searchDirection').is(':visible')) {
            window.callbackTest(null)
          } else {
            window.callbackTest("#mwz-searchDirection must be visible inside venue")
          }
        });
      }).catch(window.callbackTest)
    }
  })
  
})

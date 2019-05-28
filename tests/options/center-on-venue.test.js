const { mwzDescribe, mwzTest, initBrowser, killBrowser } = require('../core/utils')

const testSuites = 'Center on venue'
mwzDescribe(testSuites, () => {
  mwzTest(testSuites, 'With correct venue id', (page) => {
    return () => {
      MapwizeUI.map({
        apiKey: '89a2695d7485fda885c96b405dcc8a25',
        centerOnVenue: '56b20714c3fa800b00d8f0b5',
      }).then((map) => {
        map.on('mapwize:venueenter', venue => {
          if ($('#mapwize').hasClass('mwz-venue-footer') == true) {
            window.callbackTest(null)
          } else {
            window.callbackTest("#mapwize don't have mwz-venue-footer css class")
          }
        });
      }).catch(window.callbackTest)
    }
  })
})

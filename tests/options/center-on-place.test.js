const { mwzDescribe, mwzTest, initBrowser, killBrowser } = require('../core/utils')

const testSuites = 'Center on place'
mwzDescribe(testSuites, () => {
  mwzTest(testSuites, 'With correct place id', (page) => {
    return () => {
      MapwizeUI.map({
        apiKey: '89a2695d7485fda885c96b405dcc8a25',
        centerOnPlace:'57027481ab184e0b009f4504',
      }).then((map) => {
        map.on('mapwize:venueenter', venue => {
          if ($('#mwz-footerVenue').hasClass('d-none') == true) {
            window.callbackTest(null)
          } else {
            window.callbackTest("#mwz-footerVenue don't have d-none css class")
          }
        });
      }).catch(window.callbackTest)
    }
  })
})

const { mwzDescribe, mwzTest } = require('../core/utils')

const testSuites = 'Set direction mode'
mwzDescribe(testSuites, () => {
  mwzTest(testSuites, 'Must failed outside venue', (page) => {
    return () => {
      MapwizeUI.map({
        apiKey: '89a2695d7485fda885c96b405dcc8a25',
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
        apiKey: '89a2695d7485fda885c96b405dcc8a25',
        mapwizeOptions: {centerOnVenueId: '56b20714c3fa800b00d8f0b5'},
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

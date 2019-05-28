const { mwzDescribe, mwzTest } = require('../core/utils')

const testSuites = 'Set direction from and to'
mwzDescribe(testSuites, () => {
  mwzTest(testSuites, 'Form reception to mapwize', (page) => {
    return () => {
      MapwizeUI.map({
        apiKey: '89a2695d7485fda885c96b405dcc8a25',
        centerOnVenue: '56b20714c3fa800b00d8f0b5',
      }).then((map) => {
        map.on('mapwize:directionstart', direction => {
          if (direction.from.placeId === '569f8d7cb4d7200b003c32a1' && direction.to.placeId === '5d08d8a4efe1d20012809ee5') {
            window.callbackTest(null)
          } else {
            window.callbackTest("Bad direction found. Expected from 569f8d7cb4d7200b003c32a1 to 5d08d8a4efe1d20012809ee5. Found from " + direction.from.placeId + " to " +direction.to.placeId)
          }
        })
        map.on('mapwize:venueenter', () => {
          map.setDirectionMode()
          map.getPlace('569f8d7cb4d7200b003c32a1').then(from => {
            map.setFrom(_.set(from, 'objectClass', 'place'))
          })
          map.getPlace('5d08d8a4efe1d20012809ee5').then(to => {
            map.setTo(_.set(to, 'objectClass', 'place'))
          })
        });
      })
    }
  })
})

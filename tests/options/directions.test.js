const { mwzTest, initBrowser, killBrowser } = require('../core/utils')

const testSuites = 'Direction option'
describe(testSuites, () => {
  beforeAll(() => {
    return initBrowser(testSuites)
  })
  
  afterAll(() => {
    return killBrowser(testSuites)
  })
  
  mwzTest(testSuites, 'With correct direction object', (page) => {
    return () => {
      MapwizeUI.map({
        apiKey: 'ContexeoDevAppAPIKEY',
        centerOnVenue: '56b20714c3fa800b00d8f0b5',
        direction: {
          from: '569f8d7cb4d7200b003c32a1',
          to: '5d08d8a4efe1d20012809ee5'
        },
      }).then((map) => {
        map.on('mapwize:directionstart', direction => {
          if (direction.from.placeId === '569f8d7cb4d7200b003c32a1' && direction.to.placeId === '5d08d8a4efe1d20012809ee5') {
            window.callbackTest(null)
          } else {
            window.callbackTest("Bad direction found. Expected from 569f8d7cb4d7200b003c32a1 to 5d08d8a4efe1d20012809ee5. Found from " + direction.from.placeId + " to " +direction.to.placeId)
          }
        })
      }).catch(window.callbackTest)
    }
  })
  
})

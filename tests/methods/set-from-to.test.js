const { mwzTest, initBrowser, killBrowser } = require('../core/utils')

// const testSuites = 'Set direction from and to'
// describe(testSuites, () => {
//   beforeAll(() => {
//     return initBrowser(testSuites)
//   })
  
//   afterAll(() => {
//     return killBrowser(testSuites)
//   })

//   mwzTest(testSuites, 'Will failed outside venue', (page) => {
//     return () => {
//       MapwizeUI.map({
//         apiKey: 'ContexeoDevAppAPIKEY',
//         centerOnVenue: '56b20714c3fa800b00d8f0b5',
//       }).then((map) => {
//         map.on('mapwize:venueenter', () => {
//           map.on('mapwize:directionstart', direction => {
//             if (direction.from.placeId === '569f8d7cb4d7200b003c32a1' && direction.to.placeId === '5d08d8a4efe1d20012809ee5') {
//               window.callbackTest(null)
//             } else {
//               window.callbackTest("Bad direction found. Expected from 569f8d7cb4d7200b003c32a1 to 5d08d8a4efe1d20012809ee5. Found from " + direction.from.placeId + " to " +direction.to.placeId)
//             }
//           })

//           map.setDirectionMode()
//           // need to use map.getPlace to pass it in setFrom and setTo
//           map.setFrom('569f8d7cb4d7200b003c32a1')
//           map.setTo('5d08d8a4efe1d20012809ee5')
//         });
//       }).catch(window.callbackTest)
//     }
//   })
  
// })

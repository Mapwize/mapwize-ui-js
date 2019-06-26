const { mwzTest, initBrowser, killBrowser } = require('../core/utils')

const testSuites = 'Hide menu'
describe(testSuites, () => {
  beforeAll(() => {
    return initBrowser(testSuites)
  })

  afterAll(() => {
    return killBrowser(testSuites)
  })

  mwzTest(testSuites, 'hideMenu: true', (page) => {
    return () => {
      MapwizeUI.map({
        apiKey: 'YOUR_MAPWIZE_API_KEY_HERE',
        hideMenu: true
      }).then((map) => {
        if ($('#menuBar').hasClass('d-none') == true) {
          window.callbackTest(null)
        } else {
          window.callbackTest("#menuBar don't have d-none css class")
        }
      }).catch(window.callbackTest)
    }
  })

})

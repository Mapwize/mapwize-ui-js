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
        apiKey: '89a2695d7485fda885c96b405dcc8a25',
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

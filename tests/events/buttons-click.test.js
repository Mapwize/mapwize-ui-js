const { mwzTest, initBrowser, killBrowser } = require('../core/utils')

const testSuites = 'Click on buttons'
describe(testSuites, () => {
  beforeAll(() => {
    return initBrowser(testSuites)
  })

  afterAll(() => {
    return killBrowser(testSuites)
  })

  mwzTest(testSuites, 'Menu button', (page) => {
    return () => {
      MapwizeUI.map({
        apiKey: '89a2695d7485fda885c96b405dcc8a25',
        onMenuButtonClick: (e) => {
          window.callbackTest(null)
        }
      }).then((map) => {
        $('#mwz-menuButton').click()
      }).catch(window.callbackTest)
    }
  })

  mwzTest(testSuites, 'Information button', (page) => {
    return () => {
      MapwizeUI.map({
        apiKey: '89a2695d7485fda885c96b405dcc8a25',
        centerOnPlace: "57036cd6b247f50b00a0746e",
        onInformationButtonClick: (e) => {
          window.callbackTest(null)
        }
      }).then((map) => {
        $('#mwz-footerSelection').click()
      }).catch(window.callbackTest)
    }
  })

})

const { mwzDescribe, mwzTest } = require('../core/utils')

const testSuites = 'Click on buttons'
mwzDescribe(testSuites, () => {
  mwzTest('Menu button', callbackTest => {
    MapwizeUI.map({
      apiKey: APIKEY,
      onMenuButtonClick: (e) => {
        callbackTest(null)
      }
    }).then((map) => {
      $('#mwz-menuButton').click()
    }).catch(e => callbackTest(e))
  })
  
  mwzTest('Information button', callbackTest => {
    MapwizeUI.map({
      apiKey: APIKEY,
      centerOnPlace: MAPWIZEPLACEID,
      onInformationButtonClick: (e) => {
        callbackTest(null)
      }
    }).then((map) => {
      $('#mwz-footerSelection').click()
    }).catch(e => callbackTest(e))
  })
})

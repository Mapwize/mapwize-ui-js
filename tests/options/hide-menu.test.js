const { mwzDescribe, mwzTest } = require('../core/utils')

const testSuites = 'Hide menu'
mwzDescribe(testSuites, () => {
  mwzTest('hideMenu: true', (callbackTest) => {
    MapwizeUI.map({
      apiKey: APIKEY,
      hideMenu: true
    }).then((map) => {
      if ($('#menuBar').hasClass('d-none') == true) {
        callbackTest(null)
      } else {
        callbackTest('#menuBar don\'t have d-none css class')
      }
    }).catch(callbackTest)
  })
})

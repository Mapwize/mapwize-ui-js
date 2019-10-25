const { mwzDescribe, mwzTest } = require('../core/utils')

const testSuites = 'Click on buttons'
mwzDescribe(testSuites, function () {
  mwzTest('Menu button', function (callbackTest) {
    MapwizeUI.map({
      apiKey: APIKEY,
      onMenuButtonClick: function (e) {
        callbackTest(null);
      }
    }).then(function (map) {
      $('#mwz-menuButton').click();
    }).catch(function (e) { callbackTest(e); });
  })
  
  mwzTest('Information button', function (callbackTest) {
    MapwizeUI.map({
      apiKey: APIKEY,
      centerOnPlace: MAPWIZEPLACEID,
      onInformationButtonClick: function (e) {
        callbackTest(null);
      }
    }).then(function (map) {
      $('#mwz-footerSelection').click();
    }).catch(function (e) { callbackTest(e); });
  })
})

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
      $('#mwz-menu-button').click();
    }).catch(function (e) { callbackTest(e); });
  })

  mwzTest('Information button', function (callbackTest) {
    MapwizeUI.map({
      apiKey: APIKEY,
      centerOnPlaceId: MAPWIZEPLACEID,
      shouldShowInformationButtonFor: function () { return true; },
      onInformationButtonClick: function (e) {
        callbackTest(null);
      },
      onSelectedChange: function () {
        $('#mwz-footer-informations-button').click()
      }
    }).catch(function (e) { callbackTest(e); });
  })
})

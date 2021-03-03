const { mwzDescribe, mwzTest } = require('../core/utils')
const testSuites = 'shouldShowInformationButtonFor return: '

mwzDescribe(testSuites, function () {
  mwzTest('false', function (callbackTest) {
    MapwizeUI.map({
      apiKey: APIKEY,
      shouldShowInformationButtonFor: function () { return false; },
      onSelectedChange: function () {
        if ($('#mapwize').find('.mwz-informations-button').length) {
          callbackTest('Information button should not be visible');
        } else {
          callbackTest(null);
        }
      }
    }).then(function (map) {
      return map.setSelected(MAPWIZEPLACEID);
    }).catch(function (e) { callbackTest(e.toString()); });
  })

  mwzTest('true', function (callbackTest) {
    MapwizeUI.map({
      apiKey: APIKEY,
      shouldShowInformationButtonFor: function () { return true; },
      onSelectedChange: function () {
        if (!$('#mapwize').find('.mwz-informations-button').length) {
          callbackTest('Information button should be visible');
        } else {
          callbackTest(null);
        }
      }
    }).then(function (map) {
      return map.setSelected(MAPWIZEPLACEID)
    }).catch(function (e) { callbackTest(e.toString()); });
  })
})

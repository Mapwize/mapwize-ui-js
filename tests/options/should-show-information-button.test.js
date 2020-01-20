const { mwzDescribe, mwzTest } = require('../core/utils')
const testSuites = 'shouldShowInformationButtonFor return: '

mwzDescribe(testSuites, function () {
  mwzTest('false', function (callbackTest) {
    MapwizeUI.map({
      apiKey: APIKEY,
      shouldShowInformationButtonFor: function () { return false; }
    }).then(function (map) {
      return map.setSelected(MAPWIZEPLACEID).then(function () {
        setTimeout(function () {
          if ($('#mapwize').find('#mwz-footer-informations-button').is(':visible')) {
            callbackTest('Information button should not be visible');
          } else {
            callbackTest(null);
          }
        }, 2000);
      })
    }).catch(function (e) { callbackTest(e); });
  })

  mwzTest('true', function (callbackTest) {
    MapwizeUI.map({
      apiKey: APIKEY,
      shouldShowInformationButtonFor: function () { return true; }
    }).then(function (map) {
      return map.setSelected(MAPWIZEPLACEID).then(function () {
        setTimeout(function () {
          if (!$('#mapwize').find('#mwz-footer-informations-button').is(':visible')) {
            callbackTest('Information button should be visible');
          } else {
            callbackTest(null);
          }
        }, 2000);
      })
    }).catch(function (e) { callbackTest(e); });
  })

  mwzTest('html', function (callbackTest) {
    var informationButtonContent = '<span class="mwz-icon-information">i</span> mapwize';
    MapwizeUI.map({
      apiKey: APIKEY,
      shouldShowInformationButtonFor: function () { return informationButtonContent; }
    }).then(function (map) {
      return map.setSelected(MAPWIZEPLACEID).then(function () {
        setTimeout(function () {
          var button = $('#mapwize').find('#mwz-footer-informations-button');
          if (!button.is(':visible')) {
            callbackTest('Information button should not be visible');
          } else if (button.html() !== informationButtonContent) {
            callbackTest('Information button contain bad html: ' + button.html());
          } else {
            callbackTest(null);
          }
        }, 2000);
      })
    }).catch(function (e) { callbackTest(e); });
  })
})

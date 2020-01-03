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
      onInformationButtonClick: function (e) {
        callbackTest(null);
      }
    }).then(function (map) {
      map.on('mapwize:venueenter', function () {
        setTimeout(function () {
          map.setSelected(MAPWIZEPLACEID).then(function () {
            $('#mwz-footer-informations-button').click()
          })
        }, 1000);
      })
    }).catch(function (e) { callbackTest(e); });
  })
})

const { mwzDescribe, mwzTest } = require('../core/utils')

const testSuites = 'On element will be selected'
mwzDescribe(testSuites, function () {
  mwzTest('with center on element true', function (callbackTest) {
    var map = null;
    MapwizeUI.map({
      apiKey: APIKEY,
      centerOnPlaceId: MAPWIZEPLACEID,
      onElementWillBeSelected: function (e) {
        return { pitch: 53, bearing: 50, zoom: 20, centerOnElement: true }
      },
      onSelectedChange: function (selectedObject, analytics) {
        setTimeout(function () {
          if (map.getBearing() == 50 && map.getPitch() == 53 && map.getZoom() == 20) {
            callbackTest(null)
          } else {
            callbackTest('Zoom expected: 20, retrives: ' + map.getZoom() + '\nBearing expected: 50, retrives: ' + map.getBearing() + '\nPitch expected: 53, retrives: ' + map.getPitch())
          }
        }, 10000);
      }
    }).then(function (mapInstance) {
      map = mapInstance
    }).catch(function (e) { callbackTest(e); });
  })

  mwzTest('with center on element false', function (callbackTest) {
    var map = null;
    MapwizeUI.map({
      apiKey: APIKEY,
      centerOnPlaceId: MAPWIZEPLACEID,
      onElementWillBeSelected: function (e) {
        return { pitch: 54, bearing: 50, zoom: 12, centerOnElement: false }
      },
      onSelectedChange: function (selectedObject, analytics) {
        if (map.getBearing() == 0 && map.getPitch() == 0 && map.getZoom() == 19) {
          callbackTest(null)
        } else {
          callbackTest('Zoom expected: 19, retrives: ' + map.getZoom() + '\nBearing expected: 0, retrives: ' + map.getBearing() + '\nPitch expected: 0, retrives: ' + map.getPitch())
        }
      }
    }).then(function (mapInstance) {
      map = mapInstance
    }).catch(function (e) { callbackTest(e); });
  })
})

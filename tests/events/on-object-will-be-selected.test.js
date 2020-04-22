const { mwzDescribe, mwzTest } = require('../core/utils')

const testSuites = 'On object will be selected'
mwzDescribe(testSuites, function () {
  mwzTest('with center on element true', function (callbackTest) {
    var map = null;
    MapwizeUI.map({
      apiKey: APIKEY,
      centerOnPlaceId: MAPWIZEPLACEID,
      onObjectWillBeSelected: function (options, mwzObject) {
        // return { pitch: 53, bearing: 50, zoom: 20, centerOnElement: true } // NEVER DO THAT, IT WILL BREAK NEXT RELEASES
        options.pitch = 53
        options.bearing = 50
        options.zoom = 20
        options.centerOnElement = true;
        return options
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
      onObjectWillBeSelected: function (options, mwzObject) {
        // return { pitch: 54, bearing: 50, zoom: 12, centerOnElement: false } // NEVER DO THAT, IT WILL BREAK NEXT RELEASES
        options.centerOnElement = false
        return options
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

  mwzTest('with custom template', function (callbackTest) {
    var map = null;
    MapwizeUI.map({
      apiKey: APIKEY,
      centerOnPlaceId: MAPWIZEPLACEID,
      onObjectWillBeSelected: function (options, mwzObject) {
        options.template = mwzObject.name
        return options
      },
      onSelectedChange: function (selectedObject, analytics) {
        if ($('#mwz-footer-selection').html() == selectedObject.name) {
          callbackTest(null)
        } else {
          callbackTest('Custom template expected: ' + selectedObject.name + ', retrives: ' + $('#mwz-footer-selection').html())
        }
      }
    }).then(function (mapInstance) {
      map = mapInstance
    }).catch(function (e) { callbackTest(e); });
  })
})

const { mwzDescribe, mwzTest } = require('../core/utils')

const testSuites = 'On object will be selected'
mwzDescribe(testSuites, function () {
  // mwzTest('with center on element true', function (callbackTest) {
  //   var map = null;
  //   MapwizeUI.map({
  //     apiKey: APIKEY,
  //     centerOnPlaceId: MAPWIZEPLACEID,
  //     shouldMoveToSelectedObject: function (mwzObject, options) {
  //       options.zoom = 20
  //       return options;
  //     },
  //     onSelectedChange: function (selectedObject, analytics) {
  //       console.log('onSelectedChange');
  //       setTimeout(function () {
  //         if (map.getZoom() == 20) {
  //           callbackTest(null)
  //         } else {
  //           callbackTest('Zoom expected: 20, retrives: ' + map.getZoom())
  //         }
  //       }, 5000);
  //     }
  //   }).then(function (mapInstance) {
  //     map = mapInstance
  //   }).catch(function (e) { callbackTest(e.toString()); });
  // })
  // mwzTest('with center on element false', function (callbackTest) {
  //   var map = null
  //   MapwizeUI.map({
  //     apiKey: APIKEY,
  //     centerOnPlaceId: MAPWIZEPLACEID,
  //     onObjectWillBeSelected: function (options, mwzObject) {
  //       // return { pitch: 54, bearing: 50, zoom: 12, centerOnElement: false } // NEVER DO THAT, IT WILL BREAK NEXT RELEASES
  //       options.centerOnElement = false
  //       return options
  //     },
  //     onSelectedChange: function (selectedObject, analytics) {
  //       console.log(selectedObject)
  //       if (map.getBearing() == 0 && map.getPitch() == 1 && map.getZoom() == 19) {
  //         callbackTest(null)
  //       } else {
  //         callbackTest(
  //           'Zoom expected: 19, retrives: ' + map.getZoom() + '\nBearing expected: 0, retrives: ' + map.getBearing() + '\nPitch expected: 0, retrives: ' + map.getPitch()
  //         )
  //       }
  //     },
  //   })
  //     .then(function (mapInstance) {
  //       map = mapInstance
  //     })
  //     .catch(function (e) {
  //       callbackTest(e.toString())
  //     })
  // })
  // mwzTest('with custom template', function (callbackTest) {
  //   var map = null;
  //   MapwizeUI.map({
  //     apiKey: APIKEY,
  //     centerOnPlaceId: MAPWIZEPLACEID,
  //     onObjectWillBeSelected: function (options, mwzObject) {
  //       options.template = '<div>' + mwzObject.name + '</div>'
  //       return options
  //     },
  //     onSelectedChange: function (selectedObject, analytics) {
  //       if ($('#mwz-footer-selection').text() == selectedObject.name) {
  //         callbackTest(null)
  //       } else {
  //         callbackTest('Custom template expected: ' + selectedObject.name + ', retrives: ' + $('#mwz-footer-selection').text())
  //       }
  //     }
  //   }).then(function (mapInstance) {
  //     map = mapInstance
  //   }).catch(function (e) { callbackTest(e.toString()); });
  // })
})

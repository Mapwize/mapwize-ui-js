const { mwzDescribe, mwzTest } = require('../core/utils')

const testSuites = 'On place selected change'
mwzDescribe(testSuites, function () {
  mwzTest('with centerOnPlaceId option', function (callbackTest) {
    MapwizeUI.map({
      apiKey: APIKEY,
      centerOnPlaceId: MAPWIZEPLACEID,
      onSelectionChange: function (e) {
        if (!e) {
          callbackTest('onSelectionChange expect place id: ' + MAPWIZEPLACEID + '. But found: ' + e)
        } else if (e._id === MAPWIZEPLACEID) {
          callbackTest(null);
        } else {
          callbackTest('onSelectionChange expect place id: ' + MAPWIZEPLACEID + '. But found: ' + e._id)
        }
      }
    }).catch(function (e) { callbackTest(e); });
  })

  mwzTest('with setSelected (id) method', function (callbackTest) {
    MapwizeUI.map({
      apiKey: APIKEY,
      onSelectionChange: function (e) {
        if (!e) {
          callbackTest('onSelectionChange expect place id: ' + MAPWIZEPLACEID + '. But found: ' + e)
        } else if (e._id === MAPWIZEPLACEID) {
          callbackTest(null);
        } else {
          callbackTest('onSelectionChange expect place id: ' + MAPWIZEPLACEID + '. But found: ' + e._id)
        }
      }
    }).then(function (map) {
      map.setSelected(MAPWIZEPLACEID)
    }).catch(function (e) { callbackTest(e); });
  })

  mwzTest('with setSelected mapwize then null', function (callbackTest) {
    var map = null;
    MapwizeUI.map({
      apiKey: APIKEY,
      onSelectionChange: function (e) {
        if (!e) {
          callbackTest(null)
        } else if (e._id === MAPWIZEPLACEID) {
          map.setSelected(null)
        } else {
          callbackTest('onSelectionChange expect place id: ' + MAPWIZEPLACEID + '. But found: ' + e._id)
        }
      }
    }).then(function (mapInstance) {
      map = mapInstance;
      map.setSelected(MAPWIZEPLACEID)
    }).catch(function (e) { callbackTest(e); });
  })
})

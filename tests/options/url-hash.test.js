const { mwzDescribe, mwzTest } = require('../core/utils')

const testSuites = 'urlHash option'
mwzDescribe(testSuites, function () {
  mwzTest('Coordinates', function (callbackTest) {
    var coordinates = { longitude: '42.70151', latitude: '4.81363' };
    MapwizeUI.map({
      apiKey: APIKEY,
      urlHash: '/c/' + coordinates.latitude + '/' + coordinates.longitude
    }).then(function (map) {
      callbackTest({ fnName: 'isSameCoordinates', args: [coordinates, map.getCenter()] })
    }).catch(function (e) { callbackTest(e) })
  })

  mwzTest('Venue', function (callbackTest) {
    var venueAlias = 'euratechnologies';
    MapwizeUI.map({
      apiKey: APIKEY,
      urlHash: '/v/' + venueAlias
    }).then(function (map) {
      map.on('mapwize:venueenter', function (e) {
        if (e.venue.alias === venueAlias) {
          callbackTest(null);
        } else {
          callbackTest('Expect enter in venue "' + venueAlias + '", but found: ' + e.venue.alias);
        }
      });
    }).catch(function (e) { callbackTest(e) })
  })

  mwzTest('Place', function (callbackTest) {
    var venueAlias = 'euratechnologies';
    var placeAlias = 'accueil';
    MapwizeUI.map({
      apiKey: APIKEY,
      urlHash: '/p/' + venueAlias + '/' + placeAlias,
      onSelectedChange: function (selected) {
        if (selected.alias = placeAlias) {
          callbackTest(null);
        } else {
          callbackTest('Expect place "' + placeAlias + '" selected, but found: ' + selected.alias);
        }
      }
    }).catch(function (e) { callbackTest(e) })
  })

  mwzTest('Direction', function (callbackTest) {
    MapwizeUI.map({
      apiKey: APIKEY,
      urlHash: '/f/p/euratechnologies/accueil/t/p/euratechnologies/toilet_accueil?modeId=5da6bec9aefa100010c7df68&u=default_universe&l=fr&z=19'
    }).then(function (map) {
      map.on('mapwize:directionstart', function () {
        callbackTest(null);
      })
    }).catch(function (e) { callbackTest(e) })
  })

  mwzTest('Bad url', function (callbackTest) {
    MapwizeUI.map({
      apiKey: APIKEY,
      urlHash: '/v/NOT_EXIST'
    }).then(function (map) {
      callbackTest('Must fail due to bad url')
    }).catch(function (e) { callbackTest(null) })
  })
})

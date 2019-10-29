const { mwzDescribe, mwzTest } = require('../core/utils')
const testSuites = 'Set language'

mwzDescribe(testSuites, function () {
  mwzTest('language: fr', function (callbackTest) {
    MapwizeUI.map({
      apiKey: APIKEY,
      locale: 'fr',
      centerOnVenueId: EURATECHNOLOGIESVENUEID
    }).then(function (map) {
      map.on('mapwize:venueenter', function (venue) {
        if ($('#mwz-mapwizeSearch').attr('placeholder').includes('Rechercher dans')) {
          callbackTest(null);
        } else {
          callbackTest('#mwz-mapwizeSearch placeholder expected: "Rechercher dans EuraTechnologies" received: ' + $('#mwz-mapwizeSearch').attr('placeholder'));
        }
      })
    }).catch(function (e) { callbackTest(e); });
  })
  
  mwzTest('language: en', function(callbackTest) {
    MapwizeUI.map({
      apiKey: APIKEY,
      locale: 'en',
      centerOnVenueId: EURATECHNOLOGIESVENUEID
    }).then(function (map) {
      map.on('mapwize:venueenter', function (venue) {
        if ($('#mwz-mapwizeSearch').attr('placeholder').includes('Search in')) {
          callbackTest(null);
        } else {
          callbackTest('#mwz-mapwizeSearch placeholder expected: "Search in EuraTechnologies" received: ' + $('#mwz-mapwizeSearch').attr('placeholder'));
        }
      });
    }).catch(function (e) { callbackTest(e); });
  })
  
  mwzTest('language: null', function(callbackTest) {
    MapwizeUI.map({
      apiKey: APIKEY,
      centerOnVenueId: EURATECHNOLOGIESVENUEID
    }).then(function (map) {
      map.on('mapwize:venueenter', function (venue) {
        if ($('#mwz-mapwizeSearch').attr('placeholder').includes('Search in')) {
          callbackTest(null);
        } else {
          callbackTest('#mwz-mapwizeSearch placeholder expected: "Search in EuraTechnologies" received: ' + $('#mwz-mapwizeSearch').attr('placeholder'));
        }
      })
    }).catch(function (e) { callbackTest(e); });
  })
})

const { mwzDescribe, mwzTest } = require('../core/utils')
const testSuites = 'Set language to: '

mwzDescribe(testSuites, function () {
  mwzTest('fr', function (callbackTest) {
    MapwizeUI.map({
      apiKey: APIKEY,
      locale: 'fr',
      centerOnVenueId: EURATECHNOLOGIESVENUEID
    }).then(function (map) {
      if (map.getLocale().code === 'fr') {
        callbackTest(null);
      } else {
        callbackTest('Expect locale to be "fr", but found: ' + map.getLocale().code);
      }
    }).catch(function (e) { callbackTest(e.toString()); });
  })
  
  mwzTest('en', function(callbackTest) {
    MapwizeUI.map({
      apiKey: APIKEY,
      locale: 'en',
      centerOnVenueId: EURATECHNOLOGIESVENUEID
    }).then(function (map) {
      if (map.getLocale().code === 'en') {
        callbackTest(null);
      } else {
        callbackTest('Expect locale to be "en", but found: ' + map.getLocale().code);
      }
    }).catch(function (e) { callbackTest(e.toString()); });
  })
  
  mwzTest('null', function(callbackTest) {
    MapwizeUI.map({
      apiKey: APIKEY,
      centerOnVenueId: EURATECHNOLOGIESVENUEID
    }).then(function (map) {
      map.on('mapwize:venueenter', function (venue) {
        if (map.getLocale().code === 'en') {
          callbackTest(null);
        } else {
          callbackTest('Expect locale to be "en", but found: ' + map.getLocale().code);
        }
      })
    }).catch(function (e) { callbackTest(e.toString()); });
  })
})

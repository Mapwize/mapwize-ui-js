var _ = require('lodash')

function mwzDescribe (testSuites, fn) {
  describe(testSuites, function () {
    fn()
  })
}

function mwzTest(name, evaluateFn) {
  it(name, function () {
    browser.url('http://localhost:8888/tests/core/index.html')
    browser.waitUntil(function () {
      return browser.execute(function () {
        return document.readyState === 'complete' && MapwizeUI;
      })
    })
    browser.setTimeout({
      'script': 60000
    });
    var error = browser.executeAsync(evaluateFn)
    if (error != null) {
      if (_.isString(error)) {
        error = new Error(error)
      }
      throw error;
    }
  });
}

function latitude (data) {
  if (isFinite(data.lat)) {
    return data.lat
  } else if (isFinite(data.latitude)) {
    return data.latitude
  }
  return false
}
function longitude (data) {
  if (isFinite(data.lon)) {
    return data.lon
  } else if (isFinite(data.lng)) {
    return data.lng
  } else if (isFinite(data.longitude)) {
    return data.longitude
  }
  return false
}

function roundCoordinates (coords) {
  return {
    latitude: Math.round(latitude(coords) * 100000000) / 100000000,
    longitude: Math.round(longitude(coords) * 100000000) / 100000000
  }
}

function isSameCoordinates (expected, found) {
  var isSameLatitude = true
  var isSameLongitude = true
  
  expected = roundCoordinates(expected)
  found = roundCoordinates(found)
  
  if (latitude(found) !== latitude(expected)) {
    isSameLatitude = false
  }
  if (longitude(found) !== longitude(expected)) {
    isSameLongitude = false
  }
  
  if (isSameLongitude === false && isSameLatitude === false) {
    return 'Latitude expected: ' + latitude(expected) + ' found: ' + latitude(found) + ' and longitude expected: ' + longitude(expected) + ' found: ' + longitude(found)
  } else if (isSameLongitude === false) {
    return 'Longitude expected: ' + longitude(expected) + ' found: ' + longitude(found)
  } else if (isSameLatitude === false) {
    return 'Latitude expected: ' + latitude(expected) + ' found: ' + latitude(found)
  }
  return null
}

function isSameFloor (expected, found) {
  if (expected !== found) {
    return 'Floor expected: ' + expected + ' found: ' + found
  }
  return null
}

function isSamePosition (expectedCoordinates, foundCoordinates, expectedFloor, foundFloor) {
  var coordinatesError = isSameCoordinates(expectedCoordinates, foundCoordinates)
  var floorError = isSameFloor(expectedFloor, foundFloor)

  if (coordinatesError && floorError) {
    return coordinatesError + ' and ' + floorError
  } else if (coordinatesError) {
    return coordinatesError
  } else if (floorError) {
    return floorError
  }
  return null
}

module.exports = {
  mwzTest: mwzTest,
  mwzDescribe: mwzDescribe
}

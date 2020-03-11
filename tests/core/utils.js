var _ = require('lodash')

function mwzDescribe (testSuites, fn) {
  describe(testSuites, function () {
    fn()
  })
}

function mwzTest (name, evaluateFn) {
  it(name, function () {
    this.retries(2)
    browser.url('http://localhost:8888/tests/core/index.html')
    browser.waitUntil(function () {
      return browser.execute(function () {
        return document.readyState === 'complete' && MapwizeUI;
      })
    }, 20000, 'Unable to load page after 20 seconds')
    browser.setTimeout({
      'script': 60000
    });

    var testResult = browser.executeAsync(evaluateFn)

    if (testResult) {
      if (_.isObject(testResult)) {
        testResult = tools[testResult.fnName].apply(null, testResult.args)
        if (testResult) {
          throw new Error(testResult)
        }
      } else {
        throw new Error(testResult)
      }
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


var tools = {
  isSamePosition: isSamePosition,
  isSameFloor: isSameFloor,
  isSameCoordinates: isSameCoordinates
}

module.exports = {
  mwzTest: mwzTest,
  mwzDescribe: mwzDescribe
}

const puppeteer = require('puppeteer')

const browsers = {}

function initBrowser (testSuites) {
  browsers[testSuites] = puppeteer.launch({
    // devtools: true
  })
  return browsers[testSuites]
}
function killBrowser (testSuites) {
  return browsers[testSuites].then(browser => browser.close()).catch(e => {})
}

function mwzDescribe (testSuites, fn) {
  describe(testSuites, () => {
    beforeAll(() => {
      return initBrowser(testSuites)
    })
    
    afterAll(() => {
      return killBrowser(testSuites)
    })
    
    fn()
  })
}

function mwzTest (testSuites, name, evaluateFn) {
  test(name, () => {
    return new Promise((resolve, reject) => {
      function testResult(error, page) {
        page.close().catch(e => {})
        if (error) {
          return reject(error)
        }
        return resolve()
      }
      
      browsers[testSuites].then(browser => browser.newPage()).then(page => {
        // page.on('console', console.log)
        return page.goto('http://localhost:8888/tests/core/index.test.html').then(() => page)
      }).then(page => {
        page.exposeFunction('callbackTest', error => {
          return testResult(error, page)
        }).catch(e => {})
        return page
      }).then(page => {
        page.exposeFunction('isSamePosition', (expectedCoordinates, foundCoordinates, expectedFloor, foundFloor) => {
          return testResult(isSamePosition(expectedCoordinates, foundCoordinates, expectedFloor, foundFloor), page)
        }).catch(e => {})
        return page
      }).then(page => {
        page.exposeFunction('isSameCoordinates', (expectedCoordinates, foundCoordinates) => {
          return testResult(isSameCoordinates(expectedCoordinates, foundCoordinates), page)
        }).catch(e => {})
        return page
      }).then(page => {
        page.evaluate(evaluateFn(page)).catch(error => {
          page.close().catch(e => {})
          return reject(error)
        })
        return page
      }).catch(e => {
        return reject(e)
      })
    })
  }, 50000)
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
  mwzDescribe: mwzDescribe,

  initBrowser: initBrowser,
  killBrowser: killBrowser
}

const puppeteer = require('puppeteer')

const browsers = {}

function initBrowser (testSuites) {
  browsers[testSuites] = puppeteer.launch({
    headless: false,
    args: ['--windows-size=1920,1080']
  })
  return browsers[testSuites]
}
function killBrowser (testSuites) {
  return browsers[testSuites].then(browser => browser.close()).catch(e => {})
}

function mwzTest (testSuites, name, evaluateFn) {
  test(name, () => {
    return new Promise((resolve, reject) => {
      browsers[testSuites].then(browser => browser.newPage()).then(page => {
        return page.goto('localhost:8888/tests/core/index.test.html').then(() => page)
      }).then(page => {
        page.exposeFunction('callbackTest', error => {
          page.close().catch(e => {})
          if (error) {
            return reject(error)
          }
          return resolve()
        }).catch(e => {})
        return page
      }).then(page => {
        page.evaluate(evaluateFn(page)).catch(error => {
          page.close().catch(e => {})
          return reject(error)
        })
        return page
      }).catch(e => {})
    })
  }, 50000)
}

module.exports = {
  mwzTest: mwzTest,
  initBrowser: initBrowser,
  killBrowser: killBrowser
}

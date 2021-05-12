const { mwzDescribe, mwzTest } = require('../core/utils')

const testSuites = 'Apikey'
mwzDescribe(testSuites, function () {
  mwzTest(
    'With correct apikey',
    function (callbackTest) {
      MapwizeUI.map({
        apiKey: APIKEY,
      })
        .then(function (map) {
          callbackTest(null)
        })
        .catch(function (e) {
          callbackTest(e.toString())
        })
    },
    () => {
      const response = $('#mwz-shadow-container')
      if (response.error) {
        throw new Error("Don't find mwz-ui-container css class in #mapwize container")
      }
    }
  )
})

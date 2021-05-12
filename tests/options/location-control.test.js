const { mwzDescribe, mwzTest } = require('../core/utils')

const testSuites = 'Location control'
mwzDescribe(testSuites, function () {
  mwzTest(
    'show location control button ',
    function (callbackTest) {
      MapwizeUI.map({
        apiKey: APIKEY,
        locationControl: true,
      })
        .then(function (map) {
          callbackTest(null)
        })
        .catch(function (e) {
          callbackTest(e.toString())
        })
    },
    () => {
      const response = $('#mwz-shadow-container').shadow$('.mwz-follow-user-button')
      if (response.error) {
        throw new Error('.mwz-follow-user-button should exist when locationControl is true')
      }
    }
  )

  mwzTest(
    'location control button hidden by default ',
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
      const response = $('#mwz-shadow-container').shadow$('.mwz-follow-user-button')
      if (!response.error) {
        throw new Error('.mwz-follow-user-button should not exist when locationControl is false')
      }
    }
  )
})

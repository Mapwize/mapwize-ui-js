const { mwzDescribe, mwzTest } = require('../core/utils')

const testSuites = 'Menu button'
mwzDescribe(testSuites, function () {
  mwzTest(
    'show menu button',
    function (callbackTest) {
      MapwizeUI.map({
        apiKey: APIKEY,
        onMenuButtonClick: function (e) {},
      })
        .then(function (map) {
          callbackTest(null)
        })
        .catch(function (e) {
          callbackTest(e.toString())
        })
    },
    () => {
      const response = $('#mwz-shadow-container').shadow$('.mwz-menu-button')
      if (response.error) {
        throw new Error('.mwz-menu-button should exist when onMenuButtonClick function is set')
      }
    }
  )

  mwzTest(
    'menu button hidden by default',
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
      const response = $('#mwz-shadow-container').shadow$('.mwz-menu-button')
      if (!response.error) {
        throw new Error('.mwz-menu-button should not exist when onMenuButtonClick function is not set')
      }
    }
  )
})

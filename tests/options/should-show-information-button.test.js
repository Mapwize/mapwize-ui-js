const { mwzDescribe, mwzTest } = require('../core/utils')
const testSuites = 'shouldShowInformationButtonFor return: '

mwzDescribe(testSuites, function () {
  mwzTest(
    'false',
    function (callbackTest) {
      MapwizeUI.map({
        apiKey: APIKEY,
        shouldShowInformationButtonFor: function () {
          return false
        },
        onSelectedChange: function () {
          callbackTest(null)
        },
      })
        .then(function (map) {
          return map.setSelected(MAPWIZEPLACEID)
        })
        .catch(function (e) {
          callbackTest(e.toString())
        })
    },
    () => {
      const response = $('#mwz-shadow-container').shadow$('.mwz-informations-button')
      if (!response.error) {
        throw new Error('Information button should not be visible')
      }
    }
  )

  mwzTest(
    'true',
    function (callbackTest) {
      MapwizeUI.map({
        apiKey: APIKEY,
        shouldShowInformationButtonFor: function () {
          return true
        },
        onSelectedChange: function () {
          callbackTest(null)
        },
      })
        .then(function (map) {
          return map.setSelected(MAPWIZEPLACEID)
        })
        .catch(function (e) {
          callbackTest(e.toString())
        })
    },
    () => {
      const response = $('#mwz-shadow-container').shadow$('.mwz-informations-button')
      if (response.error) {
        throw new Error('Information button should be visible')
      }
    }
  )
})

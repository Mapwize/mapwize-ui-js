import { debounce, join } from 'lodash'

import { Api } from 'mapwize'

let lastSearchSent: string = null

const debouncedSearch = debounce((searchString: string, options: any, callback: (err: any, results: any[]) => void) => {
  lastSearchSent = searchString

  options.query = searchString

  return Promise.all([
    Promise.resolve(searchString),
    Api.search(options).then((mapwizeResults: any) => mapwizeResults.hits),
  ]).then((results: any) => {
    if (results[0] === lastSearchSent) {
      callback(null, results)
    }
  })
}, 250, { maxWait: 500 })

const search = (searchString: string, options: any) => {
  return new Promise((resolve, reject) => {
    if (searchString) {
      return debouncedSearch(searchString, options, (err: any, results: any) => {
        resolve(results)
      })
    }

    debouncedSearch.cancel()
    lastSearchSent = null

    return reject('Empty search string')
  })
}

const searchOptions = (map: any, venue?: any, focusOn?: string): any => {
  const options: any = {}
  options.venueId = venue ? venue._id : null

  if (focusOn === 'from' || focusOn === 'to') {
    options.universeId = map.getUniverse()._id
  }

  options.objectClass = options.venueId ? (focusOn === 'from' ? ['place'] : ['place', 'placeList']) : ['venue']

  if (map._options.restrictContentToVenueId) {
    options.venueId = map._options.restrictContentToVenueId
  }
  if (map._options.restrictContentToVenueIds) {
    options.venueIds = join(map._options.restrictContentToVenueIds, ',')
  }
  if (map._options.restrictContentToOrganizationId) {
    options.organizationId = map._options.restrictContentToOrganizationId
  }

  return options
}

export { search, searchOptions }

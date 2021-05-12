import { Api, apiUrl } from 'mapwize'

export interface ApiServiceOptions {
  restrictContentToOrganizationId?: string
  restrictContentToVenueId?: string
  restrictContentToVenueIds?: string[]
}

export class ApiService {
  private options: ApiServiceOptions

  constructor(options: ApiServiceOptions) {
    this.options = options
  }

  public async search(searchParams: any) {
    return Api.search(this.mergeSearchParams(searchParams, this.options))
  }

  public async getMainSearches(venueId: string) {
    return Api.getMainSearchesForVenue(venueId)
  }

  public async getMainFroms(venueId: string) {
    return Api.getMainFromsForVenue(venueId)
  }

  public async getPlace(placeId: string) {
    return Api.getPlace(placeId)
  }
  public async getPlaceDetails(placeId: string) {
    return Api.getPlaceDetails(placeId)
  }

  public async getDirection(directionParams: any) {
    return Api.getDirection(directionParams)
  }

  public async getPlacelist(placelistId: string) {
    return Api.getPlaceList(placelistId)
  }
  public async getPlacesForPlacelist(placelistId: string) {
    return Api.getPlacesInPlaceList(placelistId)
  }

  public async getUserInfo() {
    const url = Api.buildUrl(apiUrl(), '/v1/users/me')
    return Api.promiseGET(url)
  }

  mergeSearchParams(seachParams: any, options: ApiServiceOptions): any {
    const merged = {
      ...seachParams,
    }
    if (options.restrictContentToVenueId) {
      merged.venueId = options.restrictContentToVenueId
    }
    if (options.restrictContentToVenueIds) {
      merged.venueIds = options.restrictContentToVenueIds
    }
    if (options.restrictContentToOrganizationId) {
      merged.organizationId = options.restrictContentToOrganizationId
    }
    return merged
  }
}

import { DetailsViewConfig } from './bottomview/placeDetails/placeDetailsFactory'

export interface DevCallbackInterceptor {
  onDirectionQueryWillBeSent?: (query: any) => any
  onDirectionWillBeDisplayed?: (directionOptions: any, direction: any) => any
  onSelectedChange?: (mwzObject: any, analytics?: { channel: string; searchQuery?: string }) => void
  shouldShowInformationButtonFor?: (mwzObject: any) => boolean
  shouldShowReportIssueRowFor?: (mwzObject: any) => boolean
  onInformationButtonClick?: (placeDetails: any) => void
  onFollowButtonClickWithoutLocation?: () => void
  onSearchQueryWillBeSent?: (searchOptions: any, searchString: string, channel: string) => any
  onObjectWillBeDisplayedInSearch?: (template: HTMLElement, mwzObject: any) => any
  onSearchResultsWillBeDisplayed?: (results: any) => any
  shouldMoveToSelectedObject?: (mwzObject: any, options: { centerOnElement: boolean; zoom: number }) => { centerOnElement: boolean; zoom: number }
  onDetailsWillBeDisplayed?: (detailsViewConfig: DetailsViewConfig) => DetailsViewConfig
  onMenuButtonClick?: () => void
}

const defaultCallbackInterceptor = {
  onDirectionQueryWillBeSent: (query: any) => query,
  onDirectionWillBeDisplayed: (directionOptions: any, direction: any) => directionOptions,
  onObjectWillBeSelected: (selectionOptions: any, mwzObject: any) => selectionOptions,
  onSelectedChange: () => {
    return
  },
  shouldShowInformationButtonFor: (mwzObject: any) => false,
  shouldShowReportIssueRowFor: (mwzObject: any) => false,
  onInformationButtonClick: () => {
    return
  },
  onFollowButtonClickWithoutLocation: () => {
    return
  },
  onSearchQueryWillBeSent: (searchOptions: any, searchString: string, channel: string) => searchOptions,
  onSearchResultsWillBeDisplayed: (results: any) => results,
  onObjectWillBeDisplayedInSearch: (template: HTMLElement, mwzObject: any) => template,
  shouldMoveToSelectedObject: (mwzObject: any, options: { centerOnElement: boolean; zoom: number }) => options,
  onDetailsWillBeDisplayed: (detailsViewConfig: DetailsViewConfig) => detailsViewConfig,
}

export const buildCallbackInterceptor = (callbackInterceptor: DevCallbackInterceptor): DevCallbackInterceptor => {
  return {
    ...defaultCallbackInterceptor,
    ...callbackInterceptor,
  }
}

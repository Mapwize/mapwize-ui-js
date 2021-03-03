# Mapwize UI Changelog

## 3.0.0

This new major version comes with a complete rewrite of the code and brings a beautiful interface for place details where you can see photos, opening hours, booking schedule, phone, website and more. It also improves performances and stability.

**This version does not support IE11 anymore**

- Feat: new place details interface
- Upgrade mapwize gl to 4.4.0

Map options:

- Refactor: `locale` options is deprecated in favor of `preferredLanguage`
- Removed: `floorControlOptions` options was removed
- Removed: `locationControlOptions` options was removed

Instance methods:

- Refactor: `setDirectionMode` now returns `void` instead of a `Promise`
- Refactor: `setSearchMode` now returns `void` instead of a `Promise`
- Refactor: removed `centerOnElement` param from `setSelected` method
- Refactor: `getLocale` now returns a Locale object (`{ code: string, name: string }`) instead of a string
- Refactor: `getLocales` now returns a Locale array (`{ code: string, name: string }`) instead of a string array

## 2.6.3

- Fix: broken integration inside latest angular applications
- Upgrade dependencies

## 2.6.2

- Fix: add missing export of `Mapwize.isTelemetryEnabled`
- Fix: missing translations on directions component
- Improvement: Export `FloorControl`, `LocationControl` and `NavigationControl`
- Upgrade dependencies

## 2.6.1

- Fix: missing translation system in direction component

## 2.6.0

- Improve translations
- Upgrade mapwize gl to 4.3.0
- Upgrade dependencies

## 2.5.9

- Add es locale support
- Upgrade dependencies

## 2.5.8

- Upgrade mapwize gl to 4.2.10
- Upgrade dependencies

## 2.5.7

- Fix: crash due to missing Deutsch translation support

## 2.5.6

- Upgrade mapwize gl to 4.2.9
- Upgrade dependencies

## 2.5.5

- Fix: broken bootstrap build due to version change

## 2.5.4

**Bug fixed in 2.5.5**

- Fix: fix search bar padding (#183)
- Upgrade dependencies

## 2.5.3

- Fix: getMode method return mode used by current direction (#174)
- Upgrade mapwize gl to 4.2.8
- Upgrade dependencies

## 2.5.2

- Fix: click on place search result outside venue

## 2.5.1

- Fix: place selection when `centerOnPlaceId` is provided
- Fix: place selection when the selected object is in other venue
- Upgrade mapwize gl to 4.2.7

## 2.5.0

- Feat: Add interceptor to use custom template in search results as `onObjectWillBeDisplayedInSearch`. See doc in README-advanced.md file

### /!\ BREAKING CHANGES /!\

Refactor interceptors:

#### `onDirectionWillBeDisplayed`

```typescript
onDirectionWillBeDisplayed: (directionOptions: any, direction: any): any => directionOptions
```

#### `onElementWillBeSelected`

```typescript
onObjectWillBeSelected: (selectionOptions: any, mwzObject: any): any => selectionOptions
```

#### `onSearchQueryWillBeSent`

```typescript
onSearchQueryWillBeSent: (searchOptions: any, searchString: string, channel: string): any => searchOptions
```

#### `onSearchResultWillBeDisplayed`

```typescript
onSearchResultsWillBeDisplayed: (results: any): any => results
```

## 2.4.9

- Feat: option to use custom html template for element selection footer (#161)
- Fix: directions search results must be limited to current universe (#162)

## 2.4.8

- Feat: adding support for displaying layers and places only at given zoom levels (Mapwize SDK 4.2.6)
- Fix: search results in direction should be limited to current universe (#157)
- Fix: current language & current universe not displayed in selector (#153)
- Improvement: hide map controls for print (#158)

## 2.4.7

- Hotfix: upgrade Mapwize dependency to fix Mapbox crash on Windows in v1.8.0 (#155)
- Feat: implement onFollowButtonClickWithoutLocation (#150)
- Feat: only display the menu if onMenuButtonClick is a defined function, `hideMenu` option removed (#144, #151)
- Feat: hiding the locationControl by default (#146)
- Feat: adding documentation on how to add locales (#149)
- Fix: fix tests on all browsers

## 2.4.6

**Bug on Windows fixed in 2.4.7**

- Feat: adding pre-selection hook onElementWillBeSelected
- Fix: setting locale as preferredLanguage by default
- Logging version in console to simplify debugging

## 2.4.5

**Bug on Windows fixed in 2.4.7**

- Fix: arrow display in selection details (#121)
- Fix: selection and direction modules only remove their own markers (#126)
- Fix: timeout error when running Browserstack tests (#134)
- Fix: mapwize:directionstart event triggered twice (#132)
- Fix: bootstrap encapsulation to avoid css and js collision (#133)
- Refactor: Use language name instead of language abbreviations in venue language selector (#129)
- Upgrade dependencies

## 2.4.4

- Fix: Cannot read property 'top' of undefined (#122)
- Improvement: Select the to when exiting directions (#125)
- Adding onSelectedChange and documentation regarding analytics (#123)

## 2.4.3

- Improvement: Scroll floor control to display current floor (#116)
- Improvement: Custom information button (#112)
- Improvement: Support placeList ID in setSelected method (#114)
- Improvement: Reducing number of requests when selecting a placeList (#113)
- Feat: Add selected change event (#115)
- upgrade dependencies (#117)

## 2.4.2

- Fix: tooltips must be placed inside map container to avoid css collision when integrated
- Introduce scss lint in project to improve components stability

## 2.4.1

- Fix: navigation control broken due to changes in mapbox sdk

## 2.4.0

- Feat: Update selection card to display direction and information buttons (#80)
- Improve: visibility of placeLists in search (#53)
- Improve: alignment of universe and language selectors (#93)
- Improve: Display available venues when search is empty (#83)
- Fix: Prevent direction display errors from being silent (#96)
- Fix: icons on IE11 (#95)
- Fix: extension of place card with details (#97)
- Fix: floor selector height (#88)
- Fix: keyboard scrolling in search results (#94)

## 2.3.0

- Feat: Display no result message if there is no search result
- Improvement: Display back button instead of menu button in mobile mode when search results are displayed
- Improvement: reduce search input margins on mobile
- Fix: selection card alignement
- Fix: display of language and universe selector
- Fix: floor selector size changes depending on map size
- Fix: search loading bar now matches mainColor

## 2.2.3

- Add support for DE, NL and PT

## 2.2.2

- Upgrade mapwize to 4.1.2

## 2.2.1

- Upgrade dependencies
- Upgrade mapwize to 4.1.1

## 2.2.0

- Fix documentation
- Fix: remove direction when venue change
- Fix: centerOnPlaceId option
- Feat: add border on selected field in direction
- Feat: add tooltips on header (for menu and direction button)

## 2.1.0

- Upgrade mapwize js sdk to 4.1.0
- Upgrade dependencies
- Fix: Update coordinates if click on map while searching for a direction
- Feat: Add tooltips on search bar buttons
- Feat: Ability to choose search result with keyboard
- Feat: Ability to use user location for directions

## 2.0.0

- Upgrade mapwize js sdk to 4.0.1

### /!\ BREAKING CHANGES /!\

- Move: `options.centerOnVenue` to `options.centerOnVenueId` and only accept a venue id
- Move: `options.centerOnPlace` to `options.centerOnPlaceId` and only accept a place id
- Move: `options.restrictContentToVenue` to `options.restrictContentToVenueId` and only accept a venue id
- Move: `options.restrictContentToOrganization` to `options.restrictContentToOrganizationId` and only accept a organization id

userPosition --> userLocation
locale --> setLocale
unit --> setUnit

## 1.0.9

- Upgrade mapwize js sdk to 3.4.5
- Improvement: Display error message when no direction found

## 1.0.8

- Upgrade mapwize js sdk to 3.4.3

## 1.0.7

- Fix: venue footer displayed in direction mode
- Improvement documentation
- Upgrade mapwize.js to 3.4.2
- Upgrade dependencies

## 1.0.6

- Improvement: details display
- Upgrade mapwize.js to 3.4.1

## 1.0.5

- Fix: typo in subtitle in search result
- Fix: hide menu option in direction mode
- Fix: footer display error

## 1.0.4

- Upgrade mapwize.js to 3.3.2
- Feat: can click on places to fill directions from and to

## 1.0.3

- Fix: CDN link in readme

## 1.0.2

- Feat: can change buttons color
- Feat: can have long floors name
- Feat: place can have scrollable details

## 1.0.1

- Add destroy method so the UI can be cleanly removed
- Improve documentation

## 1.0.0

- First release

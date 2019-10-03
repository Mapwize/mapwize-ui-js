# Mapwize UI Changelog

## 2.0.0

- Upgrade mapwize js sdk to 4.0.0

### /!\ BREAKING CHANGES /!\

- Move: `options.centerOnVenue` to `options.mapwizeOptions.centerOnVenueId` and only accept a venue id
- Move: `options.centerOnPlace` to `options.mapwizeOptions.centerOnPlaceId` and only accept a place id
- Move: `options.restrictContentToVenue` to `options.mapwizeOptions.restrictContentToVenueId` and only accept a venue id
- Move: `options.restrictContentToOrganization` to `options.mapwizeOptions.restrictContentToOrganizationId` and only accept a organization id

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
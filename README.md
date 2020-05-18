![Travis (.org)](https://img.shields.io/travis/mapwize/mapwize-ui-js/master) ![BrowserStack](https://automate.browserstack.com/badge.svg?badge_key=bHVja3V5V3JCY05ER0MzUFRucE1GTXJKQ3MzVU8wbTkvcnRYYlVNSGdFST0tLW1ZT3JwNGY1ZEpBS21vQjFpeWpjaVE9PQ==--7ccca5e09ae56f691a608c6018343e99e2e266aa%) ![GitHub tag (latest by date)](https://img.shields.io/github/v/tag/mapwize/mapwize-ui-js) ![npm](https://img.shields.io/npm/v/mapwize-ui)

# Mapwize UI

Fully featured and ready to use Widget to add Mapwize Indoor Maps and Navigation in your Web app.

And it's open-source !

MapwizeUI version `2.5.3` uses Mapwize SDK version `4.2.8`.
For documentation about Mapwize SDK objects like Venue, Place, MapOptions... Please refer to the Mapwize SDK documentation on [docs.mapwize.io](https://docs.mapwize.io/developers/js/sdk/latest/).

## Description

The Mapwize UI widget comes with the following components:

- Mapwize SDK integration
- Floor controller
- Follow user button
- Search module
- Direction module
- Place selection
- Universes switch
- Languages switch

## Browser support

The SDK is tested against the following browsers:

- Chrome 42+
- Firefox 60+
- Safari 10.1+
- iOS Safari 10.3+
- Edge 18+
- IE 11

## Installation

### Npm

Add the following npm package to your project :

```sh
npm install mapwize-ui --save
```

### CDN

You use the CDN url directly in your HTML page

```html
<script type="text/javascript" src="https://cdn.jsdelivr.net/npm/mapwize-ui@2.5.3"></script>
```

### Compile Mapwize UI

- Clone the Github repository
- Run `npm run dist` commands in your terminal
- Copy the file `dist/mapwizeui.js` in your project
- Import `mapwizeui.js` module in your project

## Initialization

Mapwize UI can be instantiated with one of these constructors:

```typescript
MapwizeUI.map(apiKey: String)
MapwizeUI.map(options: Object)
MapwizeUI.map(container: String, options: Object)
```

The `map` method return a Promise that is resolved when the map and the UI are ready with the `mapwizeMap` instance as parameter.

```typescript
MapwizeUI.map(apiKey: String).then(function (instance) {
	mapwizeMap = instance
})
```

### Map parameters

#### `container`

The HTML element in which Mapbox GL JS will render the map, or the element's string id . The specified element must have no children. This parameter is optionnal, default point to the id: `mapwize`.
The html element need to be correctly formated and need to be sized in css.

#### `options`

In addition to all [sdk options](https://docs.mapwize.io/developers/js/sdk/latest/), the following parameters are available for map initialization:

- `apiKey` (required) key to authorize access to the Mapwize API. Find your key on [Mapwize Studio](https://studio.mapwize.io).
- `apiUrl` (optional, string, default: null) to change the server URL, if you have a dedicated Mapwize server.
- `container` (optional, string|HTMLElement, default: null) same as `container` param, default is: `mapwize`
- `shouldShowInformationButtonFor` (optional, function, default: function (selected) { return false; }) Callback defining if the information button should be displayed in the card when a place or placelist is selected. The selected place or placelist is provided as parameter. The function must return a boolean. If this is not defined, the information button is never shown by default.
- `onInformationButtonClick` (optional, function) Callback called when the user clicks on the information button in the card when a place or placelist is selected. Use `shouldShowInformationButtonFor` to define if the information button should be displayed or not.
- `onMenuButtonClick` (optional, function) callback called when the user clicked on the menu button (left button on the search bar)
- `onSelectedChange`  (optional, function) callback called when the selected element (place or placeList) changes. The function is called with 2 parameters: the selectedObject and some analytics details. selectedObject is null when nothing is selected anymore. View the analytics section for details about the analytics parameter.
- `locationControl` (optional, boolean, default: false) if the user location control should be displayed.
- `mainColor` (optional, string, default: null) the main color for the interface as hexadecimal string.
- `direction`  (optional, { from: string, to: string }, default: null) to display directions at start. Object with keys from and to containing place ids (string).
- `locale` (optional, string, default: en) the UI language as 2 letter ISO 639-1 code (also used as map default language)
- `unit` (optional, string, default: m) the ui measurement unit

#### Parameters usage
|    | Without options | Without `container` parameter | With `container` parameter | With `container` option |
|---:|:---------------:|:-----------------------------:|:--------------------------:|:-----------------------:|
|html| `<div id="mapwize"></div>` | `<div id="mapwize"></div>` | `<div id="myMap"></div>` | `<div id="myMap"></div>` |
|js  | `MapwizeUI.map(apiKey)` | `MapwizeUI.map(options)` | `MapwizeUI.map('myMap', options)` | `MapwizeUI.map({ container: 'myMap'})` |

## Methods

##### `setLocale(newLocale: string): string`

Change the ui locale if param `newLocale` is provided. Also sets the map preferred language.

Signature: `(newLocale: string): string`
Parameters:
- `newLocale`(optional, string, default: null) the new locale to use (needs to be in `map.getLocales()` array)

Return: the new locale, or the previous one if newLocale is not valid

##### `getLocales(): Array<string>`

Get the list of supported locales for the user interface

Signature: `(): Array<string>`
Parameters: there is no param
Return: the list of supported locales by the user interface

##### `setUnit(newUnit: string): string`

Change the UI measurement unit

Signature: `(newUnit: string): string`
Parameters:
- `newUnit`(optional, string, default: null) the new measurement unit to use (needs to be in `map.getUnits()` array)

Return: the new measurement unit, or the previous one if newUnit is not valid

##### `getUnits(): Array<string>`

Get the list of supported measurement units for the user interface

Signature: `(): Array<string>`
Parameters: there is no param
Return: the list of supported measurement units by the user interface

##### `setDirectionMode(): void`

Enable direction mode for the ui, this shows the two search fields for from and to

Signature: `(): void`
Parameters: there is no param
Return: there is no return value

##### `setFrom(from: any): void`

Set the from field of direction module

Signature: `(from: any): void`
Parameters:
- `from` (required, object) Need to be one of: { objectClass: 'place', mapwize place object }, { objectClass: 'placeList', mapwize placeList object }, { objectClass: 'userPosition' }, { latitude, longitude, floor, venueId }

Return: there is no return value

##### `setTo(to: any): void`

Set the to field of direction module

Signature: `(to: any): void`
Parameters:
- `to` (required, object) Need to be one of: { objectClass: 'place', mapwize place object }, { objectClass: 'placeList', mapwize placeList object }, { latitude, longitude, floor, venueId }

Return: there is no return value

##### `getDirection(): any`

Get the current direction object if any

Signature: `(): any`
Parameters: there is no param
Return: the current direction object if any

##### `destroy(): void`

Destroy the map and all its components

Signature: `(): void`
Parameters: there is no param
Return: there is no return value

## Examples

### Simplest example [(open in jsfiddle)](https://jsfiddle.net/Mapwize/8peukahd/)

```html
<style> #mapwize { width: 400px; height: 400px; } </style>
<div id="mapwize"></div>
```

```javascript
MapwizeUI.map('YOUR_MAPWIZE_API_KEY_HERE')
```

### Center on venue

To have the map centered on a venue at start up:

```html
<style> #mapwize { width: 400px; height: 400px; } </style>
<div id="mapwize"></div>
```

```javascript
var options = {
  apiKey: 'YOUR_MAPWIZE_API_KEY_HERE',
  centerOnVenueId: 'YOUR_VENUE_ID'
}
MapwizeUI.map(options).then(map => {
  console.log('Mapwize map and ui are ready to be used')
})
```

### Center on place

To have the map centered on a place with the place selected at start up: 

```html
<style> #mapwize { width: 400px; height: 400px; } </style>
<div id="mapwize"></div>
```

```javascript
var options = {
  apiKey: 'YOUR_MAPWIZE_API_KEY_HERE',
  centerOnPlaceId: 'YOUR_PLACE_ID'
}
MapwizeUI.map(options).then(map => {
  console.log('Mapwize map and ui are ready to be used')
})
```

## Demo application

The `src/index.html` file shows how to quickly add Mapwize UI to an HTML page.

The only thing you need to get started is a Mapwize api key.
You can get your key by signing up for a free account at [mapwize.io](https://www.mapwize.io).

Once you have your API key, copy it to `index.html` in the map options and run the app using

```sh
npm run start
```

Please note that if you are using this `index.html` outside of a the Webpack environment, you will need to manually import Mapwize UI by adding

```html
<script type="text/javascript" src="./dist/mapwizeui.js"></script>
```

or using the CDN as explained in the installation section.

## Analytics

Mapwize SDK and Mapwize UI do __not__ have analytics trackers built in. This means that Mapwize does not know how maps are used in your applications, which we believe is a good thing for privacy. This also means that Mapwize is not able to provide you with analytics metrics and that, if you want any, you will have to intrument your code with your own analytics tracker.

Events and callbacks from Mapwize SDK and Mapwize UI can be used to detect changes in the interface and trigger tracking events. We believe using the following events would make sense:

- `venueEnter`
- `venueExit`
- `floorChange`
- `universeChange`
- `languageChange`
- `onSelectedChange`
- `directionstart`

The `onSelectedChange` is a Mapwize UI map option, triggered when the selected place or placeList changes. The `analytics` parameter provides details about the origin of the selection. If the selection comes from the user, `analytics` is an object. The `channel` key can be 'click' when a place was clicked on the map, 'search' when the selection is the result of a search or 'mainSearches' when the selection is the result of selecting one of the default element in the search menu. When `channel == 'search'`, `searchQuery` gives the search string used to find the object the user selected. If the selection comes from the `setSelected` method, `analytics` is null.

This example shows how to listen to the events:

```typescript
MapwizeUI.map({
	apiKey: apiKey,
	onSelectedChange: function (selectedObject, analytics) {
	  console.log('onSelectedChange', selectedObject, analytics)
	}
}).then(function (instance) {
	console.log('MAP LOADED')
	mapwizeMap = instance
	        
	mapwizeMap.on('mapwize:directionstart', function (e) {console.log('directionstart', e)} );
	mapwizeMap.on('mapwize:venueenter', function (e) {console.log('venueenter', e)} );
	mapwizeMap.on('mapwize:floorchange', function (e) {console.log('floorchange', e)} );
	mapwizeMap.on('mapwize:universechange', function (e) {console.log('universechange', e)} );
	mapwizeMap.on('mapwize:languagechange', function (e) {console.log('languagechange', e)} );
	mapwizeMap.on('mapwize:venueexit', function (e) {console.log('venueexit', e)} );
})
```

## Locales

The user inerface can be displayed in different languages using Locales. The `locale` options as well as the `setLocale` and `getLocales` methods decribed above allow you to control the language used.

In the compiled version of Mapwize UI available on NPM, only the locales present in this repository are available.

Would you like to add a language? Don't hesitate to make a pull request and we'll be happy to merge!

If you would like to manage the locales on your own, you'll have to modify the source files and recompile Mapwize UI:

- Clone the repository
- Go to the `src/locales/` folder
- Edit the srings for the existing locales in the files like `en.locale.json` while keeping the keys unchanged.
- Add a new locale by adding a file like `LOCALE_CODE.locale.json` with a 2 letter locale code. Make sure to copy all keys from another locale.
- Run `npm run dist` commands in your terminal
- Copy the file `dist/mapwizeui.js` in your project
- Import `mapwizeui.js` module in your project

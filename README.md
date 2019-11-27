![Travis (.org)](https://img.shields.io/travis/mapwize/mapwize-ui-js/master) ![BrowserStack](https://automate.browserstack.com/badge.svg?badge_key=bHVja3V5V3JCY05ER0MzUFRucE1GTXJKQ3MzVU8wbTkvcnRYYlVNSGdFST0tLW1ZT3JwNGY1ZEpBS21vQjFpeWpjaVE9PQ==--7ccca5e09ae56f691a608c6018343e99e2e266aa%) ![GitHub tag (latest by date)](https://img.shields.io/github/v/tag/mapwize/mapwize-ui-js) ![npm](https://img.shields.io/npm/v/mapwize-ui)

# Mapwize UI

Fully featured and ready to use Widget to add Mapwize Indoor Maps and Navigation in your Web app.

And it's open-source !

MapwizeUI version `2.1.0` uses Mapwize SDK version `4.1.0`.
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
<script type="text/javascript" src="https://cdn.jsdelivr.net/npm/mapwize-ui@2.1.0"></script>
```

### Manual

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

The `map` method return a Promise that is resolved when the map and the UI are ready

### Map parameters

#### `container`

The HTML element in which Mapbox GL JS will render the map, or the element's string id . The specified element must have no children. This parameter is optionnal, default point to the id: `mapwize`.
The html element need to be correctly formated and need to be sized in css.

#### `options`

The following parameters are available for map initialization:

- `apiKey` (required) key to authorize access to the Mapwize API. Find your key on [Mapwize Studio](https://studio.mapwize.io).
- `apiUrl` (optional, string, default: null) to change the server URL, if you have a dedicated Mapwize server.
- `container` (optional, string|HTMLElement, default: null) same as `container` param, default is: `mapwize`
- `centerOnVenue` (optional, string|object, default: null) to center on a venue at start. Options takes either a venueId or a venue object.
- `centerOnPlace` (optional, string|object, default: null) to center on a place at start. Options takes either a placeId or a place object.
- `mapboxOptions` (optional, object, default: {}) to pass Mapbox options to the map, see [Mapbox options](https://docs.mapwize.io/developers/js/sdk/latest/#map-constructor)
- `mapwizeOptions` (optional, object, default: {}) to pass Mapwize options to the map, see [Mapwize options](https://docs.mapwize.io/developers/js/sdk/latest/#map-constructor)
- `restrictContentToVenue` (optional, string, default: null) to show only the related venue on the map. Builder takes a venue id.
- `restrictContentToOrganization` (optional, string, default: null) to show only the venues of that organization on the map. Builder takes an organization id.
- `onInformationButtonClick` (optional, function) callback called when you click on the footer when a place is selected
- `onMenuButtonClick` (optional, function) callback called when the user clicked on the menu button (left button on the search bar)
- `hideMenu` (optional, boolean, default: false) to hide menu bar.
- `mainColor` (optional, string, default: null) the main color for the interface as hexadecimal string.
- `direction`  (optional, { from: string, to: string }, default: null) to display directions at start. Object with keys from and to containing place ids (string).
- `locale` (optional, string, default: en) the UI language as 2 letter ISO 639-1 code (also used as map default language)
- `unit` (optional, string, default: m) the ui measurement unit

#### Parameters usage
|    | Without options | Without `container` parameter | With `container` parameter | With `container` option |
|---:|:---------------:|:-----------------------------:|:--------------------------:|:-----------------------:|
|html| `<div id="mapwize"></div>` | `<div id="mapwize"></div>`    | `<div id="myMap"></div>` | `<div id="myMap"></div>` |
|js  | `MapwizeUI.map(apiKey)` | `MapwizeUI.map(options)`      | `MapwizeUI.map('myMap', options)` | `MapwizeUI.map({ container: 'myMap'})` |

#### Methods

##### `locale(newLocale: string): string`

Change the ui locale if param `newLocale` is provided.
Also set the map preferred language.

Signature: `(newLocale: string): string`
Parameters:
- `newLocale`(optional, string, default: null) the new locale to set (need to be in `map.getLocales()` array)

Return: the current ui locale or the new passed locale if valid

##### `getLocales(): Array<string>`

Get the list of supported locales by the user interface

Signature: `(): Array<string>`   
Parameters: there is no param   
Return: the list of supported locales by the user interface

##### `unit(newUnit: string): string`

Change the ui measurement unit if param `newUnit` is provided

Signature: `(newUnit: string): string`   
Parameters:
- `newUnit`(optional, string, default: null) the new measurement unit to set (need to be in `map.getUnits()` array)

Return: the current ui measurement unit or the new passed measurement unit if valid

##### `getUnits(): Array<string>`

Get the list of supported measurement units by the user interface

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
  centerOnVenue: 'YOUR_VENUE_ID'
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
  centerOnPlace: 'YOUR_PLACE_ID'
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

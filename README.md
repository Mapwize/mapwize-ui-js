# Mapwize UI

Fully featured and ready to use Widget to add Mapwize Indoor Maps and Navigation in your Web app.

And it's open-source !

MapwizeUI version `1.0.0` uses Mapwize SDK version `3.2.1`
For documentation about Mapwize SDK objects like Venue, Place, MapOptions... Please refer to the Mapwize SDK documentation on [docs.mapwize.io](https://docs.mapwize.io/developers/js/sdk/3.2.1/).

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

## Installation

Mapwize UI is compatible with Mapwize SDK `3.2.0` and above. The library won't work with lower version.

### Npm

Add the following npm package to your project :

```sh
npm install mapwize-ui --save
```

### CDN

You use the CDN url directly in your HTML page

```html
<script type="text/javascript" src="https://cdn.jsdelivr.net/npm/mapwize-ui@1.0.0/mapwize.js"></script>
```

### Manual

- Clone the Github repository
- Run `npm run dist` commands in your terminal
- Copy the file `dist/mapwizeui.js` in your project
- Import `mapwizeui.js` module in your project

## Initialization

Mapwize UI can be instantiated with the constructor:

```javascript
MapwizeUI.map(options)
```

The `map` method return a Promise that is resolved when the map and the UI are ready

### Map options

The following parameters are available for map initialization:

- `centerOnVenue` to center on a venue at start. Options takes either a venueId or a venue object.
- `centerOnPlace` to center on a place at start. Options takes either a placeId or a place object.
- `mapboxOptions` to pass Mapbox options to the map, see [Mapbox options](https://docs.mapwize.io/developers/js/sdk/3.2.1/#map-constructor)
- `mapwizeOptions` to pass Mapwize options to the map, see [Mapwize options](https://docs.mapwize.io/developers/js/sdk/3.2.1/#map-constructor)
- `restrictContentToVenue` to show only the related venue on the map. Builder takes a venue id.
- `restrictContentToOrganization` to show only the venues of that organization on the map. Builder takes an organization id.
- `onInformationButtonClick` callback called when you click on the footer when a place is selected
- `onMenuButtonClick` callback called when the user clicked on the menu button (left button on the search bar)

### Simple example

```javascript
var options = {
  apiKey: 'YOUR_MAPWIZE_API_KEY_HERE'
}
MapwizeUI.map(options).then(map => {
  console.log('Mapwize map and ui are ready to be used')
})
```

### Center on venue

To have the map centered on a venue at start up:

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
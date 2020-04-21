# Mapwize UI - Advanced features

This file documents some more advanced features of Mapwize UI.

- Advanced features allow to interfere deeper with the behavior of Mapwize UI, and then also to break more things. 
- Advanced features should not be used without a deep understanding of Mapwize UI and the ability to dig in the source code.
- Advanced features are not tested as much as standard features during releases and are therefore more subjet to bugs. Please check that everything still works when upgrading Mapwize UI
- Advanced features might be discontinued at any point without retro-compatibilty.

## Interceptors

Some interceptors can be defined as part of the creation options to override some standard values used by Mapwize UI.

### onElementWillBeSelected

`onElementWillBeSelected` is called before a place or a placeList gets selected, and before the `onSelectedChange` event. This interceptor is a `function (element, options)` where `element` is the place or placeList about to be selected and `options` are the following:

- `options.pitch`
- `options.bearing`
- `options.zoom`
- `options.centerOnElement`
- `options.template` --> overrides `src/footer/selection/selection.html`

The function should return `options`.

```
onElementWillBeSelected: function (element, options) { return options; }
```

### onDirectionQueryWillBeSent

`onDirectionQueryWillBeSent` is called before a direction request is sent. The interceptor is a `function (query)` that should return `query`.

```
onDirectionQueryWillBeSent: function (query) { return query; }
```

### onDirectionWillBeDisplayed

`onDirectionWillBeDisplayed` is called before a direction is displayed. The interceptor is a `function (direction, options)` where `direction` is the direction object to be displayed and the `options` defines the changes in the UI. should return both `direction` and `options`

```
function (direction, options) { return { direction: direction, options: options }; }
```

### onSearchQueryWillBeSent

```
function (searchString, searchOptions, focusedField) { return { searchString: searchString, searchOptions: searchOptions }; }
```

### onReceiveSearchResults

```
function (results) { return results; }
```

### onSearchResultWillBeDisplayed

```
function (template, options, mwzObject) { return { template: template, options: options }; }
```

## Direction mode icons

This is the procedure to change the icons of the direction modes

- Open svg with any text edior
- Add class with fill color #000000
- Save file
- Convert svg to base64
- Add link to config.ts file

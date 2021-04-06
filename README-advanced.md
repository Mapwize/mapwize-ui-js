# Mapwize UI - Advanced features

This file documents some more advanced features of Mapwize UI.

- Advanced features allow to interfere deeper with the behavior of Mapwize UI, and then also to break more things.
- Advanced features should not be used without a deep understanding of Mapwize UI and the ability to dig in the source code.
- Advanced features are not tested as much as standard features during releases and are therefore more subjet to bugs. Please check that everything still works when upgrading Mapwize UI
- Advanced features might be discontinued at any point without retro-compatibilty.

## Interceptors

Some interceptors can be defined as part of the creation options to override some standard values used by Mapwize UI.

### shouldMoveToSelectedObject

Called when a object is selected. You can use this method to choose if you want to move de camera.

`(mwzObject: any, options: { centerOnElement: boolean; zoom: number }) => { centerOnElement: boolean; zoom: number }`

### onDirectionQueryWillBeSent

`onDirectionQueryWillBeSent` is called before a direction request is sent. The interceptor is a `function (query)` that should return `query`.

```
onDirectionQueryWillBeSent: (query: string) => string
```

### onDirectionWillBeDisplayed

`onDirectionWillBeDisplayed` is called before a direction is displayed. The interceptor is a `function (directionOptions: any, direction: any) => any` where `direction` is the direction object to be displayed and the `options` defines the changes in the UI. should return `options`

```
onDirectionWillBeDisplayed: (directionOptions: any, direction: any) => any
```

### onSearchQueryWillBeSent

Called before sending the search query. You can modify the query on the fly

```
onSearchQueryWillBeSent?: (searchOptions: any, searchString: string, channel: string) => any
```

### onSearchResultsWillBeDisplayed

Called before displaying all the result in the result list. You can use this method to filter the result before they are displayed

```
onSearchResultsWillBeDisplayed?: (results: any) => any
```

### onObjectWillBeDisplayedInSearch

Called before displaying a result in the search result list. You can use this method to change the design of the result item

```
onObjectWillBeDisplayedInSearch?: (template: HTMLElement, mwzObject: any) => HTMLElement
```

## Direction mode icons

This is the procedure to change the icons of the direction modes

- Open svg with any text edior
- Add class with fill color #000000
- Save file
- Convert svg to base64
- Add link to icons.ts file

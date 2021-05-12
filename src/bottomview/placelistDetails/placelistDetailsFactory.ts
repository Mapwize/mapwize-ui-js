import { DevCallbackInterceptor } from '../../devCallbackInterceptor'
import { lang_direction, lang_information } from '../../localizor/localizor'
import { replaceColorInBase64svg } from '../../utils/formatter'
import { bottomViewIcons } from '../../utils/icons'
import { PlaceDetailsListener } from '../placeDetails/placeDetailsFactory'

export interface PlacelistViews {
  photosView: HTMLElement
  smallView: HTMLElement
  largeView: HTMLElement
}

interface ButtonContent {
  id: string
  title: string
  imageSrc: string
  callback: (target: HTMLElement) => void
}

export const buildPlacelistViews = (
  placelist: any,
  mainColor: string,
  language: string,
  devCallbackInterceptor: DevCallbackInterceptor,
  listener: PlaceDetailsListener
): PlacelistViews => {
  const buttonContents = generateButtonContents(placelist, devCallbackInterceptor, listener, language)

  return {
    photosView: buildPhotosView([], listener),
    smallView: buildSmallView(placelist.titleLabel, buttonContents, mainColor, placelist.subtitleLabel),
    largeView: buildLargeView(placelist.titleLabel, placelist.places, buttonContents, mainColor, placelist.subtitleLabel, listener),
  }
}

const generateButtonContents = (placelist: any, devCallbackInterceptor: DevCallbackInterceptor, listener: PlaceDetailsListener, language: string): ButtonContent[] => {
  const buttonContents: ButtonContent[] = [
    { id: 'mwz-directions-button', title: lang_direction(language), imageSrc: bottomViewIcons.DIRECTION, callback: listener.onDirectionClick },
  ]
  if (devCallbackInterceptor.shouldShowInformationButtonFor(placelist)) {
    buttonContents.push({
      id: 'mwz-informations-button',
      title: lang_information(language),
      imageSrc: bottomViewIcons.INFO,
      callback: (target: HTMLElement) => listener.onInformationClick(placelist),
    })
  }

  return buttonContents
}

const buildPhotosView = (photoUrls: string[], listener: PlaceDetailsListener): HTMLElement => {
  const container = document.createElement('div')
  container.classList.add('mwz-bottom-photos-view')

  const closeButton = document.createElement('div')
  closeButton.onclick = (e) => {
    e.stopPropagation()
    listener.onCloseClick()
  }
  closeButton.classList.add('mwz-bottom-photos-close-button')
  container.appendChild(closeButton)
  const closeImg = document.createElement('img')
  closeImg.classList.add('mwz-bottom-photos-close-button-img')
  closeImg.src =
    'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyNCIgaGVpZ2h0PSIyNCIgdmlld0JveD0iMCAwIDI0IDI0Ij48cGF0aCBkPSJNMTYuNjcgMGwyLjgzIDIuODI5LTkuMzM5IDkuMTc1IDkuMzM5IDkuMTY3LTIuODMgMi44MjktMTIuMTctMTEuOTk2eiIvPjwvc3ZnPg=='
  closeButton.appendChild(closeImg)

  if (!photoUrls || photoUrls.length === 0) {
    container.classList.add('mwz-single-photo')
    const img = document.createElement('img')
    img.classList.add('mwz-bottom-photos-view-image')
    img.src = bottomViewIcons.PLACE_HOLDER
    container.appendChild(img)
    return container
  }

  if (photoUrls.length <= 1) {
    container.classList.add('mwz-single-photo')
  }

  photoUrls.forEach((url) => {
    const img = document.createElement('img')
    img.classList.add('mwz-bottom-photos-view-image')
    img.src = url
    container.appendChild(img)
  })

  return container
}

const buildSmallView = (title: string, buttons: ButtonContent[], mainColor: string, subtitle?: string): HTMLElement => {
  const container = document.createElement('div')
  container.classList.add('mwz-small-view-container')

  const firstLineContainer = document.createElement('div')
  firstLineContainer.classList.add('mwz-small-view-first-line-container')
  container.appendChild(firstLineContainer)

  const titleLabel = document.createElement('span')
  titleLabel.innerHTML = title
  titleLabel.classList.add('mwz-small-view-title')
  firstLineContainer.appendChild(titleLabel)

  const toggleContainer = document.createElement('div')
  firstLineContainer.appendChild(toggleContainer)

  if (subtitle) {
    const subtitleLabel = document.createElement('span')
    subtitleLabel.innerHTML = subtitle
    subtitleLabel.classList.add('mwz-small-view-subtitle')
    container.appendChild(subtitleLabel)
  }

  const buttonContainer = document.createElement('div')
  buttonContainer.classList.add('mwz-small-view-button-container')
  container.appendChild(buttonContainer)

  let first = true
  buttons.forEach((b) => {
    const button = document.createElement('div')
    // button.id = b.id
    button.classList.add(b.id)
    button.classList.add('mwz-small-view-button')
    button.onclick = (e) => {
      e.stopPropagation()
      b.callback(button)
    }

    const image = document.createElement('img')
    image.classList.add('mwz-small-view-button-image')
    image.src = b.imageSrc
    button.appendChild(image)

    const label = document.createElement('span')
    label.classList.add('mwz-small-view-button-title')
    label.innerHTML = b.title
    button.appendChild(label)

    if (!first) {
      button.classList.add('mwz-outlined')
      image.src = replaceColorInBase64svg(b.imageSrc, mainColor)
    } else {
      image.src = replaceColorInBase64svg(b.imageSrc, '#ffffff')
    }

    buttonContainer.appendChild(button)
    first = false
  })

  return container
}

const buildLargeView = (title: string, places: any[], buttons: ButtonContent[], mainColor: string, subtitle: string, listener: PlaceDetailsListener): HTMLElement => {
  const container = document.createElement('div')
  container.classList.add('mwz-large-view-container')

  const titleLabel = document.createElement('span')
  titleLabel.innerHTML = title
  titleLabel.classList.add('mwz-large-view-title')
  container.appendChild(titleLabel)

  if (subtitle && subtitle.length > 0) {
    const subtitleLabel = document.createElement('span')
    subtitleLabel.innerHTML = subtitle
    subtitleLabel.classList.add('mwz-large-view-subtitle')
    container.appendChild(subtitleLabel)
  }

  const buttonContainer = document.createElement('div')
  buttonContainer.classList.add('mwz-large-view-button-container')
  container.appendChild(buttonContainer)

  let first = true
  buttons.forEach((b) => {
    const button = document.createElement('div')
    // button.id = b.id
    button.classList.add(b.id)
    button.classList.add('mwz-large-view-button')
    button.onclick = (e) => {
      e.stopPropagation()
      b.callback(button)
    }

    const image = document.createElement('img')
    image.classList.add('mwz-large-view-button-image')
    image.src = b.imageSrc
    button.appendChild(image)

    if (!first) {
      button.classList.add('mwz-outlined')
      image.src = replaceColorInBase64svg(b.imageSrc, mainColor)
    } else {
      image.src = replaceColorInBase64svg(b.imageSrc, '#ffffff')
    }

    const label = document.createElement('span')
    label.innerHTML = b.title
    button.appendChild(label)

    buttonContainer.appendChild(button)
    first = false
  })

  places.forEach((place) => {
    const placeContainer = document.createElement('div')
    placeContainer.onclick = () => {
      listener.onPlaceClick(place)
    }
    placeContainer.classList.add('mwz-placelist-item-container')
    container.appendChild(placeContainer)
    const textContainer = document.createElement('div')
    textContainer.classList.add('mwz-placelist-item-labels-container')
    placeContainer.appendChild(textContainer)
    const placeTitle = document.createElement('span')
    placeTitle.classList.add('mwz-placelist-item-labels-title')
    placeTitle.innerHTML = place.titleLabel
    textContainer.appendChild(placeTitle)
    if (place.subtitleLabel) {
      const placeSubtitle = document.createElement('span')
      placeSubtitle.innerHTML = place.subtitle
      textContainer.appendChild(placeSubtitle)
    }
    const placeFloor = document.createElement('span')
    placeFloor.innerHTML = place.floorLabel
    textContainer.appendChild(placeFloor)

    const directionButton = document.createElement('div')
    directionButton.classList.add('mwz-place-list-item-direction-button')
    placeContainer.appendChild(directionButton)
    const directionImage = document.createElement('img')
    directionImage.src = replaceColorInBase64svg(bottomViewIcons.DIRECTION, mainColor)
    directionButton.onclick = (e) => {
      e.preventDefault()
      listener.onDirectionToPlaceClick(place)
    }
    directionButton.appendChild(directionImage)
  })

  return container
}

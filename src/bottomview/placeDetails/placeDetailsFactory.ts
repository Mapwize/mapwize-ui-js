import { DevCallbackInterceptor } from '../../devCallbackInterceptor'
import {
  lang_call,
  lang_capacity_not_available,
  lang_currently_available,
  lang_currently_occupied,
  lang_details,
  lang_direction,
  lang_information,
  lang_on_floor,
  lang_opening_hours_not_available,
  lang_outdoor,
  lang_overview,
  lang_phone_not_available,
  lang_schedule_not_available,
  lang_share,
  lang_website,
  lang_website_not_available,
} from '../../localizor/localizor'
import { replaceColorInBase64svg } from '../../utils/formatter'
import { bottomViewIcons } from '../../utils/icons'
import { buildCurrentOpeningStatus, buildOpeningHours } from '../../utils/openingHoursFormatter'
import './placeDetails.scss'

export interface PlaceDetailsViews {
  smallView: HTMLElement
  largeView: HTMLElement
  photosView: HTMLElement
}

export interface PlaceDetailsListener {
  onDirectionClick: () => void
  onPhoneClick: (phoneNumber: string) => void
  onWebsiteClick: (website: string) => void
  onShareClick: (target: HTMLElement, shareLink: string) => void
  onInformationClick: (placeDetails: any) => void
  onCloseClick: () => void
  onPlaceClick: (place: any) => void
  onDirectionToPlaceClick: (place: any) => void
}

interface ButtonContent {
  id: string
  title: string
  imageSrc: string
  callback: (target: HTMLElement) => void
}

interface OpeningInterval {
  day: string
  intervals: string[]
}

interface CalendarEvent {
  subject: string
  start: string
  end: string
}

export const buildPlaceDetailsViews = (
  placeDetails: any,
  language: string,
  mainColor: string,
  devCallbackInterceptor: DevCallbackInterceptor,
  listener: PlaceDetailsListener
): PlaceDetailsViews => {
  const buttonContents = generateButtonContents(placeDetails, devCallbackInterceptor, listener, language)
  const openingStatus = buildCurrentOpeningStatus(placeDetails, language)
  let occupiedStatus = undefined
  if (placeDetails.calendarEvents) {
    occupiedStatus = isOccupied(new Date(), placeDetails.calendarEvents) ? lang_currently_occupied(language) : lang_currently_available(language)
  }

  const rows = generateRows(placeDetails, openingStatus, mainColor, language)
  return {
    photosView: buildPhotosView(placeDetails.photos, listener),
    smallView: buildSmallView(
      placeDetails.titleLabel,
      buttonContents,
      mainColor,
      placeDetails.subtitleLabel,
      occupiedStatus,
      placeDetails.openingHours && placeDetails.openingHours.lenght > 0 ? openingStatus : null
    ),
    largeView: buildLargeView(placeDetails.titleLabel, buttonContents, rows, mainColor, language, placeDetails.subtitleLabel, placeDetails.detailsLabel),
  }
}

const generateButtonContents = (placeDetails: any, devCallbackInterceptor: DevCallbackInterceptor, listener: PlaceDetailsListener, language: string): ButtonContent[] => {
  const buttonContents: ButtonContent[] = [
    { id: 'mwz-directions-button', title: lang_direction(language), imageSrc: bottomViewIcons.DIRECTION, callback: listener.onDirectionClick },
  ]
  if (devCallbackInterceptor.shouldShowInformationButtonFor(placeDetails)) {
    buttonContents.push({
      id: 'mwz-informations-button',
      title: lang_information(language),
      imageSrc: bottomViewIcons.INFO,
      callback: (target: HTMLElement) => listener.onInformationClick(placeDetails),
    })
  }
  if (placeDetails.phone) {
    buttonContents.push({
      id: 'mwz-phone-button',
      title: lang_call(language),
      imageSrc: bottomViewIcons.PHONE,
      callback: (target: HTMLElement) => listener.onPhoneClick(placeDetails.phone),
    })
  }
  if (placeDetails.website) {
    buttonContents.push({
      id: 'mwz-website-button',
      title: lang_website(language),
      imageSrc: bottomViewIcons.GLOBE,
      callback: (target: HTMLElement) => listener.onWebsiteClick(placeDetails.website),
    })
  }
  if (placeDetails.shareLink) {
    buttonContents.push({
      id: 'mwz-share-button',
      title: lang_share(language),
      imageSrc: bottomViewIcons.SHARE,
      callback: (target: HTMLElement) => listener.onShareClick(target, placeDetails.shareLink),
    })
  }

  return buttonContents
}

const generateRows = (placeDetails: any, openingStatus: string, mainColor: string, language: string): HTMLElement[] => {
  const rows: HTMLElement[] = []
  const unfilledRows: HTMLElement[] = []
  rows.push(
    buildDefaultRow(
      placeDetails.floor.number !== null ? lang_on_floor(language, placeDetails.floor.number) : lang_outdoor(language),
      replaceColorInBase64svg(bottomViewIcons.FLOOR, mainColor)
    )
  )
  if (placeDetails.website) {
    rows.push(buildDefaultRow('<a href="' + placeDetails.website + '" target="_blank">' + placeDetails.website + '</a>', replaceColorInBase64svg(bottomViewIcons.GLOBE, mainColor)))
  } else {
    unfilledRows.push(buildDefaultRow(lang_website_not_available(language), replaceColorInBase64svg(bottomViewIcons.GLOBE, '#808080'), false))
  }
  if (placeDetails.phone) {
    rows.push(buildDefaultRow(placeDetails.phone, replaceColorInBase64svg(bottomViewIcons.PHONE_OUTLINE, mainColor)))
  } else {
    unfilledRows.push(buildDefaultRow(lang_phone_not_available(language), replaceColorInBase64svg(bottomViewIcons.PHONE_OUTLINE, '#808080'), false))
  }
  if (placeDetails.capacity) {
    rows.push(buildDefaultRow(placeDetails.capacity, replaceColorInBase64svg(bottomViewIcons.GROUP, mainColor)))
  } else {
    unfilledRows.push(buildDefaultRow(lang_capacity_not_available(language), replaceColorInBase64svg(bottomViewIcons.GROUP, '#808080'), false))
  }
  if (placeDetails.openingHours) {
    rows.push(buildOpeningHoursRow(openingStatus, buildOpeningHours(placeDetails.openingHours, language), replaceColorInBase64svg(bottomViewIcons.CLOCK, mainColor)))
  } else {
    unfilledRows.push(buildDefaultRow(lang_opening_hours_not_available(language), replaceColorInBase64svg(bottomViewIcons.CLOCK, '#808080'), false))
  }
  if (placeDetails.calendarEvents) {
    const status = isOccupied(new Date(), placeDetails.calendarEvents) ? lang_currently_occupied(language) : lang_currently_available(language)
    rows.push(buildScheduleRow(status, placeDetails.calendarEvents, replaceColorInBase64svg(bottomViewIcons.CALENDAR, mainColor), mainColor))
  } else {
    unfilledRows.push(buildDefaultRow(lang_schedule_not_available(language), replaceColorInBase64svg(bottomViewIcons.CALENDAR, '#808080'), false))
  }
  return rows.concat(unfilledRows)
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
    container.classList.add('mwz-bottom-photos-view-placeholder')
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

const buildSmallView = (title: string, buttons: ButtonContent[], mainColor: string, subtitle?: string, occupiedStatus?: string, openingStatus?: string): HTMLElement => {
  const state: 'small' | 'medium' | 'large' = 'medium'

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

  if (openingStatus) {
    const openingLabel = document.createElement('span')
    openingLabel.innerHTML = openingStatus
    openingLabel.classList.add('mwz-small-view-opening-status')
    container.appendChild(openingLabel)
  }

  if (occupiedStatus) {
    const occupiedLabel = document.createElement('span')
    occupiedLabel.innerHTML = occupiedStatus
    occupiedLabel.classList.add('mwz-small-view-opening-status')
    container.appendChild(occupiedLabel)
  }

  const buttonContainer = document.createElement('div')
  buttonContainer.classList.add('mwz-small-view-button-container')
  container.appendChild(buttonContainer)

  let first = true
  buttons.forEach((b: ButtonContent) => {
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

const buildLargeView = (title: string, buttons: ButtonContent[], rows: HTMLElement[], mainColor: string, language: string, subtitle?: string, details?: string): HTMLElement => {
  const container = document.createElement('div')
  container.classList.add('mwz-large-view-container')

  const titleLabel = document.createElement('span')
  titleLabel.innerHTML = title
  titleLabel.classList.add('mwz-large-view-title')
  container.appendChild(titleLabel)

  if (subtitle) {
    const subtitleLabel = document.createElement('span')
    subtitleLabel.innerHTML = subtitle
    subtitleLabel.classList.add('mwz-large-view-subtitle')
    container.appendChild(subtitleLabel)
  }

  const overviewDiv = document.createElement('div')

  const buttonContainer = document.createElement('div')
  buttonContainer.classList.add('mwz-large-view-button-container')
  overviewDiv.appendChild(buttonContainer)

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

    const imageContainer = document.createElement('div')
    imageContainer.classList.add('mwz-large-view-button-image')
    button.appendChild(imageContainer)
    const image = document.createElement('img')
    //image.classList.add('mwz-large-view-button-image')
    image.src = b.imageSrc
    imageContainer.appendChild(image)

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

  rows.forEach((r) => overviewDiv.appendChild(r))

  if (details) {
    const detailsDiv = document.createElement('div')
    detailsDiv.classList.add('mwz-pager-details-view')
    detailsDiv.innerHTML = details
    container.appendChild(embbedInPager(overviewDiv, detailsDiv, language))
  } else {
    container.appendChild(overviewDiv)
  }

  return container
}

const embbedInPager = (overview: HTMLElement, details: HTMLElement, language: string): HTMLElement => {
  const container = document.createElement('div')
  container.classList.add('mwz-pager-container')

  const buttonContainer = document.createElement('div')
  buttonContainer.classList.add('mwz-pager-button-container')
  const overviewButton = document.createElement('div')
  overviewButton.innerText = lang_overview(language)
  overviewButton.classList.add('mwz-pager-button')
  overviewButton.classList.add('mwz-selected')
  overviewButton.onclick = () => {
    details.classList.add('mwz-gone')
    overview.classList.remove('mwz-gone')
    overviewButton.classList.add('mwz-selected')
    detailsButton.classList.remove('mwz-selected')
  }
  const detailsButton = document.createElement('div')
  detailsButton.innerText = lang_details(language)
  detailsButton.classList.add('mwz-pager-button')
  detailsButton.onclick = () => {
    overview.classList.add('mwz-gone')
    details.classList.remove('mwz-gone')
    detailsButton.classList.add('mwz-selected')
    overviewButton.classList.remove('mwz-selected')
  }
  buttonContainer.appendChild(overviewButton)
  buttonContainer.appendChild(detailsButton)

  container.appendChild(buttonContainer)

  container.appendChild(overview)
  container.appendChild(details)
  details.classList.add('mwz-gone')

  return container
}

const buildDefaultRow = (title: string, imgSrc: string, infoAvailable: boolean = true): HTMLElement => {
  const container = document.createElement('div')
  container.classList.add('mwz-large-view-default-row')

  const image = document.createElement('img')
  image.src = imgSrc

  const label = document.createElement('span')
  if (!infoAvailable) {
    label.classList.add('mwz-not-available')
  }
  label.innerHTML = title

  container.appendChild(image)
  container.appendChild(label)

  return container
}

const buildOpeningHoursRow = (openingStatus: string, openingHours: OpeningInterval[], imgSrc: string): HTMLElement => {
  const container = document.createElement('div')
  container.classList.add('mwz-large-view-openable-row')

  const mainRow = document.createElement('div')
  mainRow.classList.add('mwz-large-view-default-row')

  const image = document.createElement('img')
  image.src = imgSrc

  const label = document.createElement('span')
  label.innerHTML = openingStatus

  const dropButton = document.createElement('img')
  dropButton.classList.add('mwz-large-view-openable-toggle-button')
  dropButton.src = bottomViewIcons.LEFT_CHEVRON

  mainRow.appendChild(image)
  mainRow.appendChild(label)
  mainRow.appendChild(dropButton)

  const openContent = document.createElement('div')
  openContent.classList.add('mwz-large-view-openable-row-content')
  openingHours.forEach((openingInterval) => {
    const intervalRow = document.createElement('div')
    intervalRow.classList.add('mwz-large-view-opening-interval-subrow')

    const day = document.createElement('span')
    day.classList.add('mwz-large-view-opening-interval-subrow-day')
    day.innerHTML = openingInterval.day

    const intervals = document.createElement('span')
    intervals.classList.add('mwz-large-view-opening-interval-subrow-intervals')
    let mergeInterval = ''
    openingInterval.intervals.forEach((i) => (mergeInterval += i + '</br>'))
    mergeInterval.trim()
    intervals.innerHTML = mergeInterval

    intervalRow.appendChild(day)
    intervalRow.appendChild(intervals)
    openContent.appendChild(intervalRow)
  })

  let open = false
  container.onclick = (e) => {
    e.stopPropagation()
    if (open) {
      openContent.classList.remove('open')
      dropButton.classList.remove('open')
    } else {
      openContent.classList.add('open')
      dropButton.classList.add('open')
    }
    open = !open
  }

  container.appendChild(mainRow)
  container.appendChild(openContent)

  return container
}

const buildScheduleRow = (scheduleStatus: string, events: CalendarEvent[], imgSrc: string, mainColor: string): HTMLElement => {
  const container = document.createElement('div')
  container.classList.add('booking-view-container')

  const mainRow = document.createElement('div')
  mainRow.classList.add('mwz-large-view-default-row')

  const image = document.createElement('img')
  image.src = imgSrc

  const label = document.createElement('span')
  label.innerHTML = scheduleStatus

  mainRow.appendChild(image)
  mainRow.appendChild(label)
  container.appendChild(mainRow)

  const canvasContainer = document.createElement('div')
  canvasContainer.classList.add('mwz-booking-view-canvas-container')
  container.appendChild(canvasContainer)

  const canvas = document.createElement('canvas')
  canvas.classList.add('mwz-booking-view-canvas')

  var dpr = window.devicePixelRatio || 1
  // Get the size of the canvas in CSS pixels.
  var rect = canvas.getBoundingClientRect()
  // Give the canvas pixel dimensions of their CSS
  // size * the device pixel ratio.
  canvas.width = 600 * dpr
  canvas.height = 150 * dpr
  const gridWidth = 600 / 24
  const height = 150
  var ctx = canvas.getContext('2d')
  canvas.style.width = '600px'
  canvas.style.height = '150px'
  // Scale all drawing operations by the dpr, so you
  // don't have to worry about the difference.
  ctx.scale(dpr, dpr)

  drawAxe(ctx, gridWidth, height)
  drawSchedule(ctx, gridWidth, height, events, mainColor)
  drawCurrentTime(ctx, gridWidth, height)
  canvasContainer.appendChild(canvas)

  // Scroll to center current time
  const date = new Date()
  const dateInSeconds = date.getHours() + date.getMinutes() / 60
  setTimeout(() => (canvasContainer.scrollLeft = dateInSeconds * gridWidth - 190), 100)

  return container
}

const drawAxe = (ctx: CanvasRenderingContext2D, gridWidth: number, height: number) => {
  ctx.strokeStyle = 'gray'
  ctx.beginPath()
  ctx.moveTo(0, height - 20)
  ctx.lineTo(gridWidth * 24, height - 20)
  ctx.closePath()
  ctx.stroke()

  for (let i = 0; i < 24; i++) {
    if (i !== 0) {
      ctx.moveTo(i * gridWidth, height - 20)
      ctx.lineTo(i * gridWidth, height - 15)
    }
    ctx.fillText(i + 'h', i * gridWidth + 2, height - 10)
    ctx.stroke()
    ctx.fill()
  }
}

const drawSchedule = (ctx: CanvasRenderingContext2D, gridWidth: number, height: number, events: CalendarEvent[], mainColor: string) => {
  events.forEach((event) => {
    const start = new Date(event.start)
    const end = new Date(event.end)
    let startInMinuts = start.getHours() + start.getMinutes() / 60
    let endInMinuts = end.getHours() + end.getMinutes() / 60
    if (!isToday(start)) {
      startInMinuts = 0
    }
    if (!isToday(end)) {
      endInMinuts = 23.99
    }

    ctx.beginPath()
    ctx.fillStyle = mainColor
    let width = (endInMinuts - startInMinuts) * gridWidth - 2
    let height = 120 - 1
    let radius = 8
    if (width < 16) {
      radius = width / 2
    }
    drawHalfRoundedRect(ctx, startInMinuts * gridWidth + 1, 10, width, height, radius)
  })
}

const drawCurrentTime = (ctx: CanvasRenderingContext2D, gridWidth: number, height: number) => {
  const date = new Date()
  const dateInSeconds = date.getHours() + date.getMinutes() / 60
  ctx.strokeStyle = 'blue'
  ctx.lineWidth = 2
  ctx.beginPath()
  ctx.moveTo(dateInSeconds * gridWidth, height - 5)
  ctx.lineTo(dateInSeconds * gridWidth, 0)
  ctx.stroke()
}

const drawHalfRoundedRect = (ctx: CanvasRenderingContext2D, x: number, y: number, width: number, height: number, radius: number) => {
  ctx.beginPath()
  ctx.moveTo(x + radius, y)
  ctx.lineTo(x + width - radius, y)
  ctx.quadraticCurveTo(x + width, y, x + width, y + radius)
  ctx.lineTo(x + width, y + height)
  ctx.quadraticCurveTo(x + width, y + height, x + width, y + height)
  ctx.lineTo(x, y + height)
  ctx.quadraticCurveTo(x, y + height, x, y + height)
  ctx.lineTo(x, y + radius)
  ctx.quadraticCurveTo(x, y, x + radius, y)
  ctx.closePath()
  ctx.fill()
}

const isToday = (someDate: Date) => {
  const today = new Date()
  return someDate.getDate() === today.getDate() && someDate.getMonth() === today.getMonth() && someDate.getFullYear() === today.getFullYear()
}

const isOccupied = (currentDate: Date, intervals: CalendarEvent[]): boolean => {
  for (let i = 0; i < intervals.length; i++) {
    if (currentDate > new Date(intervals[i].start) && currentDate < new Date(intervals[i].end)) {
      return true
    }
  }

  return false
}
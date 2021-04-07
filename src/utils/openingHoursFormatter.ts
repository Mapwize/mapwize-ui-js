import * as dayjs from 'dayjs'
import {
  lang_closed,
  lang_close_24_7,
  lang_close_open,
  lang_close_open_at,
  lang_close_open_tomorrow,
  lang_friday,
  lang_monday,
  lang_open_24_7,
  lang_open_all_day,
  lang_open_close,
  lang_open_close_at,
  lang_open_close_tomorrow,
  lang_saturday,
  lang_sunday,
  lang_thursday,
  lang_tuesday,
  lang_wednesday,
} from '../localizor/localizor'
import * as utc from 'dayjs/plugin/utc'
import * as timezone from 'dayjs/plugin/timezone'

dayjs.extend(utc)
dayjs.extend(timezone)

export const buildOpeningHours = (openHours: any[], language: string): any => {
  let formatted: any[] = [[], [], [], [], [], [], []]
  openHours.forEach((o) => {
    if (o.open === '00:00' && o.close === '23:59') {
      formatted[o.day].push(lang_open_all_day(language))
    } else {
      formatted[o.day].push(o.open + ' - ' + o.close)
    }
  })
  for (let i = 0; i < formatted.length; i++) {
    if (formatted[i].length === 0) {
      formatted[i].push(lang_closed(language))
    }
  }

  formatted = formatted.map((v, i) => {
    return {
      day: dayOfWeekAsString(i, language),
      intervals: v,
    }
  })

  formatted.push(formatted.shift())
  return formatted
}

export const buildCurrentOpeningStatus = (placeDetails: any, language: string): string => {
  if (placeDetails.openingHours && placeDetails.openingHours.length > 0) {
    return getCurrentOpeningState(placeDetails.openingHours, placeDetails.timezone, language)
  }
  return null
}

const getFormattedHours = (minuts: number): string => {
  const date = new Date()
  date.setHours(Math.floor(minuts / 60))
  date.setMinutes(minuts % 60)
  date.setSeconds(0)
  date.setMilliseconds(0)
  const s = date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
  return s
}

const dayOfWeekAsString = (dayIndex: number, language: string): string => {
  return (
    [lang_sunday(language), lang_monday(language), lang_tuesday(language), lang_wednesday(language), lang_thursday(language), lang_friday(language), lang_saturday(language)][
      dayIndex
    ] || ''
  )
}

const getCurrentOpeningState = (input: any[], timezoneCode: string, language: string): string => {
  const localOffset = -new Date().getTimezoneOffset()
  const venueOffset = dayjs().tz(timezoneCode).utcOffset()
  const diff = (venueOffset - localOffset) / 60

  const date = new Date()
  const weekday = date.getDay()
  const currentMinuts = (new Date().getHours() + diff) * 60 + new Date().getMinutes()

  const intervals = sortInterval(buildIntervals(input), new Date().getDay(), currentMinuts)

  const currentInterval = getIntervalIfOpenFromIntervals(intervals, weekday, currentMinuts)
  if (currentInterval) {
    const closingInterval = getNextCloseIntervalFromIntervals(intervals, currentInterval)
    if (closingInterval) {
      if (closingInterval === currentInterval) {
        return lang_open_close_at(language, getFormattedHours(closingInterval.close))
      }
      if (closingInterval.day - currentInterval.day === 1 || closingInterval.day - currentInterval.day === -6) {
        return lang_open_close_tomorrow(language, getFormattedHours(closingInterval.close))
      } else {
        return lang_open_close(language, dayOfWeekAsString(closingInterval.day, language), getFormattedHours(closingInterval.close))
      }
    } else {
      return lang_open_24_7(language)
    }
  } else {
    const openingInterval = getNextOpeningIntervalFromIntervals(intervals, weekday, currentMinuts)
    if (openingInterval) {
      if (openingInterval.day === weekday) {
        console.log(openingInterval.close, currentMinuts)
        if (openingInterval.close > currentMinuts) {
          return lang_close_open_at(language, getFormattedHours(openingInterval.open))
        } else {
          return lang_close_open(language, dayOfWeekAsString(openingInterval.day, language), getFormattedHours(openingInterval.open))
        }
      }
      if (openingInterval.day - weekday === 1 || openingInterval.day - weekday === -6) {
        return lang_close_open_tomorrow(language, getFormattedHours(openingInterval.open))
      } else {
        return lang_close_open(language, dayOfWeekAsString(openingInterval.day, language), getFormattedHours(openingInterval.open))
      }
    } else {
      return lang_close_24_7(language)
    }
  }
  return ''
}

const getNextOpeningIntervalFromIntervals = (intervals: any[], day: number, minuts: number): any => {
  // i.open > ? minuts
  let nextPossibleOpening = []
  for (let i = 0; i < intervals.length; i++) {
    if (intervals[i].day === day && intervals[i].open > minuts && intervals[i].close > minuts) {
      return intervals[i]
    }
    if (intervals[i].day === day && intervals[i].close < minuts) {
      nextPossibleOpening.push(intervals[i])
    }
    if (intervals[i].day !== day) {
      nextPossibleOpening.push(intervals[i])
    }
  }
  let counter = 0
  while (counter < 7) {
    const nextDay = (day + counter) % 7
    const interval = nextPossibleOpening.find((e) => e.day === nextDay)
    if (interval) {
      return interval
    }
    counter++
  }
  return null
}

const getNextCloseIntervalFromIntervals = (intervals: any[], current: any): any => {
  if (current.close !== 23 * 60 + 59) {
    return current
  }
  const index = intervals.indexOf(current)
  for (let i = 0; i < intervals.length; i++) {
    const next = intervals[(i + index) % intervals.length]
    if (next.close !== 23 * 60 + 59) {
      return next
    }
  }
  return null
}

const getIntervalIfOpenFromIntervals = (intervals: any[], day: number, minuts: number): any => {
  for (let i = 0; i < intervals.length; i++) {
    if (day === intervals[i].day && minuts > intervals[i].open && minuts < intervals[i].close) {
      return intervals[i]
    }
  }
  return null
}

const buildIntervals = (input: any[]): any[] => {
  if (!input) {
    return []
  }
  return input.map((o) => {
    return convertStringOpeningHourToMinuts(o)
  })
}

const sortInterval = (input: any[], day: number, minuts: number): any[] => {
  const sorted = input.sort((a, b) => {
    if (a.day === b.day) {
      return a.open - b.open
    }
    return a.day - b.day
  })
  let index = -1
  for (let i = 0; i < sorted.length; i++) {
    if (sorted[i].day > day) {
      index = i - 1
      break
    }
  }
  for (let i = 0; i < index; i++) {
    sorted.push(sorted.shift())
  }
  return sorted
}

const isOpenToday = (input: any[], minuts: number): boolean => {
  input.forEach((i) => {
    if (i.open <= minuts && i.close > minuts) {
      return true
    }
  })
  return false
}

const convertToOpeningByDay = (input: any[]): any => {
  const output: any = {}
  convertStringOpeningHoursToMinuts(input).forEach((o) => {
    if (!output[o.day]) {
      output[o.day] = []
    }
    output[o.day].push({ open: o.open, clise: o.close })
  })
  return output
}

const convertStringOpeningHoursToMinuts = (input: any[]): any[] => {
  return input.map(convertStringOpeningHourToMinuts)
}

const convertStringOpeningHourToMinuts = (input: any): any => {
  return {
    day: input.day,
    open: convertStringToMinuts(input.open),
    close: convertStringToMinuts(input.close),
  }
}

const convertStringToMinuts = (input: string): number => {
  const hours = parseInt(input.substr(0, 2), 10)
  const minuts = parseInt(input.substr(3, 2), 10)
  return hours * 60 + minuts
}

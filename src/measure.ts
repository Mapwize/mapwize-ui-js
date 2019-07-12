import { join } from 'lodash'

const units: Array<string> = ['m', 'ft']
let currentUnit: string = 'm'

const getUnits = (): Array<string> => {
  return units
}
const unit = (newUnit?: string): string => {
  if (newUnit) {
    if (getUnits().includes(newUnit)) {
      currentUnit = newUnit
    } else {
      throw new Error('Locale "' + newUnit + '" is not supported, use one of: ' + join(getUnits(), ', '))
    }
  }
  return currentUnit
}

export { unit, getUnits }

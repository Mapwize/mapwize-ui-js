import * as $ from 'jquery';

const directionsHtml = require('./direction.html')

import { unit } from '../../measure'
import { DefaultControl } from '../../control'

export class FooterDirections extends DefaultControl {
    
    constructor (mapInstance: any) {
        super(mapInstance)

        this._container = $(directionsHtml)
    }
    public destroy() {}

    public getDefaultPosition(): string {
        return 'bottom-left'
    }

    public onAdd(map: any) {
        this._map = map;
        this.isOnMap = true

        this.displayStats()

        return this._container.get(0);
    }

    public displayStats () {
        const direction = this._map.getDirection()

        this._container.find('#mwz-direction-time').text(this.timeParser(direction.traveltime))
        this._container.find('#mwz-direction-distance').text(this.distanceParser(direction.distance, unit()))
    }

    public refreshUnit(): void {
        if (this._map.getDirection()) {
            this.displayStats()
        }
    }

    private timeParser(value: number): string {
        value = Math.round(value);
        if (value > 59) {
            return Math.round(value / 60) + 'min';
        } else {
            return '1min';
        }
    }
    private distanceParser(value: number, unit?: string): string {
        if (unit === 'ft') {
            value *= 3.28084;
            value = Math.round(value);
            return value + 'ft';
        } else {
            value = Math.round(value);
            if (value > 999) {
                return Math.floor(value / 1000) + ((value % 1000) ? (',' + (value % 1000) + 'km') : ('km'));
            } else {
                return value + 'm';
            }
        }
    }
}

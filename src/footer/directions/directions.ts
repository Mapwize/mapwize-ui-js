import * as $ from 'jquery';

const directionsHtml = require('./directions.html')

import { DefaultControl } from '../../control'

export class FooterDirections extends DefaultControl {
    
    constructor (mapInstance: any) {
        super(mapInstance)

        this._container = $(directionsHtml)

        this.listen('click', '#footerDirections', (e: JQueryEventObject) => {
            console.log('click, #footerDirections', e)
        })
    }

    public show () {
        this.map.footerSelection.unselect()
        
        this._container.removeClass('d-none').addClass('d-flex')
    }
    public hide () {
        this._container.removeClass('d-flex').addClass('d-none')
    }

    public displayStats (direction: any) {
        this._container.find('#mwz-direction-time').text(this.timeParser(direction.traveltime))
        this._container.find('#mwz-direction-distance').text(this.distanceParser(direction.distance))

        this.show()
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
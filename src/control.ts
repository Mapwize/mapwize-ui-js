import * as $ from 'jquery'

export class DefaultControl {
    public isOnMap: boolean
    protected _map: any
    protected map: any
    protected _container: JQuery<HTMLElement>

    constructor (mapInstance: any) {
        this.isOnMap = false
        this.map = mapInstance
    }

    public onAdd (map: any) {
        this._map = map
        this.isOnMap = true
        return this._container.get(0)
    }

    public onRemove () {
        this._container.remove()
        this._map = undefined
        this.isOnMap = false
    }

    protected listen (event: string, selector: string, callback: (e: any) => void) {
        $(this.map._container).on(event, selector, (e: JQueryEventObject) => {
            if (this._map) {
                callback(e)
            }
        })
    }
}

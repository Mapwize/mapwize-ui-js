import * as $ from 'jquery';

export class DefaultControl {
    public isOnMap: boolean
    protected _map: any
    protected map: any
    protected _container: JQuery<HTMLElement>

    constructor (mapInstance: any) {
        this.isOnMap = false
        this.map = mapInstance
    }

    onAdd(map: any) {
        this._map = map;
        this.isOnMap = true
        return this._container.get(0);
    }

    onRemove() {
        this._container.remove();
        this._map = undefined;
        this.isOnMap = false
    }

    listen(event: string, selector: string, callback: Function) {
        $(this.map._container).on(event, selector, (e: JQueryEventObject) => {
            if (this._map) {
                callback(e)
            }
        })
    }
}

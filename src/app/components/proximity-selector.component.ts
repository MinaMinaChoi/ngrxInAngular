import { OnInit, Component, Input } from '@angular/core';
import { Store } from '@ngrx/store';

@Component({
    selector: 'proximity-selector',
    template: `
    <div class="input-group">
        <label for="useLocation">Use current location</label>
        <input type="checkbox"
            [disabled]="disabled"
            (change)="onLocation($event)">
    </div>
    <div class="input-group">
        <label for="locationRadius">Radius</label>
        <input type="range" min="1" max="100" value="50"
            [disabled]="!active"
            (change)="onRadius($event)">
    </div>
    `
})

export class ProximitySelector {

    static StoreEvents = {
        position: 'ProximitySelector:POSITION',
        radius: 'ProximitySelector:RADIUS',
        off: 'ProximitySelector:OFF'
    };

    @Input()
    store: Store<any>;

    active: boolean = false;

    onLocation($event: any) {
        this.active = $event.target.checked;
        if(this.active) {
            navigator.geolocation.getCurrentPosition((position: any) => {
                this.store.dispatch({
                    type: ProximitySelector.StoreEvents.position,
                    payload: {
                        position: {
                            latitude: position.coords.latitude,
                            longitude: position.coords.longitude
                        }
                    }
                });
            });
        } else {
            this.store.dispatch({
                type:ProximitySelector.StoreEvents.off,
                payload: {}
            });
        }
    }

    onRadius($event: any) {
        const radius = parseInt($event.target.value, 10);

        this.store.dispatch({
            type: ProximitySelector.StoreEvents.radius,
            payload: {
                radius: radius
            }
        });
    }

}
import {Injectable} from '@angular/core';
import {select, Store} from '@ngrx/store';
import { LocalDataProviderService } from '@shared/local-data-provider';
import {AppState, GoOffline, GoOnline, OnOfflineState} from '../../redux-store';


const ON_OFFLINE_STATE_KEY = 'on_offline_key';
const SELECTED_YEAR_KEY = 'selected_year_key';
const SELECTED_WETTKAMPF_KEY = 'selected_wettkampf_key';

@Injectable({
  providedIn: 'root'
})
export class OnOfflineService {

    private offline: boolean;

    constructor(private store: Store<AppState>, private localDataProviderService: LocalDataProviderService) {
        this.observeOnOfflineState();
        this.loadCurrentOnOfflineState();
    }

    public goOnline(): void {



        this.store.dispatch(new GoOnline());
        this.localDataProviderService.remove(ON_OFFLINE_STATE_KEY);
    }

    public goOffline(wettkampfID:number, veranstaltungJahr:number): void {
        this.store.dispatch(new GoOffline());
        this.localDataProviderService.setPermanently(ON_OFFLINE_STATE_KEY, 'Offline');
        this.localDataProviderService.setPermanently(SELECTED_YEAR_KEY, veranstaltungJahr.toString())
        this.localDataProviderService.setPermanently(SELECTED_WETTKAMPF_KEY, wettkampfID.toString())
        console.log("Offlinestatus:" + this.isOffline());
    }
    public isOffline(): boolean {
        return this.offline;
    }

    private observeOnOfflineState() {
        this.store.pipe(select((state) => state.onOfflineState))
                  .subscribe((state: OnOfflineState) => this.offline = state.isOffline);
    }

    private loadCurrentOnOfflineState() {
        console.log('Load currrent OnOffline State');
        const onOfflineState = this.localDataProviderService.get(ON_OFFLINE_STATE_KEY);
        if (onOfflineState != null) {
            console.log('Current state is offline');
            this.store.dispatch(new GoOffline());
        } else {
            console.log('Current state is online');
            this.store.dispatch(new GoOnline());
        }
    }

    public getOfflineJahr(): number{
      return parseInt(this.localDataProviderService.get(SELECTED_YEAR_KEY));
    }

    public getOfflineWettkampfID(): number{
      return parseInt(this.localDataProviderService.get(SELECTED_WETTKAMPF_KEY));
}

}

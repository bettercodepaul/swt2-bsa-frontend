import {Injectable} from '@angular/core';
import {select, Store} from '@ngrx/store';
import { LocalDataProviderService } from '@shared/local-data-provider';
import {AppState, GoOffline, GoOnline, OnOfflineState} from '../../redux-store';


const ON_OFFLINE_STATE_KEY = 'on_offline_key';

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

    public goOffline(): void {
        this.store.dispatch(new GoOffline());
        this.localDataProviderService.setPermanently(ON_OFFLINE_STATE_KEY, 'Offline');
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
}

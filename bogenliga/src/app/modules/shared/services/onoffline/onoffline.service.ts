import {Injectable} from '@angular/core';
import {select, Store} from '@ngrx/store';
import {AppState, GoOffline, GoOnline, OnOfflineState} from '../../redux-store';

@Injectable({
  providedIn: 'root'
})
export class OnOfflineService {

    private isOffline: boolean;

    constructor(private store: Store<AppState>) {
        this.observeOnOfflineState();
    }

    public goOnline() {
        this.store.dispatch(new GoOnline());
    }

    public goOffline() {
        this.store.dispatch(new GoOffline());
    }

    private observeOnOfflineState() {
        this.store.pipe(select((state) => state.onOfflineState))
                  .subscribe((state: OnOfflineState) => this.isOffline = state.isOffline);
    }

}

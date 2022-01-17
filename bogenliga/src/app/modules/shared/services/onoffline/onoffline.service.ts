import {Injectable} from '@angular/core';
import {select, Store} from '@ngrx/store';
import {AppState, GoOffline, GoOnline, OnOfflineState} from '../../redux-store';

@Injectable({
  providedIn: 'root'
})
export class OnOfflineService {

    private offline: boolean;

    constructor(private store: Store<AppState>) {
        this.observeOnOfflineState();
    }

    public goOnline(): void {
        this.store.dispatch(new GoOnline());
    }

    public goOffline(): void {
        this.store.dispatch(new GoOffline());
    }

    public isOffline(): boolean {
        return this.offline;
    }

    private observeOnOfflineState() {
        this.store.pipe(select((state) => state.onOfflineState))
                  .subscribe((state: OnOfflineState) => this.offline = state.isOffline);
    }

}

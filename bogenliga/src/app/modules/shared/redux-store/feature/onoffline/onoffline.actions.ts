import {Action} from '@ngrx/store';

export const GO_OFFLINE = '[OnOffline] Go Offline';
export const GO_ONLINE = '[OnOffline] Go Online';

export class GoOffline implements Action {
    readonly type = GO_OFFLINE;
}

export class GoOnline implements Action {
    readonly type = GO_ONLINE;
}

export type OnOfflineActions = GoOffline | GoOnline;

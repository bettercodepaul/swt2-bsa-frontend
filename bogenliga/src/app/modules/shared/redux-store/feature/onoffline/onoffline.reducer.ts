import * as Actions from './onoffline.actions';
import { OnOfflineState } from './onoffline.state';

export const initialOnOfflineState: OnOfflineState = {
    isOffline: false
};

export function onOfflineReducer(state = initialOnOfflineState, action: Actions.OnOfflineActions): OnOfflineState {
    let newState: OnOfflineState;

    switch (action.type) {
        case Actions.GO_ONLINE:
            newState = {
                ...state,
                isOffline: false
            };
            break;
        case Actions.GO_OFFLINE:
            newState = {
                ...state,
                isOffline: true
            };
            break;
        default:
            // do nothing
            return state;
    }
    console.log('REDUX [OnOfflineReducer] ' + action.type + ' with new state ' + JSON.stringify(newState));
    return newState;
}

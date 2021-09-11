import { Action, Reducer } from 'redux';
import { AppThunkAction } from './';
import * as signalR from "@microsoft/signalr";

// -----------------
// STATE - This defines the type of data maintained in the Redux store.

export interface ClipsState {
    clips: Clip[];
    activeClip: number;
    clipsLoaded: boolean;
}

export interface Clip {
    id: string;
    url: string;
    embededUrl: string;
    broadcasterId: string;
    creatorId: string;
    videoId: string;
    gameId: string;
    language: string;
    title: string;
    viewCount: number;
    createdAt: string;
    thumbnailUrl: string;
    duration: number;
}

// -----------------
// ACTIONS - These are serializable (hence replayable) descriptions of state transitions.
// They do not themselves have any side-effects; they just describe something that is going to happen.

interface RequestClipsAction {
    type: 'REQUEST_CLIPS';
    activeClip: number;
}

interface ReceiveClipsAction {
    type: 'RECEIVE_CLIPS';
    activeClip: number;
    clips: Clip[];
}

// Declare a 'discriminated union' type. This guarantees that all references to 'type' properties contain one of the
// declared type strings (and not any other arbitrary string).
type KnownAction = RequestClipsAction | ReceiveClipsAction;

// -----------------
// ACTION CREATORS - These are functions exposed to the UI components that will trigger a state transition.
// They don't directly mutate state, but they can have external side-effects (such as loading data).

export const actionCreators = {
    requestClips: (activeClip: number): AppThunkAction<KnownAction> => (dispatch, getState) => {
        const appState = getState();

        if (appState) {
            fetch(`twitchwebhooks/getrecentclips`)
                .then(response => response.json() as Promise<Clip[]>)
                .then(data => {
                    dispatch({ type: 'RECEIVE_CLIPS', activeClip: 0, clips: data });
                });

            dispatch({ type: 'REQUEST_CLIPS', activeClip: activeClip })
        }
    }
}

// -----------------
// REDUCER - For a given state and action, returns the new state. To support time travel, this must not mutate the old state.

const startState: ClipsState = { activeClip: 0, clips: [], clipsLoaded: false };

export const reducer: Reducer<ClipsState> = (state: ClipsState | undefined, incomingAction: Action): ClipsState => {
    if (state === undefined) {
        return startState;
    }

    const action = incomingAction as KnownAction;
    switch (action.type) {
        case 'REQUEST_CLIPS':
            return {
                clips: state.clips,
                activeClip: action.activeClip,
                clipsLoaded: false
            };
        case 'RECEIVE_CLIPS':
            return {
                clips: action.clips,
                activeClip: 0,
                clipsLoaded: true
            };
        default:
            // at this point, we'd probably want to loop or something... 
            return state;
    }
};

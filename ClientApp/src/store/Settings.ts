import { Action, Reducer } from 'redux';
import { AppThunkAction } from '.';

// -----------------
// STATE - This defines the type of data maintained in the Redux store.

export interface Settings {
    twitch: {
        channelName: string,
        channelId: string,
        apiSettings: {
            clientId: string,
            secret: string,
            callbackUrl: string
        },
        pubsubSettings: {
            oauth: string
        },
        rewards: string[]
    },
    youtube: {
        channelId: string
    }
}

// -----------------
// ACTIONS - These are serializable (hence replayable) descriptions of state transitions.
// They do not themselves have any side-effects; they just describe something that is going to happen.

interface RequestSettings {
    type: 'REQUEST_SETTINGS';
    settings: Settings;
}

interface SaveSettings {
    type: 'SAVE_SETTINGS';
}

// Declare a 'discriminated union' type. This guarantees that all references to 'type' properties contain one of the 
// declared type strings (and not any other arbitrary string).
type KnownAction = RequestSettings | SaveSettings;

// -----------------
// ACTION CREATORS - These are functions exposed to the UI components that will trigger a state transition.
// They don't directly mutate state, but they can have externam side-effects (such as loading data).

export const actionCreators = {
    requestSettings: (): AppThunkAction<KnownAction> => (dispatch, getState) => {
        const appState = getState();

        if (appState) {
            fetch(`settings`)
                .then(response => response.json() as Promise<Settings>)
                .then(data => {
                    dispatch({ type: 'REQUEST_SETTINGS', settings: data });
                });

            // not sure if I need or want this... 
            // dispatch({ type: 'REQUEST_SETTINGS' });
        }
    },

    saveSettings: (formValues: Settings): AppThunkAction<KnownAction> => (dispatch, getState) => {
        const appState = getState();
        // might have to do a few checks here...
        if (appState) {
            // TODO: Need to figure out my api call
            fetch('settings/savesettings', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(formValues)
            });

            // again, some other dispatch here.. 
            // dispatch({ type: 'SAVE_SETTINGS', });
        }
    }
}

// -----------------
// REDUCER - For a given state and action, returns the new state. To support time travel, this must not mutate the old state.

const startState: Settings = {
    twitch: {
        channelName: "",
        channelId: "",
        apiSettings: {
            clientId: "",
            secret: "",
            callbackUrl: ""
        },
        pubsubSettings: {
            oauth: ""
        },
        rewards: []
    },
    youtube: {
        channelId: ""
    }
};

export const reducer: Reducer<Settings> = (state: Settings | undefined, incomingAction: Action): Settings => {
    if (state === undefined) {
        return startState;
    }

    const action = incomingAction as KnownAction;
    switch (action.type) {
        case 'REQUEST_SETTINGS':
            return {
                twitch: {
                    channelName: action.settings.twitch.channelName,
                    channelId: action.settings.twitch.channelId,
                    apiSettings: {
                        clientId: action.settings.twitch.apiSettings.clientId,
                        secret: action.settings.twitch.apiSettings.secret,
                        callbackUrl: action.settings.twitch.apiSettings.callbackUrl
                    },
                    pubsubSettings: {
                        oauth: action.settings.twitch.pubsubSettings.oauth
                    },
                    rewards: action.settings.twitch.rewards
                },
                youtube: {
                    channelId: action.settings.youtube.channelId
                }
            };
        case 'SAVE_SETTINGS':
            return {
                twitch: {
                    channelName: "",
                    channelId: "",
                    apiSettings: {
                        clientId: "",
                        secret: "",
                        callbackUrl: ""
                    },
                    pubsubSettings: {
                        oauth: ""
                    },
                    rewards: []
                },
                youtube: {
                    channelId: ""
                }
            };
    }
}
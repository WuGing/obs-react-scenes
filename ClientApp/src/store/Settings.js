"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.reducer = exports.actionCreators = void 0;
// -----------------
// ACTION CREATORS - These are functions exposed to the UI components that will trigger a state transition.
// They don't directly mutate state, but they can have externam side-effects (such as loading data).
exports.actionCreators = {
    requestSettings: function () { return function (dispatch, getState) {
        var appState = getState();
        if (appState) {
            fetch("settings")
                .then(function (response) { return response.json(); })
                .then(function (data) {
                dispatch({ type: 'REQUEST_SETTINGS', settings: data });
            });
            // not sure if I need or want this... 
            // dispatch({ type: 'REQUEST_SETTINGS' });
        }
    }; },
    saveSettings: function (formValues) { return function (dispatch, getState) {
        var appState = getState();
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
    }; }
};
// -----------------
// REDUCER - For a given state and action, returns the new state. To support time travel, this must not mutate the old state.
var startState = {
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
var reducer = function (state, incomingAction) {
    if (state === undefined) {
        return startState;
    }
    var action = incomingAction;
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
};
exports.reducer = reducer;
//# sourceMappingURL=Settings.js.map
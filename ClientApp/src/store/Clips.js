"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.reducer = exports.actionCreators = void 0;
// -----------------
// ACTION CREATORS - These are functions exposed to the UI components that will trigger a state transition.
// They don't directly mutate state, but they can have external side-effects (such as loading data).
exports.actionCreators = {
    requestClips: function (activeClip) { return function (dispatch, getState) {
        var appState = getState();
        if (appState) {
            fetch("twitchwebhooks/getrecentclips")
                .then(function (response) { return response.json(); })
                .then(function (data) {
                dispatch({ type: 'RECEIVE_CLIPS', activeClip: 0, clips: data });
            });
            dispatch({ type: 'REQUEST_CLIPS', activeClip: activeClip });
        }
    }; }
};
// -----------------
// REDUCER - For a given state and action, returns the new state. To support time travel, this must not mutate the old state.
var startState = { activeClip: 0, clips: [], clipsLoaded: false };
var reducer = function (state, incomingAction) {
    if (state === undefined) {
        return startState;
    }
    var action = incomingAction;
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
exports.reducer = reducer;
//# sourceMappingURL=Clips.js.map
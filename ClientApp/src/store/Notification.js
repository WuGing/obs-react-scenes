"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.reducer = exports.actionCreators = exports.NotificationType = void 0;
var NotificationType;
(function (NotificationType) {
    NotificationType["none"] = "";
    NotificationType["followed"] = "bi bi-suit-heart-fill";
    NotificationType["gifted"] = "bi bi-gift-fill";
    NotificationType["subscribed"] = "bi bi-star-fill";
    NotificationType["bits"] = "bi bi-gem";
})(NotificationType = exports.NotificationType || (exports.NotificationType = {}));
// -----------------
// ACTION CREATORS - These are functions exposed to the UI components that will trigger a state transition.
// They don't directly mutate state, but they can have external side-effects (such as loading data).
exports.actionCreators = {
    setupNotifications: function () { return function (dispatch, getState) {
        var appState = getState();
        console.log("Starting Notifications");
        // we're able to get an app state (might want to actually set that up here?)
        if (appState) {
            fetch("twitchwebhooks/setuplisteners");
            dispatch({ type: 'REQUEST_STARTUP_NOTIFICATION' });
        }
    }; },
    requestNextNotification: function (currentGroup) { return function (dispatch, getState) {
        var appState = getState();
        // console.log("GroupIndex: " + appState.notification?.groupIndex);
        console.log("CurrentGroup: " + currentGroup);
        // if (appState && appState.notification && appState.notification.groupIndex !== currentGroup) {
        // if any of our groups are empty, then we want to get the most recent notification for each
        console.log("Getting First Notifications");
        // }
    }; }
};
// -----------------
// REDUCER - For a given state and action, returns the new state. To support time travel, this must not mutate the old state.
var startState = { notificationIcon: "", notification: "" };
var reducer = function (state, incomingAction) {
    if (state === undefined) {
        return startState;
    }
    var action = incomingAction;
    switch (action.type) {
        case 'REQUEST_STARTUP_NOTIFICATION':
            return {
                notification: "Startup",
                notificationIcon: ""
            };
        case 'REQUEST_NEXT_NOTIFICATION':
            console.log("REQUEST_NEXT_NOTIFICATION");
            return {
                notification: "",
                notificationIcon: ""
            };
        default:
            // at this point, we'd probably want to loop or something... 
            return {
                notification: "Default",
                notificationIcon: ""
            };
    }
};
exports.reducer = reducer;
//# sourceMappingURL=Notification.js.map
import { Action, Reducer } from 'redux';
import { AppThunkAction } from './';
import * as signalR from "@microsoft/signalr";

// -----------------
// STATE - This defines the type of data maintained in the Redux store.

export interface TwitchNotificationState {
    notificationIcon: string,
    notification: string
}

export interface TwitchNotifications {
    notifications: Array<Array<TwitchNotification>>
}

export enum NotificationType {
    none = '',
    followed = 'bi bi-suit-heart-fill',
    gifted = 'bi bi-gift-fill',
    subscribed = 'bi bi-star-fill',
    bits = 'bi bi-gem'
}

export interface TwitchNotification {
    type: NotificationType,
    username: string,
    info: string,
}

export interface NotificationList {
    type: NotificationType,
    notifications: TwitchNotification[]
}

// -----------------
// ACTIONS - These are serializable (hence replayable) descriptions of state transitions.
// They do not themselves have any side-effects; they just describe something that is going to happen.

interface RequestStartupNotification {
    type: 'REQUEST_STARTUP_NOTIFICATION';
}

interface RequestNextNotification {
    type: 'REQUEST_NEXT_NOTIFICATION';
}

// Declare a 'discriminated union' type. This guarantees that all references to 'type' properties contain one of the
// declared type strings (and not any other arbitrary string).
type KnownAction = RequestStartupNotification | RequestNextNotification;

// -----------------
// ACTION CREATORS - These are functions exposed to the UI components that will trigger a state transition.
// They don't directly mutate state, but they can have external side-effects (such as loading data).

export const actionCreators = {
    setupNotifications: (): AppThunkAction<KnownAction> => (dispatch, getState) => {
        const appState = getState();

        console.log("Starting Notifications");

        // we're able to get an app state (might want to actually set that up here?)
        if (appState) {
            fetch(`twitchwebhooks/setuplisteners`);

            dispatch({ type: 'REQUEST_STARTUP_NOTIFICATION' });
        }
    },

    requestNextNotification: (currentGroup: number): AppThunkAction<KnownAction> => (dispatch, getState) => {
        const appState = getState();

        // console.log("GroupIndex: " + appState.notification?.groupIndex);
        console.log("CurrentGroup: " + currentGroup);


        // if (appState && appState.notification && appState.notification.groupIndex !== currentGroup) {
            // if any of our groups are empty, then we want to get the most recent notification for each
            console.log("Getting First Notifications");
        // }
    }
}

// -----------------
// REDUCER - For a given state and action, returns the new state. To support time travel, this must not mutate the old state.

const startState: TwitchNotificationState = { notificationIcon: "", notification: "" };

export const reducer: Reducer<TwitchNotificationState> = (state: TwitchNotificationState | undefined, incomingAction: Action): TwitchNotificationState => {
    if (state === undefined) {
        return startState;
    }

    const action = incomingAction as KnownAction;
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

import * as React from 'react';
import * as signalR from "@microsoft/signalr";
import * as NotificationStore from '../../store/Notification';
import { AnimateOnChange } from 'react-animation';
import { ApplicationState } from '../../store';
import { connect } from 'react-redux';

import 'bootstrap-icons/font/bootstrap-icons.css';

type TwitchNotificationProps =
    typeof NotificationStore.actionCreators;

class Notification extends React.PureComponent<TwitchNotificationProps, NotificationStore.TwitchNotificationState> {

    // setup for our notification tracking
    notificationArray: [NotificationStore.NotificationList] = [{ type: NotificationStore.NotificationType.none, notifications: [] }];
    currentGroup: number = 0;

    constructor(props: TwitchNotificationProps) {
        super(props);

        // we need a default state set
        this.state = {
            notification: "",
            notificationIcon: ""
        }

        // update notification every 5 seconds
        setInterval(() => {
            this.updateNotificationGroup();
            this.updateCurrentNotification();
        }, 5000);
    }

    public componentDidMount() {
        // need to set up notification handler stuffs
        this.setupNotificationListener();
    }

    public componentWillUnmount() {
        // here, we'll have to save out somehow our most recent notifications
        // that way we'll have them next time
    }

    private updateNotificationGroup() {
        // if we have more than 1 notification type
        if (this.notificationArray.length >= 1) {
            // check if incrementing will lead to an out of bounds
            if (this.currentGroup + 1 > this.notificationArray.length) {
                // reset index
                this.currentGroup = 0;
            }
            // increment group
            else {
                // increment index
                this.currentGroup++;
            }
        }
    }

    private updateCurrentNotification() {
        // attempt getting the current notification group
        let notificationGroup = this.notificationArray[this.currentGroup];

        // if we have a valid notification group (so, we've gotten notis)
        if (notificationGroup !== undefined) {

            // if we have more than one notification queued
            if (notificationGroup.notifications.length > 1) {
                // get the next notification
                let currentNotification = notificationGroup.notifications.shift();

                // technically, we shouldn't ever get here, but setState isn't happy that 'currentNotification' could be undefined
                if (currentNotification == undefined) {
                    console.log("Jim, something broke...");
                    currentNotification = { username: "", type: NotificationStore.NotificationType.none, info: "" }
                }

                // this should only update if we're changing the notification
                this.setState({ notification: currentNotification?.username, notificationIcon: currentNotification?.type });
            }
        }
    }

    private addNewNotification(notification: NotificationStore.TwitchNotification) {
        for (let i: number = 0; i < this.notificationArray.length; i++) {
            if (this.notificationArray[i].type == notification.type) {
                this.notificationArray[i].notifications.push(notification);
                return;
            }
        }

        let newGroup: NotificationStore.NotificationList = {
            type: notification.type,
            notifications: [notification]
        }

        this.notificationArray.push(newGroup);
    }

    // at some point, we're going to have to figure out how to animate all of this... 
    public render() {
        console.log(this.state.notification);

        return (
            <React.Fragment>
                <AnimateOnChange
                    animation="fade">
                    <div className="notificationContainer">
                        <i className={this.state.notificationIcon} />
                        <p className="notificationText">{this.state.notification}</p>
                    </div>
                </AnimateOnChange>
            </React.Fragment >
        )
    }

    private setupNotificationListener() {
        this.props.setupNotifications();

        const connection = new signalR.HubConnectionBuilder()
            .withUrl("/signalr/notifications")
            .withAutomaticReconnect()
            .build();

        /******* Event Handlers *******/
        connection.on("OnFollow", (username: string) => {
            let newFollower: NotificationStore.TwitchNotification = {
                type: NotificationStore.NotificationType.followed,
                username: username,
                info: ""
            }
            // bootstrap "suit-heart-fill" icon
            this.addNewNotification(newFollower);
        });

        connection.on("OnChannelSubscription", (username: string) => {
            let newSubscriber: NotificationStore.TwitchNotification = {
                type: NotificationStore.NotificationType.subscribed,
                username: username,
                info: ""
            }
            // bootstrap "star-fill" icon
            this.addNewNotification(newSubscriber);
        });

        connection.on("OnChannelSubscriptionGifted", (username: string, value: string) => {
            console.log("channelSubscriptionGifted");

            let giftedSubscription: NotificationStore.TwitchNotification = {
                type: NotificationStore.NotificationType.gifted,
                username: username,
                info: ""
            }
            // bootstrap "gift-fill" icon
            this.addNewNotification(giftedSubscription);
        });

        connection.on("OnBitsReceived", (username: string, value: string) => {
            console.log("bitsReceived");

            let newBits: NotificationStore.TwitchNotification = {
                type: NotificationStore.NotificationType.bits,
                username: username,
                info: value
            }
            // bootstrap "gem" icon
            this.addNewNotification(newBits);
        });

        connection.start().catch(err => { document.write(err); console.log(err); });
    }
};

export default connect(
    (state: ApplicationState) => state.notification,
    NotificationStore.actionCreators
)(Notification as any);
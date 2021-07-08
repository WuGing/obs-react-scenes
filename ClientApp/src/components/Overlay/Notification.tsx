import * as React from 'react';
import * as signalR from "@microsoft/signalr";
import * as NotificationStore from '../../store/Notification';
import 'animate.css';
import { ApplicationState } from '../../store';
import { connect } from 'react-redux';

import 'bootstrap-icons/font/bootstrap-icons.css';

type TwitchNotificationProps =
    & typeof NotificationStore.actionCreators;

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
            this.getNextNotificationGroup();
            this.getCurrentNotification();
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

    private getCurrentNotification() {
        let notificationGroup = this.notificationArray[this.currentGroup];

        let currentNotification = notificationGroup.notifications.length > 1 ?
            notificationGroup.notifications.shift() : notificationGroup.notifications[0];

        if (currentNotification == undefined) {
            currentNotification = { type: NotificationStore.NotificationType.none, username: "", info: "" };
        }

        this.setState({ notification: currentNotification?.username, notificationIcon: currentNotification?.type });
    }

    private getNextNotificationGroup() {
        if (this.currentGroup + 1 == this.notificationArray.length) {
            return this.notificationArray[this.currentGroup].notifications;
        }
        else if (this.currentGroup + 1 > this.notificationArray.length) {
            this.currentGroup = 0;
            return this.notificationArray[this.currentGroup].notifications;
        }
        else {
            this.currentGroup++;
            return this.notificationArray[this.currentGroup].notifications;
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
        return (
            <React.Fragment>
                <div className="notificationContainer">
                    <i className={this.state.notificationIcon} />
                    <p className="notificationText">{this.state.notification}</p>
                </div>
            </React.Fragment>
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
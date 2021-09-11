"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
var React = require("react");
var signalR = require("@microsoft/signalr");
var NotificationStore = require("../../store/Notification");
var react_animation_1 = require("react-animation");
var react_redux_1 = require("react-redux");
require("bootstrap-icons/font/bootstrap-icons.css");
var Notification = /** @class */ (function (_super) {
    __extends(Notification, _super);
    function Notification(props) {
        var _this = _super.call(this, props) || this;
        // setup for our notification tracking
        _this.notificationArray = [{ type: NotificationStore.NotificationType.none, notifications: [] }];
        _this.currentGroup = 0;
        // we need a default state set
        _this.state = {
            notification: "",
            notificationIcon: ""
        };
        // update notification every 5 seconds
        setInterval(function () {
            _this.updateNotificationGroup();
            _this.updateCurrentNotification();
        }, 5000);
        return _this;
    }
    Notification.prototype.componentDidMount = function () {
        // need to set up notification handler stuffs
        this.setupNotificationListener();
    };
    Notification.prototype.componentWillUnmount = function () {
        // here, we'll have to save out somehow our most recent notifications
        // that way we'll have them next time
    };
    Notification.prototype.updateNotificationGroup = function () {
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
    };
    Notification.prototype.updateCurrentNotification = function () {
        // attempt getting the current notification group
        var notificationGroup = this.notificationArray[this.currentGroup];
        // if we have a valid notification group (so, we've gotten notis)
        if (notificationGroup !== undefined) {
            // if we have more than one notification queued
            if (notificationGroup.notifications.length > 1) {
                // get the next notification
                var currentNotification = notificationGroup.notifications.shift();
                // technically, we shouldn't ever get here, but setState isn't happy that 'currentNotification' could be undefined
                if (currentNotification == undefined) {
                    console.log("Jim, something broke...");
                    currentNotification = { username: "", type: NotificationStore.NotificationType.none, info: "" };
                }
                // this should only update if we're changing the notification
                this.setState({ notification: currentNotification === null || currentNotification === void 0 ? void 0 : currentNotification.username, notificationIcon: currentNotification === null || currentNotification === void 0 ? void 0 : currentNotification.type });
            }
        }
    };
    Notification.prototype.addNewNotification = function (notification) {
        for (var i = 0; i < this.notificationArray.length; i++) {
            if (this.notificationArray[i].type == notification.type) {
                this.notificationArray[i].notifications.push(notification);
                return;
            }
        }
        var newGroup = {
            type: notification.type,
            notifications: [notification]
        };
        this.notificationArray.push(newGroup);
    };
    // at some point, we're going to have to figure out how to animate all of this... 
    Notification.prototype.render = function () {
        console.log(this.state.notification);
        return (React.createElement(React.Fragment, null,
            React.createElement(react_animation_1.AnimateOnChange, { animation: "fade" },
                React.createElement("div", { className: "notificationContainer" },
                    React.createElement("i", { className: this.state.notificationIcon }),
                    React.createElement("p", { className: "notificationText" }, this.state.notification)))));
    };
    Notification.prototype.setupNotificationListener = function () {
        var _this = this;
        this.props.setupNotifications();
        var connection = new signalR.HubConnectionBuilder()
            .withUrl("/signalr/notifications")
            .withAutomaticReconnect()
            .build();
        /******* Event Handlers *******/
        connection.on("OnFollow", function (username) {
            var newFollower = {
                type: NotificationStore.NotificationType.followed,
                username: username,
                info: ""
            };
            // bootstrap "suit-heart-fill" icon
            _this.addNewNotification(newFollower);
        });
        connection.on("OnChannelSubscription", function (username) {
            var newSubscriber = {
                type: NotificationStore.NotificationType.subscribed,
                username: username,
                info: ""
            };
            // bootstrap "star-fill" icon
            _this.addNewNotification(newSubscriber);
        });
        connection.on("OnChannelSubscriptionGifted", function (username, value) {
            console.log("channelSubscriptionGifted");
            var giftedSubscription = {
                type: NotificationStore.NotificationType.gifted,
                username: username,
                info: ""
            };
            // bootstrap "gift-fill" icon
            _this.addNewNotification(giftedSubscription);
        });
        connection.on("OnBitsReceived", function (username, value) {
            console.log("bitsReceived");
            var newBits = {
                type: NotificationStore.NotificationType.bits,
                username: username,
                info: value
            };
            // bootstrap "gem" icon
            _this.addNewNotification(newBits);
        });
        connection.start().catch(function (err) { document.write(err); console.log(err); });
    };
    return Notification;
}(React.PureComponent));
;
exports.default = react_redux_1.connect(function (state) { return state.notification; }, NotificationStore.actionCreators)(Notification);
//# sourceMappingURL=Notification.js.map
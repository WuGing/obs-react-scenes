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
require("animate.css");
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
            _this.getNextNotificationGroup();
            _this.getCurrentNotification();
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
    Notification.prototype.getCurrentNotification = function () {
        var notificationGroup = this.notificationArray[this.currentGroup];
        var currentNotification = notificationGroup.notifications.length > 1 ?
            notificationGroup.notifications.shift() : notificationGroup.notifications[0];
        if (currentNotification == undefined) {
            currentNotification = { type: NotificationStore.NotificationType.none, username: "", info: "" };
        }
        this.setState({ notification: currentNotification === null || currentNotification === void 0 ? void 0 : currentNotification.username, notificationIcon: currentNotification === null || currentNotification === void 0 ? void 0 : currentNotification.type });
    };
    Notification.prototype.getNextNotificationGroup = function () {
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
        return (React.createElement(React.Fragment, null,
            React.createElement("div", { className: "notificationContainer" },
                React.createElement("i", { className: this.state.notificationIcon }),
                React.createElement("p", { className: "notificationText" }, this.state.notification))));
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
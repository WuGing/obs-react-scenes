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
var Notification_1 = require("./Notification");
var WebCamOverlay = /** @class */ (function (_super) {
    __extends(WebCamOverlay, _super);
    function WebCamOverlay() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    WebCamOverlay.prototype.render = function () {
        return (React.createElement(React.Fragment, null,
            React.createElement("div", { className: "overlay-3x2" },
                React.createElement("div", { className: "notification" },
                    React.createElement(Notification_1.default, null)))));
    };
    return WebCamOverlay;
}(React.PureComponent));
exports.default = WebCamOverlay;
;
//# sourceMappingURL=WebCamOverlay.js.map
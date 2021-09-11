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
var Background_1 = require("./Background");
require("./StreamStarting.scss");
// TODO: If we display relatively the same information on our start, brb, 
// and end pages, then we could simply include a route parameter that would
// allow us to reuse this page, and just change the text
var StreamStarting = /** @class */ (function (_super) {
    __extends(StreamStarting, _super);
    function StreamStarting() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    StreamStarting.prototype.render = function () {
        return (React.createElement(React.Fragment, null,
            React.createElement(Background_1.default, null),
            React.createElement("div", { id: "titleHolder", className: "titleBackground" },
                React.createElement("h1", null, "Stream Starting"))));
    };
    StreamStarting.prototype.renderStatusWindow = function () {
        return (React.createElement("div", null));
    };
    return StreamStarting;
}(React.PureComponent));
exports.default = StreamStarting;
//# sourceMappingURL=StreamStarting.js.map
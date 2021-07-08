"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var React = require("react");
var react_router_1 = require("react-router");
var Layout_1 = require("./components/Layout");
var Home_1 = require("./components/Home");
var WebCamOverlay_1 = require("./components/Overlay/WebCamOverlay");
var FindingMatch_1 = require("./components/FindingMatch");
var Clips_1 = require("./components/Clips");
require("./custom.css");
require("./components/Overlay/Overlay.scss");
exports.default = (function () { return (React.createElement(Layout_1.default, null,
    React.createElement(react_router_1.Route, { exact: true, path: '/', component: Home_1.default }),
    React.createElement(react_router_1.Route, { path: '/overlay/webcamoverlay', component: WebCamOverlay_1.default }),
    React.createElement(react_router_1.Route, { path: '/clips', component: Clips_1.default }),
    React.createElement(react_router_1.Route, { path: '/findingmatch', component: FindingMatch_1.default }))); });
//# sourceMappingURL=App.js.map
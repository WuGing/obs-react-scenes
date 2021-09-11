"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var React = require("react");
var react_router_1 = require("react-router");
/* We can remove these in time */
var Layout_1 = require("./components/Layout");
var Home_1 = require("./components/Home");
/* universal styling */
require("./custom.css");
require("./components/Overlay/Overlay.scss");
/* Stream Status Pages */
var StreamStarting_1 = require("./components/StreamStarting");
/* Overlay pages */
var WebCamOverlay_1 = require("./components/Overlay/WebCamOverlay");
var Background_1 = require("./components/Background");
var Clips_1 = require("./components/Clips");
/* Sample pages*/
var StreamStartingSample_1 = require("./components/StreamStartingSample");
exports.default = (function () { return (React.createElement(Layout_1.default, null,
    React.createElement(react_router_1.Route, { exact: true, path: '/', component: Home_1.default }),
    React.createElement(react_router_1.Route, { path: '/overlay/webcamoverlay', component: WebCamOverlay_1.default }),
    React.createElement(react_router_1.Route, { path: '/clips', component: Clips_1.default }),
    React.createElement(react_router_1.Route, { path: '/background', component: Background_1.default }),
    React.createElement(react_router_1.Route, { path: '/streamstarting', component: StreamStarting_1.default }),
    React.createElement(react_router_1.Route, { path: '/sample/streamstartingsample', component: StreamStartingSample_1.default }))); });
//# sourceMappingURL=App.js.map
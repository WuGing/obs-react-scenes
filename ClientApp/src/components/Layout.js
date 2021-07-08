"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var React = require("react");
var react_router_1 = require("react-router");
var NavMenu_1 = require("./NavMenu");
exports.default = (function (props) { return (React.createElement(React.Fragment, null,
    React.createElement(react_router_1.Route, { exact: true, path: '/', component: NavMenu_1.default }),
    props.children)); });
//# sourceMappingURL=Layout.js.map
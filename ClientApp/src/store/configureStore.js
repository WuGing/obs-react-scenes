"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __spreadArray = (this && this.__spreadArray) || function (to, from) {
    for (var i = 0, il = from.length, j = to.length; i < il; i++, j++)
        to[j] = from[i];
    return to;
};
Object.defineProperty(exports, "__esModule", { value: true });
var redux_1 = require("redux");
var redux_thunk_1 = require("redux-thunk");
var connected_react_router_1 = require("connected-react-router");
var _1 = require("./");
function configureStore(history, initialState) {
    var middleware = [
        redux_thunk_1.default,
        connected_react_router_1.routerMiddleware(history)
    ];
    var rootReducer = redux_1.combineReducers(__assign(__assign({}, _1.reducers), { router: connected_react_router_1.connectRouter(history) }));
    var enhancers = [];
    var windowIfDefined = typeof window === 'undefined' ? null : window;
    if (windowIfDefined && windowIfDefined.__REDUX_DEVTOOLS_EXTENSION__) {
        enhancers.push(windowIfDefined.__REDUX_DEVTOOLS_EXTENSION__());
    }
    return redux_1.createStore(rootReducer, initialState, redux_1.compose.apply(void 0, __spreadArray([redux_1.applyMiddleware.apply(void 0, middleware)], enhancers)));
}
exports.default = configureStore;
//# sourceMappingURL=configureStore.js.map
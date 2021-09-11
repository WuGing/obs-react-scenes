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
var ClipsStore = require("../store/Clips");
var react_redux_1 = require("react-redux");
var Clips = /** @class */ (function (_super) {
    __extends(Clips, _super);
    function Clips(props) {
        var _this = _super.call(this, props) || this;
        _this.state = { activeClip: 0, clips: [], clipsLoaded: false };
        return _this;
    }
    Clips.prototype.componentDidMount = function () {
        this.ensureClipsFetched();
    };
    Clips.prototype.componentDidUpdate = function () {
        this.ensureClipsFetched();
    };
    Clips.prototype.ensureClipsFetched = function () {
        // anything that we might need for requesting clips (date range, etc)
        this.props.requestClips(this.state.activeClip);
    };
    Clips.prototype.render = function () {
        return (React.createElement(React.Fragment, null, this.renderClipWindow()));
    };
    Clips.prototype.renderClipWindow = function () {
        var clip = this.props.clips[this.props.activeClip];
        var embededUrl = clip.embededUrl + "&autoplay=true";
        return (React.createElement("iframe", { src: embededUrl, frameBorder: "0", scrolling: "no", height: "720", width: "1280", onLoad: this.loaded }));
    };
    // setup loading the next clip
    Clips.prototype.loaded = function () {
        var _this = this;
        console.log(this.props.clips);
        // start a timer
        var newClipIndex = this.props.activeClip + 1 <= this.props.clips.length ? this.props.activeClip + 1 : 0;
        // get the duration of the clip - probably need to convert this to milliseconds
        var currentClipLength = this.props.clips[this.state.activeClip].duration * 100;
        // just before the end of the clip, we want to change the state. This will hopefully result in the next video loading... 
        setTimeout(function () { return _this.setState({ activeClip: newClipIndex }); }, currentClipLength - 500);
    };
    return Clips;
}(React.PureComponent));
;
exports.default = react_redux_1.connect(function (state) { return state.clip; }, // Selects which state properties are merged into the component's props
ClipsStore.actionCreators // Selects which action creators are merged into the component's props
)(Clips);
//# sourceMappingURL=Clips.js.map
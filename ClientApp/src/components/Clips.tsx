import * as React from 'react';
import * as ClipsStore from '../store/Clips';
import { ApplicationState } from '../store';
import * as signalR from "@microsoft/signalr";
import { connect } from 'react-redux';

type ClipsProps =
    ClipsStore.ClipsState
    & typeof ClipsStore.actionCreators;

class Clips extends React.PureComponent<ClipsProps, ClipsStore.ClipsState> {

    constructor(props: ClipsProps) {
        super(props);
        this.state = { activeClip: 0, clips: [], clipsLoaded: false }
    }

    public componentDidMount() {
        this.ensureClipsFetched();
    }

    public componentDidUpdate() {
        this.ensureClipsFetched();
    }

    private ensureClipsFetched() {
        // anything that we might need for requesting clips (date range, etc)
        this.props.requestClips(this.state.activeClip);
    }

    public render() {
        return (
            <React.Fragment>
                {this.renderClipWindow()}
            </React.Fragment>
        );
    }

    private renderClipWindow() {
        var clip = this.props.clips[this.props.activeClip];
        var embededUrl = clip.embededUrl + "&autoplay=true";

        return (
            <iframe src={embededUrl} frameBorder="0" scrolling="no" height="720" width="1280" onLoad={this.loaded} />
        )
    }

    // setup loading the next clip
    private loaded() {
        console.log(this.props.clips);

        // start a timer
        var newClipIndex = this.props.activeClip + 1 <= this.props.clips.length ? this.props.activeClip + 1 : 0;
        // get the duration of the clip - probably need to convert this to milliseconds
        var currentClipLength = this.props.clips[this.state.activeClip].duration * 100;
        // just before the end of the clip, we want to change the state. This will hopefully result in the next video loading... 
        setTimeout(() => this.setState({activeClip: newClipIndex}), currentClipLength - 500);
    }
};

export default connect(
    (state: ApplicationState) => state.clip,    // Selects which state properties are merged into the component's props
    ClipsStore.actionCreators                   // Selects which action creators are merged into the component's props
)(Clips as any);
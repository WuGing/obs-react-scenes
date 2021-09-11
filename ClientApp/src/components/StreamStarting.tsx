import * as React from 'react';
import Background from './Background';

import './StreamStarting.scss';

// TODO: If we display relatively the same information on our start, brb, 
// and end pages, then we could simply include a route parameter that would
// allow us to reuse this page, and just change the text
export default class StreamStarting extends React.PureComponent {

    public render() {
        return (
            <React.Fragment>
                <Background />

                <div id="titleHolder" className="titleBackground">
                    <h1>Stream Starting</h1>
                </div>
            </React.Fragment>
        )
    }

    private renderStatusWindow() {
        return (
            <div>
            </div>
        )
    }
}
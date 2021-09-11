import * as React from 'react';

import './StreamStarting.scss';

export default class StreamStarting extends React.PureComponent {
    public render() {
        return (
            <React.Fragment>
                <div className="background" />
                <div className="infinity" />
                <div className="bars" />
            </React.Fragment>
        )
    }
}
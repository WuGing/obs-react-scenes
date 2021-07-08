import * as React from 'react';
import Notification from './Notification';

export default class WebCamOverlay extends React.PureComponent {
    public render() {
        return (
            <React.Fragment>
                <div className="overlay-3x2">
                    <div className="notification">
                        <Notification />
                    </div>
                </div>
            </React.Fragment>
        );
    }
};
import * as React from 'react';
import { Route } from 'react-router';

/* We can remove these in time */
import Layout from './components/Layout';
import Home from './components/Home';

/* universal styling */
import './custom.css'
import './components/Overlay/Overlay.scss';

/* Stream Status Pages */
import StreamStarting from './components/StreamStarting';

/* Overlay pages */
import WebCamOverlay from './components/Overlay/WebCamOverlay';
import Background from './components/Background';
import Clips from './components/Clips';

/* Sample pages*/
import StreamStartingSample from './components/StreamStartingSample';

export default () => (
    <Layout>
        <Route exact path='/' component={Home} />
        <Route path='/overlay/webcamoverlay' component={WebCamOverlay} />
        <Route path='/clips' component={Clips} />
        <Route path='/background' component={Background} />
        <Route path='/streamstarting' component={StreamStarting} />
        <Route path='/sample/streamstartingsample' component={StreamStartingSample} />
    </Layout>
);

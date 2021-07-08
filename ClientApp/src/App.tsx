import * as React from 'react';
import { Route } from 'react-router';
import Layout from './components/Layout';
import Home from './components/Home';
import WebCamOverlay from './components/Overlay/WebCamOverlay';
import FindingMatch from './components/FindingMatch';
import Clips from './components/Clips';

import './custom.css'
import './components/Overlay/Overlay.scss';

export default () => (
    <Layout>
        <Route exact path='/' component={Home} />
        <Route path='/overlay/webcamoverlay' component={WebCamOverlay} />
        <Route path='/clips' component={Clips} />
        <Route path='/findingmatch' component={FindingMatch} />
    </Layout>
);

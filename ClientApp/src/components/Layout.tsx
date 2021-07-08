import * as React from 'react';
import { Route } from 'react-router';
import NavMenu from './NavMenu';

export default (props: { children?: React.ReactNode }) => (
    <React.Fragment>
        <Route exact path={'/'} component={NavMenu} />
        {props.children}
    </React.Fragment>
);

import React from 'react';
import { Router, Route } from 'react-router';
import { history } from 'react-router/lib/HashHistory';

import App from './components/app';
import Content from './components/content';
import Viewer from './components/viewer';


React.render((
    <Router history={history}>
        <Route path="/" component={App}>
            <Route path="/" component={Content}>
                <Route path="/:id" component={Viewer} onLeave={(nextState, transition) => { console.log(nextState.params); }} />
            </Route>
        </Route>
    </Router>
), document.getElementById('app'));

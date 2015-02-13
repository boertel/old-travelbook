var React = require('react'),
    Router = require('react-router'),
    App = require('./views/app'),
    Trip = require('./views/trip');

var Route = Router.Route,
    DefaultRoute = Router.DefaultRoute;


/*jshint ignore:start */
var routes = (
    <Route handler={App} path="/">
        <DefaultRoute handler={Trip} />
        <Route name="picture" handler={Trip} path=":index" />
    </Route>
);

Router.run(routes, function (Handler) {
    React.render(<Handler />, document.body);
});
/*jshint ignore:end */

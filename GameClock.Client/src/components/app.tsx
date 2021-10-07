import * as React from "react";
import { Route, Switch, Redirect } from "react-router-dom";
import { hot } from "react-hot-loader";

import { Provider } from "react-redux";
import { ApplicationState } from "../redux";
import { Store } from "redux";
import { History } from "history";
import { ConnectedRouter } from "connected-react-router";

import DefaultWrapper from "./wrapper/default";
import Login from "../views/login";
import Rooms from "../views/rooms";
import Room from "../views/room";
import CreateRoom from "../views/create-room";
import Game from "../views/game";

interface MainProps {
  store: Store<ApplicationState>;
  history: History;
}

const App: React.FC<MainProps> = ({ store, history }) => {
  return (
    <Provider store={store}>
      <ConnectedRouter history={history}>
        <DefaultWrapper>
          <Switch>
            <Route exact path="/" render={() => (<Redirect to={'/login'} />)} />
            <Route path="/login" component={Login} />
            <Route path="/rooms" component={Rooms} />
            <Route path="/room/:name" component={Room} />
            <Route path="/create-room" component={CreateRoom} />
            <Route path="/game/:name" component={Game} />
            <Route
              render={({ location }) => (
                <div>
                  <div>404</div>
                  <div>{location.pathname} page not found!</div>
                </div>
              )}
            />
          </Switch>
        </DefaultWrapper>
      </ConnectedRouter>
    </Provider>
  );
};

declare let module: Record<string, unknown>;
export default hot(module)(App);

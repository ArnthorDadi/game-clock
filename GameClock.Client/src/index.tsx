import * as React from "react";
import { render } from "react-dom";

import App from "./components/app";
import { BrowserRouter } from "react-router-dom";

import { createBrowserHistory } from "history";
import configureStore from "./configureStore";

import './style.scss';

const history = createBrowserHistory();

const initialState: any = {};
const store = configureStore(history, initialState);

render(
  <BrowserRouter>
    <App store={store} history={history} />
  </BrowserRouter>,
  document.getElementById("root")
);

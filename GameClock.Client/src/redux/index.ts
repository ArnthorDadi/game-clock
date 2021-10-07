import { combineReducers } from "redux";
import { connectRouter } from "connected-react-router";

import { History } from "history";

import { userReducer } from "./user/reducers";
import { roomReducer } from "./rooms/reducers";
import { roomsState, userState } from "../common-types/types";
import { RouterState } from "connected-react-router";

export interface ApplicationState {
  user: userState;
  rooms: roomsState;
  router: RouterState;
}

export const createRootReducer = (history: History) =>
  combineReducers({
    user: userReducer,
    rooms: roomReducer,
    router: connectRouter(history),
  });

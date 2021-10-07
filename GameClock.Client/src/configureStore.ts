import { Store, createStore, applyMiddleware } from "redux";
import thunk from "redux-thunk";
import { routerMiddleware } from "connected-react-router";
import { History } from "history";
import { ApplicationState, createRootReducer } from "./redux";

export default function configureStore(
  history: History,
  initialState: ApplicationState
): Store<ApplicationState> {
  const store = createStore(
    createRootReducer(history),
    initialState,
    applyMiddleware(routerMiddleware(history), thunk)
  );
  return store;
}

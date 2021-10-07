import { UserActionTypes, User } from "../../../common-types/types";

import { ActionCreator, Action, Dispatch } from "redux";
import { ThunkAction } from "redux-thunk";

import { ApplicationState } from "../../index";

export const setUsername: ActionCreator<
  ThunkAction<void, ApplicationState, User, Action<string>>
> = (rooms) => {
  return (dispatch: Dispatch): Action => {
    return dispatch({
      type: UserActionTypes.SET_USERNAME,
      payload: rooms,
    });
  };
};

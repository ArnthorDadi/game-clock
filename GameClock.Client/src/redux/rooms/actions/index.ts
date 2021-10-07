import { RoomActionTypes, Rooms } from "../../../common-types/types";

import { ActionCreator, Action, Dispatch } from "redux";
import { ThunkAction } from "redux-thunk";

import { ApplicationState } from "../../index";

export const addRooms: ActionCreator<
  ThunkAction<void, ApplicationState, Rooms, Action<string>>
> = (rooms) => {
  return (dispatch: Dispatch): Action => {
    return dispatch({
      type: RoomActionTypes.ADD_ROOMS,
      payload: rooms,
    });
  };
};

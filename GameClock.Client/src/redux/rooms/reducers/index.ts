import { Reducer } from "redux";
import { RoomActionTypes, roomsState } from "../../../common-types/types";

export const initialState: roomsState = {
  rooms: {},
};

const reducer: Reducer<roomsState> = (state = initialState, action) => {
  switch (action.type) {
    case RoomActionTypes.ADD_ROOMS:
      return {
        rooms: action.payload,
      };
    default: {
      return state;
    }
  }
};

export { reducer as roomReducer };

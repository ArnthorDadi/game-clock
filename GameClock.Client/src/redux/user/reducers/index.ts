import { Reducer } from "redux";
import { UserActionTypes, userState } from "../../../common-types/types";

export const initialState: userState = {
  Username: "",
};

const reducer: Reducer<userState> = (state = initialState, action) => {
  switch (action.type) {
    case UserActionTypes.SET_USERNAME:
      return {
        Username: action.payload,
      };
    default: {
      return state;
    }
  }
};

export { reducer as userReducer };

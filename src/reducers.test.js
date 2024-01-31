import reducer from "./reducers";
import initialState from "./state";
import { GET_USERS, GET_USERS_SUCCESS } from "./actions";

describe("Reducer", () => {
  it("should return the initial state", () => {
    expect(reducer(undefined, {})).toEqual(initialState);
  });

  it("should handle GET_USERS action", () => {
    const action = { type: GET_USERS };
    const state = reducer(undefined, action);
    expect(state.isLoading).toBe(true);
  });

  it("should handle GET_USERS_SUCCESS action", () => {
    const usersData = [{ id: 1, name: "John" }];
    const action = { type: GET_USERS_SUCCESS, users: usersData };
    const state = reducer(undefined, action);

    expect(state.isLoading).toBe(false);
    expect(state.users).toEqual(usersData);
  });

  it("should handle unknown action type", () => {
    const action = { type: "UNKNOWN_ACTION" };
    const state = reducer(undefined, action);
    expect(state).toEqual(initialState);
  });
});

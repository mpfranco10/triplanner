const initialState = {
  user: {},
};

export function userReducer(state = initialState, action) {
  if (action.type === "user/userChanged") {
    return { ...state, user: action.payload };
  }
  return state;
}

export const userChanged = (user) => ({
  type: "user/userChanged",
  payload: user,
});

// selectors
export const getUser = (state) => state.user.user;
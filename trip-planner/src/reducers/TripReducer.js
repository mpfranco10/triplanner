const initialState = {
    selectedTrip: {},
};

export function tripReducer(state = initialState, action) {
    if (action.type === "trip/selectedChanged") {
        return { ...state, selectedTrip: action.payload };
    }
    return state;
}

/* // action creators
export function updateCurrencyCode(currencyCode = initialState.currencyCode) {
  return (dispatch, getState) => {
    const state = getState();
    const symbols = getSupportedSymbols(state);
    dispatch({ type: "rate/currencyCodeUpdated", payload: currencyCode });
    getExchangeRates(currencyCode, symbols).then((rates) => {
      dispatch({ type: "rate/updateRates", payload: rates });
    });
  };
} */

export const selectedTripChanged = (trip) => ({
    type: "trip/selectedChanged",
    payload: trip,
});

// selectors
export const getSelectedTrip = (state) => state.trip.selectedTrip;
/* export const getAmount = (state) => state.rate.amount;
export const getSupportedSymbols = (state) => state.rate.supportedSymbols;
export const getRates = (state) => state.rate.rates; */
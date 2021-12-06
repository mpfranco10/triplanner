import { createStore, combineReducers, applyMiddleware } from "redux";
import thunk from "redux-thunk";
import { persistStore, persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage';

import { tripReducer } from "./reducers/TripReducer";
import { userReducer } from "./reducers/UserReducer";

const rootReducer = combineReducers({
    trip: tripReducer,
    user: userReducer,
});

const persistConfig = {
    key: 'root',
    storage,
};

const persistedReducer = persistReducer(persistConfig, rootReducer)


function configureStore(initialState = {}) {
    let store = createStore(persistedReducer, applyMiddleware(thunk));
    let persistor = persistStore(store, null, () => {
        // if you want to get restoredState
        //console.log("restoredState", store.getState());
    });
    return { store, persistor }
}

export default configureStore;

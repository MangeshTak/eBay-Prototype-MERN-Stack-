import {combineReducers} from 'redux';
import authReducer from './auth';
import listingsReducer from './listings';
import profileReducer from './profile';
import citiesReducer from './cities';

const rootReducer = combineReducers({
    // short hand property names
    authReducer,
    listingsReducer,
    profileReducer,
    citiesReducer
})

export default rootReducer;

import { combineReducers } from 'redux';

import authReducer from './authReducer';
import errorReducer from './errorReducer';
import userReducer from './userReducer';
import newsReducer from './newsReducer';

export default combineReducers({
    authReducer,
    errorReducer,
    newsReducer,
    userReducer
});
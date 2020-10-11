import jwtDecode from 'jwt-decode';
import setAuthToken from '../setAuthToken';
import {
  INDICATE_NO_ERRORS,
  GET_ERRORS,
  SET_CURRENT_USER
} from './actionTypes';

import Axios from '../constants/constants';

export const registerUser = user => (dispatch) => {
  Axios
    .post('/users/signup', user)
    .then((res) => {
      dispatch({
        type: INDICATE_NO_ERRORS,
        payload: {
          success: true
        }
      });
    })
    .catch((err) => {
      dispatch({
        type: GET_ERRORS,
        payload: err.response.data
      });
    });
};

export const loginUser = user => (dispatch) => {
  Axios
    .post('/users/login', user)
    .then((res) => {
      const { token } = res.data;
      localStorage.setItem('jwtToken', token);
      setAuthToken(token);
      dispatch(setCurrentUser(token));
    })
    .catch((err) => {
      dispatch({
        type: GET_ERRORS,
        payload: err.response.data
      });
    });
};

// export const setCurrentUser = token => (dispatch) => {
//   Axios
//     .get('/users/me', 
//         { 
//           headers: {"Authorization" : `${token}`} 
//         }
//         )
//     .then(res => {
//       console.log('Set current user action', res.data.record1)
//       dispatch({
//         type: SET_CURRENT_USER,
//         payload: {
//           user: res.data.record1,
//           token: token
//         }
//       });
//   })   
// };
export const setCurrentUser = decoded => ({
  type: SET_CURRENT_USER,
  payload: decoded
});

export const logoutUser = () => (dispatch) => {
    localStorage.removeItem('jwtToken');
    setAuthToken(false);
    dispatch(setCurrentUser({}));
    //window.location.href = '/users/login';
  };
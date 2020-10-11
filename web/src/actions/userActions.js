import { REPORT_INCIDENT,
         GET_USER 
} from '../actions/actionTypes';
import Axios from '../constants/constants';
import { toaster } from 'evergreen-ui';

export const report_incident = (form) => dispatch => {
    Axios
    .post('/incident/add', 
        form
    ,
    { headers: {"Authorization": localStorage.getItem('jwtToken')}}
    )
        .then(res => {
            toaster.success('Your incident has been reported')
            window.location.href = '#/'
            dispatch({
                type: REPORT_INCIDENT,
                payload: res.data,
            })
        })
        .catch(err => {
            toaster.danger('Incident cannot be reported!')
            dispatch({
                type: REPORT_INCIDENT,
                payload: {
                    form: null
                },
                visible: false,
                disabled: false
            })
        })
    
}

export const getUser = userId => async (dispatch) => {
    const result = await Axios.get(`/users/${userId}`);
    console.log(result)
    return dispatch({
      type: GET_USER,
      payload: result.data
    });
  };
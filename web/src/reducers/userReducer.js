import { REPORT_INCIDENT, 
         GET_USER 
} from '../actions/actionTypes';

const initialState = {
    form: {},
    currUser: {},
    visible: false,
    disabled: false
  };

export default function (state = initialState, action) {
    switch(action.type) {
        case REPORT_INCIDENT: {
          console.log('This is REPORT_INCIDENT userReducer', action)
          return {
            ...state,
            form: action.payload.form,
            visible: false,
            disabled: false
          };
          };
        case GET_USER:
          return {
            ...state,
            currUser: action.payload
          };
        default:
          return state
    }
}
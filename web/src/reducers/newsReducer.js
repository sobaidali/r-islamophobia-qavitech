import {
    GET_NEWS,
    CREATE_NEWS,
    EDIT_NEWS,
    DELETE_NEWS,
  } from '../actions/actionTypes';
  
  import update from 'immutability-helper';

  const initialState = {
    news: [],
    visible: false,
    disabled: false
};

  export default (state = initialState, action) => {
    switch (action.type) {
      case GET_NEWS:
        console.log('I am at GET_NEWS newsReducer', state)
        return {
          ...initialState,
          news: action.payload.news
        };
        break;
      case CREATE_NEWS: 
        console.log('This is CREATE_NEWS newsReducer')
        return {
          ...state,
          news: 
            {
              title: action.payload.title,
              news_body: action.payload.newsbody
            },
          visible: false,
          disabled: false,
            ...state.news          
        };
        break;
      case EDIT_NEWS: 
        console.log('This is Edit_NEWS newsReducer', action.payload)
        return {
          ...state,
          news: 
             {
               title: action.payload.title,
               news_body: action.payload.news_body
             },
             ...state.news
         }
         break;
      case DELETE_NEWS: 
        console.log('del state.news', state.news)
        console.log('del state.news.news', state.news.news)
        return {
          ...state,
          news: state.news.filter(({ _id }) => _id !== action.id),
        };
        break;
      default:
        return state;
    }
  };
  
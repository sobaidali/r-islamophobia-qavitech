import Axios from '../constants/constants';
import {
    GET_NEWS,
    CREATE_NEWS,
    EDIT_NEWS,
    DELETE_NEWS,
  } from './actionTypes';

import { toaster } from 'evergreen-ui'

export const getNews = (page) => dispatch =>
  Axios
    .get(`/news/list?numberOfNews=5&pageNumber=${page}`)
    .then(res =>
        dispatch({
            type: GET_NEWS,
            payload: res.data
        }));

export const createNews = (title, newsbody) => dispatch =>
  Axios
    .post('/news/add', {
      title,
      newsbody
    },
    {
      headers: {"Authorization" : localStorage.getItem('jwtToken')}
    }
    )
    .then(res => {
      toaster.success('News is posted.')
      window.location = '#/news/list'
      
      dispatch({
        type: CREATE_NEWS,
        payload: res.data
      })
    })
    .catch(err => {
      toaster.danger('News cannot be posted!')
      dispatch({
        type: CREATE_NEWS,
        payload: {
          title: null,
          newsbody: null
        },
        visible: false,
        disabled: false
      })
    });

export const editNews = (title, newsbody, newsid) => dispatch =>
  Axios
    .post(`/news/edit`, { 
      title, 
      newsbody, 
      newsid 
    }, 
    {
      headers: {"Authorization": localStorage.getItem('jwtToken')}
    }
    )
      .then(res =>
        dispatch({
            type: EDIT_NEWS,
            payload: res.data.updatednews
        }));

export const deleteNews = id => dispatch =>
  Axios
    .post(`/news/remove?newsid=${id}`, {},
    {
      headers: {"Authorization": localStorage.getItem('jwtToken')}
    }
    )
    .then(res =>
        dispatch({
          type: DELETE_NEWS,
          id
        }));
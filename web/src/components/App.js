import React, {useEffect} from 'react';

import 'bootstrap/dist/css/bootstrap.min.css';

import '../App.css';

import { loadReCaptcha } from 'react-recaptcha-google'

import AppWithRouter from './AppWithRouter';

const App = () => {
    useEffect(() => {
        // Update the document title using the browser API
        loadReCaptcha()
      });
    return ( 
        <AppWithRouter/>
    )
};

export default App;


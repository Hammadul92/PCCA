import React from 'react';
import ReactDOM from 'react-dom';
import App from './Components/App';

import {BrowserRouter} from 'react-router-dom';


const app = (
    <BrowserRouter><App/></BrowserRouter>
);

ReactDOM.render(app, document.querySelector('#root'));

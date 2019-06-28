import React from 'react';
import ReactDOM from 'react-dom';
import App from './Components/App';

import {BrowserRouter} from 'react-router-dom';
import {Provider} from 'react-redux';
import {createStore} from 'redux';
import reducer from './store/reducer';

function saveToLocalStorage(state){
    try{
        const serializedState = JSON.stringify(state);
        localStorage.setItem('state',serializedState);

    } catch(e){
        console.log(e);
    }
}

function loadToLocalStorage(){
    try{
        const serializedState = localStorage.getItem('state');
        if(serializedState ===null) return undefined;
        return JSON.parse(serializedState);

    } catch(e){
        console.log(e);
        return undefined;
    }
}

const persistedState = loadToLocalStorage();

const store = createStore(reducer,persistedState);

store.subscribe(()=> saveToLocalStorage(store.getState()));

const app = (

    <Provider store={store}>
        <BrowserRouter>
            <App/>
        </BrowserRouter>
    </Provider>
);

ReactDOM.render(app, document.querySelector('#root'));

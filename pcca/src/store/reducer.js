import * as actionTypes from './actions';

const initialState = {
    loggedin: false,
    token: null,
    message: null

};

const reducer = (state = initialState,action) => {
    switch(action.type){
        case actionTypes.LOGGED_IN:
            return {
                loggedin: true,
                token: action.token,
                //message: [action.message]


            };

        case actionTypes.LOGGED_OUT:
            return {
                loggedin: false,
                token: null,
                message: null

            };
        default:
            return state;
    }

};

export default reducer;
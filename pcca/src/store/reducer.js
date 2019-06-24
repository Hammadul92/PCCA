import * as actionTypes from './actions';

const initialState = {
    loggedin: false,
    token: null,
    message: null,
    user: null

};

const reducer = (state = initialState, action) => {
    switch(action.type){
        case actionTypes.LOGGED_IN:
            return {
                loggedin: true,
                token: action.payload.token,
                user: action.payload.user
    
            };

        case actionTypes.LOGGED_OUT:
            return {
                loggedin: false,
                token: null,
                message: null,
                user: null

            };
        default:
            return state;
    }

};

export default reducer;
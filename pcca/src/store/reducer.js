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
                ...state,
                loggedin: true,
                token: action.payload.token,
                user: action.payload.user
    
            };

        case actionTypes.LOGGED_OUT:
            return {
                ...state,
                loggedin: false,
                token: null,
                message: null,
                user: null

            };
        case actionTypes.SIGNED_UP:
            return{
                ...state,
                message: action.message
    
                };

            
        default:
            return state;
    }

};

export default reducer;
import * as actionTypes from './actions';

const initialState = {
    loggedin: false,
    token: null,
    message: null,
    user: null,
    tickets: []

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
        case actionTypes.ADD_CART:
                return{
                    ...state,
                    tickets: state.tickets.concat(action.newItem)
        
                    };
    
            
        default:
            return state;
    }

};

export default reducer;
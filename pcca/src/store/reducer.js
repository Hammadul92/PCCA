import * as actionTypes from './actions';

const initialState = {
    loggedin: false,
    token: null,
    message: null,
    user: null,
    phone: null,
    firstname: null,
    lastname: null,
    tickets: []

};

const reducer = (state = initialState, action) => {
    switch(action.type){
        case actionTypes.LOGGED_IN:
            return {
                ...state,
                loggedin: true,
                token: action.payload.token,
                user: action.payload.user,
                firstname: action.payload.firstname,
                lastname: action.payload.lastname,
                phone: action.payload.phone
            };

        case actionTypes.LOGGED_OUT:
            return {
                ...state,
                loggedin: false,
                token: null,
                message: null,
                user: null,
                firstname: null,
                lastname: null,
                phone: null,

            };
            
        case actionTypes.FLASH_MESSAGE:
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
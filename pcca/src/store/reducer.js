import * as actionTypes from './actions';

const initialState = {
    userID: null,
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
                userID: action.payload.userID,
                loggedin: true,
                token: action.payload.token,
                user: action.payload.user,
                firstname: action.payload.firstname,
                lastname: action.payload.lastname,
                phone: action.payload.phone,
                tickets: []
            };

        case actionTypes.LOGGED_OUT:
            return {
                ...state,
                userID: null,
                loggedin: false,
                token: null,
                message: null,
                user: null,
                firstname: null,
                lastname: null,
                phone: null,
                tickets: []

            };

        case actionTypes.FLASH_MESSAGE:
            return{
                ...state,
                message: action.message
            };

        case actionTypes.UPDATE_USER:
            return{
                ...state,
                loggedin: true,
                user: action.payload.email,
                firstname: action.payload.firstname,
                lastname: action.payload.lastname,
                phone: action.payload.phone
            };

        case actionTypes.ADD_CART:
            return{
                ...state,
                tickets: action.payload      
            };
        case actionTypes.REMOVE_CART:
            return{
                ...state,
                tickets: action.payload
            };

        default:
            return state;
    }

};

export default reducer;
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
                //console.log('RECIEVED DATA',action.payload);
            return{
                ...state,
                userID: action.payload.userID,
                loggedin: true,
                token: action.payload.token,
                user: action.payload.email,
                firstname: action.payload.firstname,
                lastname: action.payload.lastname,
                phone: action.payload.phone
                };
        case actionTypes.ADD_CART:
                //console.log('Current Cart DATA',action.newItem, 'Current Cart Redux:', state.tickets);
                return{
                    ...state,
                    tickets: state.tickets.concat(action.newItem)
        
                    };
        case actionTypes.REMOVE_CART:
            console.log('Current Cart Redux:', action.payload);
            return{
                ...state,
                tickets: action.payload
    
                };

        default:
            return state;
    }

};

export default reducer;
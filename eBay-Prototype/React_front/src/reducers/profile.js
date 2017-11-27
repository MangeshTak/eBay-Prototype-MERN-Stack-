import initialState from './initialState';

const reducer = (state = initialState, action) => {
    switch (action.type) {
        case "USER_UPDATE_SUCCESS" :
            return {...state,userUpdateSuccess:true};
        case "USER_UPDATE_FAILURE" :
            return {...state,userUpdateSuccess:false};
        default :
            return state;
    }
};

export default reducer;

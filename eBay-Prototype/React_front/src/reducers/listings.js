import initialState from './initialState';

const reducer = (state = initialState, action) => {
    switch (action.type) {
        case "GET_LISTINGS_SUCCESS" :
            return {
                ...state,
                listings : action.payload
            };
        case "GET_LISTINGS_FAILURE" :
            return {
                ...state
            };
        case "CLEAR_LISTINGS_FROM_STORE" :
            return {
                ...state,
                listings : []
            };
        case "MAKE_BOOKING_SUCCESS" :
           return {
             ...state,
             bookingSuccess: true
           }
        case "RESET_SUCCESS_BOOKING_FLAG" :
            return {
              ...state,
              bookingSuccess: null
            }
        case "MAKE_BOOKING_FAILURE" :
            return {
              ...state,
              bookingSuccess: false
            }
        default :
            return state;
    }
};

export default reducer;

import * as api from '../api/booking';

export function makeBooking(payload) {
    return function(dispatch) {
        return api.makeBooking(payload, function(error , response){
            if(error){
                dispatch({type: "MAKE_BOOKING_FAILURE" });
            } else {
                response.then((res) => {
                    if(res.status === 200){
                        dispatch({type: "MAKE_BOOKING_SUCCESS"});
                    }else{
                        dispatch({type: "MAKE_BOOKING_FAILURE" });
                    }
                })
            }
        })
    };
}

export function resetSuccessBookingFlag(payload) {
  return {
    type: 'RESET_SUCCESS_BOOKING_FLAG'
  }
}

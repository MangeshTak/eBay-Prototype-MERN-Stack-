import * as api from '../api/hotel';
import * as util from './util';

// Get all hotels
export function getAllHotels(queryParams, filters, sorts, pageNo) {
    var params = queryParams;
    if(filters){
        if(util.toQueryString(filters).length > 0) {
            params += "&";
            params += util.toQueryString(filters);
        }
    }
    if(sorts){
        if(util.toQueryString(sorts).length > 0) {
            params += "&";
            params += util.toQueryString(sorts);
        }
    }
    if(pageNo){
        params += "&pageNo="+pageNo;
    }
    return function(dispatch) {
        return api.getAllHotels(params, function(error , response){
            if(error){
                dispatch({type: "GET_LISTINGS_FAILURE" });
            } else {
                response.then((res) => {
                    if(res.status === 200){
                        dispatch({type: "GET_LISTINGS_SUCCESS"  , payload :  res.data});
                    }else{
                        dispatch({type: "GET_LISTINGS_FAILURE" });
                    }
                })
            }
        })
    };
}

export function updateStarFilter(value) {
  return {
    type: 'UPDATE_STAR_HOTEL_FILTER',
    payload: value
  }
}

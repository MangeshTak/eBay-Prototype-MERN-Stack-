import * as api from '../api/auth';

function checkSessionSuccess(data) {
  	return {type: "SESSION_ACTIVE", data}
}

function checkSessionFailure(){
    return {type: "SESSION_INACTIVE"}
}

export function checkSession() {
	return function(dispatch) {
	    return api.checkSession().then(response => {
	    	if(response.status === 200){
	    		dispatch(checkSessionSuccess(response.data));
	    	} else {
	    		dispatch(checkSessionFailure());
	    	}
	    }).catch(error => {
	      	dispatch(checkSessionFailure());
	    });
	};
}



function logoutSuccess() {
  	return {type: "SESSION_INACTIVE"}
}

function logoutFailure(){
    return {type: "SESSION_INACTIVE"}
}

export function logout() {
	return function(dispatch) {
	    return api.logout().then(response => {
	    	if(response.status === 200){
	    		dispatch(logoutSuccess());
	    	} else {
	    		dispatch(logoutFailure());
	    	}
	    }).catch(error => {
	      	dispatch(logoutFailure());
	    });
	};
}


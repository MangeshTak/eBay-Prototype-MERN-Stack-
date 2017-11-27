const api = process.env.REACT_APP_CONTACTS_API_URL || 'http://localhost:3002/api/v1'

const headers = {
    'Accept': 'application/json'
};

export const signin = (payload) =>
	fetch(api+'/c/signin', {
	    method: 'POST',
	    headers: {
	    	...headers,
            'Content-Type': 'application/json'
        },
        credentials: 'include',
        body: JSON.stringify(payload)
	}).then(res => {
		return res;
	}).catch(error => {
        return error;
    }); 

export const signup = (payload) =>
	fetch(api+'/c/signup', {
	    method: 'POST',
	    headers: {
	    	...headers,
            'Content-Type': 'application/json'
        },
        credentials: 'include',
        body: JSON.stringify(payload)
	}).then(res => {
		return res;
	}).catch(error => {
        return error;
    }); 

export const checkSession = () =>
	fetch(api+'/c/check_session', {
	    method: 'GET',
	    headers: {
	    	...headers,
            'Content-Type': 'application/json'
        },
        credentials: 'include'
	}).then(res => {
		return res.json();
	}).catch(error => {
        return error;
    });

     

export const logout = () =>
	fetch(api+'/logout', {
	    method: 'POST',
	    headers: {
	    	...headers,
            'Content-Type': 'application/json'
        },
        credentials: 'include'
	}).then(res => {
		return res;
	}).catch(error => {
        return error;
    });    

const api = process.env.REACT_APP_CONTACTS_API_URL || 'http://localhost:3002/api/v1'

const headers = {
    'Accept': 'application/json'
};


export const trackClick = (payload) =>
	fetch(api+'/c/track-click', {
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

export const trackTotalDurationSpent = (payload) =>
	fetch(api+'/c/track-total-duration-spent', {
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

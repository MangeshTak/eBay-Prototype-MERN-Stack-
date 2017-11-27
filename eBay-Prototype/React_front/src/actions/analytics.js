import * as api from '../api/analytics';
import * as userActivity from './trackUserActivity';

export function trackClick(payload) {
	return function(dispatch) {
	    return api.trackClick(payload).then(response => {}).catch(error => {
         console.log('tracking failed');
      })
	};
}

export function trackUserActivity(page) {
	return function(dispatch) {
		return userActivity.logPageChange(page);
	}
}

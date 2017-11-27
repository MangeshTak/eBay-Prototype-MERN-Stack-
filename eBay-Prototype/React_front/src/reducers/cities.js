const CITIES = require('../api/cities').CITIES;

const reducer = (state = {cities:CITIES}, action) => {
    switch (action.type) {
        default:
            return state;
    }
};

export default reducer;

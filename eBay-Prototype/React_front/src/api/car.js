const api = process.env.REACT_APP_CONTACTS_API_URL || 'http://localhost:3002/api/v1'

const headers = {
    'Accept': 'application/json'
};


export const getAllCars = (params, callback) => {
    fetch(api+'/c/cars'+params, {
        method: 'GET',
        credentials: 'include',
        headers: {
            ...headers,
            'Content-Type': 'application/json'
        }
    }).then(res => {
        callback(null, res.json());
    }).catch(error => {
        callback( error , {});
    });    
}

export const getCarById = ( id , callback) => {
    fetch(api+'/c/cars/'+id, {
        method: 'GET',
        credentials: 'include',
        headers: {
            ...headers,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify()
    }).then(res => {
        callback(null, res.json());
    }).catch(error => {
        callback( error , {});
    });
}



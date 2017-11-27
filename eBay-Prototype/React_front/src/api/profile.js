const api = process.env.REACT_APP_CONTACTS_API_URL || 'http://localhost:3002/api/v1'

const headers = {
    'Accept': 'application/json'
};

export const getUserDetails = (callback) =>

    fetch(api+'/c/profile', {
        method: 'GET',
        headers: {
            ...headers,
            'Content-Type': 'application/json'
        },
        credentials: 'include'
        
    }).then(res => {
        callback( null , res.json());
    }).catch(error => {
        callback( error , {});
    }); 
    
export const updateUserProfile = (data , callback) => {

    fetch(api+'/c/profile', {
        method: 'PUT',
        credentials: 'include',
        headers: {
            ...headers
            
        },
        body: data
    }).then(res => {
        callback( null , res.json());
    }).catch(error => {
        callback( error , {});
    });    
}

export const getCreditCards = (callback) =>
    fetch(api+'/c/credit_cards', {
        method: 'GET',
        headers: {
            ...headers,
            'Content-Type': 'application/json'
        },
        credentials: 'include'

    }).then(res => {
        callback( null , res.json());
    }).catch(error => {
        callback( error , {});
    });

export const addCreditCard = (payload, callback) =>
    fetch(api+'/c/credit_cards', {
        method: 'POST',
        headers: {
            ...headers,
            'Content-Type': 'application/json'
        },
        credentials: 'include',
        body: JSON.stringify(payload)
    }).then(res => {
        callback( null , res.json());
    }).catch(error => {
        callback( error , {});
    });

export const deleteCreditCard = (id, callback) =>
    fetch(api+'/c/credit_cards/'+id, {
        method: 'DELETE',
        headers: {
            ...headers,
            'Content-Type': 'application/json'
        },
        credentials: 'include',
        body: JSON.stringify()
    }).then(res => {
        callback( null , res.json());
    }).catch(error => {
        callback( error , {});
});



export const getBookingDetails = (callback) =>
    fetch(api+'/c/bookings', {
        method: 'GET',
        headers: {
            ...headers,
            'Content-Type': 'application/json'
        },
        credentials: 'include',
        body: JSON.stringify()
    }).then(res => {
        callback( null , res.json());
    }).catch(error => {
        callback( error , {});
    });





export const getBookingDetailsById = (id , callback) =>
    fetch(api+'/c/bookings/'+id, {
        method: 'GET',
        headers: {
            ...headers,
            'Content-Type': 'application/json'
        },
        credentials: 'include',
        body: JSON.stringify()
    }).then(res => {
        callback( null , res.json());
    }).catch(error => {
        callback( error , {});
    });
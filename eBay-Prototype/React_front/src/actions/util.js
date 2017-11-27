export function toQueryString(obj) {
    var parts = [];
    Object.keys(obj).forEach(function(key) {
        parts.push(encodeURIComponent(key) + "=" + encodeURIComponent(obj[key]));
    });
    return parts.join("&");
}

export function clearListingsFromStore(){
    return {
        type: 'CLEAR_LISTINGS_FROM_STORE'
    }
}
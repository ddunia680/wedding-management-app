const validate = (input) => {
    const results = { email: false, password: false, name: false, number: false };
    // console.log(results);
    switch(input.type) {
        case 'email': 
            if(input.value.includes('@') && input.value.length >= 5) {
                results.email = true
            } else {
                results.email = false
            }
            break;
        case 'password': 
            if(/[A-Z]/.test(input.value) && /^[A-Za-z0-9]*$/.test(input.value) && input.value.toString().length >= 5) {
                results.password = true
            } else {
                results.password = false
            }
            break;
        case 'name': 
            if(input.value.length >= 5) {
                results.name = true
            } else {
                results.name = false
            }
            break;
        case 'number': 
            if(input.value.length >= 5) {
                results.number = true
            } else {
                results.number = false
            }
            break;
        default: 
        console.log('end of check');
    }
    return results;
}

export default validate;